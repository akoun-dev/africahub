
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 Fetching active Mapbox token from database...');

    // Get the active Mapbox token from database
    const { data: mapboxConfig, error: configError } = await supabase
      .from('mapbox_config')
      .select('token, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (configError) {
      console.error('❌ Database error:', configError);
      return new Response(
        JSON.stringify({ 
          token: null,
          configured: false,
          message: 'Error fetching Mapbox configuration from database'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // If no token found in database, check environment variables as fallback
    if (!mapboxConfig?.token) {
      console.log('🔍 No token in database, checking environment variables...');
      const envToken = Deno.env.get('MAPBOX_TOKEN');
      
      if (!envToken) {
        console.log('❌ No Mapbox token configured');
        return new Response(
          JSON.stringify({ 
            token: null,
            configured: false,
            message: 'No Mapbox token configured. Please configure one in Admin → Mapbox.'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Validate the environment token format
      if (!envToken.startsWith('pk.') || envToken.length < 50) {
        console.log('❌ Invalid environment Mapbox token format');
        return new Response(
          JSON.stringify({ 
            token: null,
            configured: false,
            message: 'Invalid Mapbox token format. Please reconfigure.'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log('✅ Valid Mapbox token found in environment');
      return new Response(
        JSON.stringify({ 
          token: envToken,
          configured: true,
          message: 'Mapbox token configured via environment variables'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = mapboxConfig.token;

    // Validate the database token format
    if (!token.startsWith('pk.') || token.length < 50) {
      console.log('❌ Invalid database Mapbox token format');
      return new Response(
        JSON.stringify({ 
          token: null,
          configured: false,
          message: 'Invalid Mapbox token format in database. Please reconfigure.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Valid Mapbox token found in database');
    return new Response(
      JSON.stringify({ 
        token: token,
        configured: true,
        message: 'Mapbox token configured successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('💥 Error in get-mapbox-token function:', error);
    return new Response(
      JSON.stringify({ 
        token: null,
        configured: false,
        error: error.message,
        message: 'Error retrieving Mapbox token'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
