
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, message, context, user_id } = await req.json();

    // For now, return a simple response since we don't have OpenAI setup yet
    const response = {
      id: crypto.randomUUID(),
      session_id,
      message_type: 'assistant',
      content: `Merci pour votre message : "${message}". Je suis l'assistant virtuel d'assurance. Comment puis-je vous aider avec vos besoins d'assurance en Afrique ?`,
      context: context || {},
      language_code: 'fr',
      created_at: new Date().toISOString()
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in virtual-assistant-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
