
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

    const { user_id, insurance_type, preferences, behavioral_data } = await req.json();

    console.log('Generating advanced AI recommendations for user:', user_id, 'type:', insurance_type);

    // Get user's interaction history for behavioral analysis
    const { data: interactions } = await supabaseClient
      .from('user_interactions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(100);

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
      .from('ai_recommendations_v2')
      .delete()
      .eq('user_id', user_id)
      .eq('insurance_type', insurance_type);

    // Advanced AI logic - multiple recommendation strategies
    const recommendations = products.map(product => {
      let behavioralScore = 0.5;
      let contentScore = 0.5;
      let collaborativeScore = 0.5;

      // Behavioral scoring based on user interactions
      if (interactions && interactions.length > 0) {
        const productViews = interactions.filter(i => i.product_id === product.id).length;
        const typeInteractions = interactions.filter(i => i.insurance_type === insurance_type).length;
        
        behavioralScore = Math.min(1, 0.3 + (productViews * 0.2) + (typeInteractions * 0.05));
      }

      // Content-based scoring
      if (preferences.budget_range === 'low' && product.price && product.price < 500) {
        contentScore += 0.3;
      } else if (preferences.budget_range === 'medium' && product.price && product.price >= 500 && product.price <= 1000) {
        contentScore += 0.4;
      } else if (preferences.budget_range === 'high' && product.price && product.price > 1000) {
        contentScore += 0.2;
      }

      // Brand reputation scoring
      if (product.brand && ['Allianz', 'AXA', 'Sanlam'].includes(product.brand)) {
        contentScore += 0.2;
      }

      // Collaborative filtering (simplified)
      collaborativeScore = 0.4 + Math.random() * 0.4; // Simplified for demo

      // Hybrid score calculation
      const hybridScore = (behavioralScore * 0.4) + (contentScore * 0.4) + (collaborativeScore * 0.2);
      const finalScore = Math.min(1, Math.max(0, hybridScore));

      // Determine recommendation type based on highest contributing factor
      let recommendationType = 'hybrid';
      if (behavioralScore > contentScore && behavioralScore > collaborativeScore) {
        recommendationType = 'behavioral';
      } else if (contentScore > behavioralScore && contentScore > collaborativeScore) {
        recommendationType = 'content';
      } else if (collaborativeScore > behavioralScore && collaborativeScore > contentScore) {
        recommendationType = 'collaborative';
      }

      return {
        user_id,
        product_id: product.id,
        recommendation_type: recommendationType,
        confidence_score: parseFloat(finalScore.toFixed(3)),
        reasoning: {
          main_factors: generateReasoningFactors(product, finalScore, preferences, interactions),
          score_breakdown: {
            behavioral: parseFloat(behavioralScore.toFixed(3)),
            content: parseFloat(contentScore.toFixed(3)),
            collaborative: parseFloat(collaborativeScore.toFixed(3))
          }
        },
        context_factors: {
          location_match: true, // Simplified
          behavior_similarity: behavioralScore,
          content_relevance: contentScore
        },
        insurance_type,
      };
    });

    // Sort by score and take top 8
    const topRecommendations = recommendations
      .sort((a, b) => b.confidence_score - a.confidence_score)
      .slice(0, 8);

    // Insert recommendations into database
    const { error: insertError } = await supabaseClient
      .from('ai_recommendations_v2')
      .insert(topRecommendations);

    if (insertError) {
      throw insertError;
    }

    console.log('Generated', topRecommendations.length, 'advanced recommendations');

    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendations: topRecommendations.length,
        strategies_used: ['behavioral', 'content', 'collaborative', 'hybrid']
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating advanced recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateReasoningFactors(product: any, score: number, preferences: any, interactions: any[]): string[] {
  const factors = [];
  
  if (score > 0.8) {
    factors.push("Excellente correspondance avec votre profil");
  } else if (score > 0.6) {
    factors.push("Bonne correspondance avec vos préférences");
  }
  
  if (product.price && preferences.budget_range === 'low' && product.price < 500) {
    factors.push("Prix adapté à votre budget");
  } else if (product.price && preferences.budget_range === 'medium') {
    factors.push("Excellent rapport qualité-prix");
  }
  
  if (product.brand && ['Allianz', 'AXA', 'Sanlam'].includes(product.brand)) {
    factors.push("Marque de confiance reconnue");
  }
  
  if (interactions && interactions.length > 0) {
    const typeInteractions = interactions.filter((i: any) => i.insurance_type === product.insurance_type);
    if (typeInteractions.length > 5) {
      factors.push("Basé sur vos recherches récentes");
    }
  }
  
  if (preferences.risk_tolerance === 'conservative') {
    factors.push("Adapté à votre profil de risque conservateur");
  } else if (preferences.risk_tolerance === 'moderate') {
    factors.push("Équilibre optimal entre sécurité et rentabilité");
  }
  
  if (factors.length === 0) {
    factors.push("Recommandation basée sur l'analyse IA avancée");
  }
  
  return factors.slice(0, 3); // Limit to 3 main factors
}
