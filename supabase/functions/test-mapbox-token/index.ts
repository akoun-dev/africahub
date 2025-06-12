
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    console.log('🧪 Testing Mapbox token:', token.substring(0, 20) + '...');

    // Test the token by making a request to Mapbox API
    const testResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const responseData = await testResponse.json();
    console.log('🔍 Mapbox API response status:', testResponse.status);

    if (testResponse.ok) {
      console.log('✅ Mapbox token test successful');
      return new Response(
        JSON.stringify({ 
          valid: true,
          status: testResponse.status,
          message: 'Token is valid and working correctly'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.log('❌ Mapbox token test failed:', responseData);
      return new Response(
        JSON.stringify({ 
          valid: false,
          status: testResponse.status,
          message: responseData.message || 'Token is invalid or expired',
          details: responseData
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('💥 Error in test-mapbox-token function:', error);
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: error.message,
        message: 'Failed to test token due to network or server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
