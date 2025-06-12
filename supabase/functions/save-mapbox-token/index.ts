
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
    const { token } = await req.json();
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate token format
    if (!token.startsWith('pk.') || token.length < 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid Mapbox token format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Test the token by making a request to Mapbox API
    console.log('🧪 Testing Mapbox token before saving...');
    const testResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`
    );

    if (!testResponse.ok) {
      console.log('❌ Token validation failed:', testResponse.status);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired Mapbox token' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Token validation successful');

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current user from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if user is admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (!userRoles || userRoles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Disable all existing tokens
    await supabase
      .from('mapbox_config')
      .update({ is_active: false })
      .eq('is_active', true);

    // Save the new token to database
    const { data: savedConfig, error: saveError } = await supabase
      .from('mapbox_config')
      .insert({
        token: token,
        is_active: true,
        created_by: user.id
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Database save error:', saveError);
      return new Response(
        JSON.stringify({ error: 'Failed to save token to database' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Mapbox token saved successfully to database');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Token saved and validated successfully',
        configured: true,
        id: savedConfig.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('💥 Error in save-mapbox-token function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
