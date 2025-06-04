
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { user_id, insurance_type, preferences } = await req.json();

    console.log('Generating AI recommendations for user:', user_id, 'type:', insurance_type);

    // Get products for the specified insurance type
    const { data: productTypes, error: typeError } = await supabaseClient
      .from('product_types')
      .select('id')
      .eq('slug', insurance_type)
      .single();

    if (typeError) {
      throw new Error('Product type not found');
    }

    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('product_type_id', productTypes.id)
      .eq('is_active', true);

    if (productsError) {
      throw new Error('Failed to fetch products');
    }

    // Clear existing recommendations for this user and insurance type
    await supabaseClient
      .from('ai_recommendations')
      .delete()
      .eq('user_id', user_id)
      .eq('insurance_type', insurance_type);

    // Simple AI logic - score products based on criteria
    const recommendations = products.map(product => {
      let score = 0.5; // Base score

      // Price scoring (lower price = higher score for budget-conscious users)
      if (preferences.budget_range === 'low' && product.price && product.price < 500) {
        score += 0.2;
      } else if (preferences.budget_range === 'medium' && product.price && product.price >= 500 && product.price <= 1000) {
        score += 0.3;
      } else if (preferences.budget_range === 'high' && product.price && product.price > 1000) {
        score += 0.2;
      }

      // Brand scoring (premium brands get higher scores)
      if (product.brand && ['Allianz', 'AXA', 'Sanlam'].includes(product.brand)) {
        score += 0.1;
      }

      // Risk tolerance scoring
      if (preferences.risk_tolerance === 'conservative') {
        score += 0.1;
      } else if (preferences.risk_tolerance === 'moderate') {
        score += 0.15;
      } else if (preferences.risk_tolerance === 'aggressive') {
        score += 0.05;
      }

      // Random factor to simulate AI complexity
      score += Math.random() * 0.1;

      // Ensure score is between 0 and 1
      score = Math.min(1, Math.max(0, score));

      return {
        user_id,
        product_id: product.id,
        recommendation_score: parseFloat(score.toFixed(2)),
        reasoning: generateReasoning(product, score, preferences),
        insurance_type,
      };
    });

    // Sort by score and take top 5
    const topRecommendations = recommendations
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, 5);

    // Insert recommendations into database
    const { error: insertError } = await supabaseClient
      .from('ai_recommendations')
      .insert(topRecommendations);

    if (insertError) {
      throw insertError;
    }

    console.log('Generated', topRecommendations.length, 'recommendations');

    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendations: topRecommendations.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateReasoning(product: any, score: number, preferences: any): string {
  const reasons = [];
  
  if (score > 0.8) {
    reasons.push("Excellent rapport qualité-prix");
  }
  
  if (product.price && preferences.budget_range === 'low' && product.price < 500) {
    reasons.push("Prix abordable adapté à votre budget");
  }
  
  if (product.brand && ['Allianz', 'AXA', 'Sanlam'].includes(product.brand)) {
    reasons.push("Marque reconnue et fiable");
  }
  
  if (preferences.risk_tolerance === 'conservative') {
    reasons.push("Offre sécurisée pour profil conservateur");
  }
  
  if (reasons.length === 0) {
    reasons.push("Bon équilibre entre couverture et prix");
  }
  
  return reasons.join(", ");
}
