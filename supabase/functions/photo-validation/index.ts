
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { photoUrl, userId } = await req.json()

    // Validation basique de l'URL
    if (!photoUrl || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing photoUrl or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier que l'utilisateur existe
    const { data: user } = await supabase.auth.admin.getUserById(userId)
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Pour le moment, on retourne toujours une validation positive
    // Dans le futur, on pourrait ajouter une API de modération d'images ici
    const validationResult = {
      isValid: true,
      confidence: 0.95,
      reasons: [],
      watermarked: false
    }

    console.log(`Photo validation for user ${userId}: ${JSON.stringify(validationResult)}`)

    return new Response(
      JSON.stringify(validationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Photo validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
