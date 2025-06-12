
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalculationRequest {
  productId: string;
  userCriteria: Record<string, any>;
  userId?: string;
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
    );

    const { productId, userCriteria, userId }: CalculationRequest = await req.json();

    console.log('Processing price calculation for product:', productId);

    // 1. Récupérer les informations du produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        companies (
          id,
          name
        )
      `)
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Product not found:', productError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Produit non trouvé'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    // 2. Vérifier le type de pricing
    if (product.pricing_type === 'fixed') {
      // Prix fixe - retourner directement le prix du produit
      return new Response(
        JSON.stringify({
          success: true,
          price: product.price,
          currency: product.currency || 'XOF',
          details: {
            type: 'fixed',
            productName: product.name,
            company: product.companies?.name
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 3. Prix calculé - récupérer l'algorithme de la compagnie
    const { data: algorithm, error: algorithmError } = await supabase
      .from('pricing_algorithms')
      .select('*')
      .eq('company_id', product.company_id)
      .eq('is_active', true)
      .single();

    if (algorithmError || !algorithm) {
      console.error('Pricing algorithm not found:', algorithmError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Algorithme de calcul non disponible pour cette compagnie'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // 4. Appeler l'API de la compagnie pour calculer le prix
    const calculationResult = await callCompanyPricingAPI(
      algorithm,
      product,
      userCriteria
    );

    if (!calculationResult.success) {
      return new Response(
        JSON.stringify(calculationResult),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // 5. Retourner le résultat
    return new Response(
      JSON.stringify(calculationResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in calculate-insurance-price:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erreur interne du serveur'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function callCompanyPricingAPI(
  algorithm: any,
  product: any,
  userCriteria: Record<string, any>
): Promise<any> {
  try {
    // Préparer les headers d'authentification
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (algorithm.auth_type === 'api_key') {
      headers['X-API-Key'] = algorithm.auth_config.api_key || '';
    } else if (algorithm.auth_type === 'bearer') {
      headers['Authorization'] = `Bearer ${algorithm.auth_config.token || ''}`;
    } else if (algorithm.auth_type === 'basic') {
      const credentials = btoa(`${algorithm.auth_config.username}:${algorithm.auth_config.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // Préparer le payload pour l'API de la compagnie
    const payload = {
      productId: product.id,
      productType: product.category,
      userCriteria: userCriteria,
      calculationConfig: product.calculation_config || {}
    };

    console.log('Calling company API:', algorithm.endpoint);

    // Appel à l'API de la compagnie avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes timeout

    const response = await fetch(algorithm.endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Company API error:', response.status, response.statusText);
      return {
        success: false,
        error: `Erreur de l'API de la compagnie: ${response.status}`
      };
    }

    const result = await response.json();

    // Standardiser la réponse
    return {
      success: true,
      price: result.price || result.amount || result.premium,
      currency: result.currency || product.currency || 'XOF',
      details: {
        type: 'calculated',
        productName: product.name,
        company: product.companies?.name,
        calculation: result.calculation || {},
        apiResponse: result
      }
    };

  } catch (error) {
    console.error('Error calling company pricing API:', error);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Timeout - L\'API de la compagnie met trop de temps à répondre'
      };
    }

    return {
      success: false,
      error: 'Erreur lors de l\'appel à l\'API de la compagnie'
    };
  }
}
