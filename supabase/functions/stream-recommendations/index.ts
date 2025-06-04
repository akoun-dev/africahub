
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

    const { user_id, insurance_type, stream_config } = await req.json();
    const { batch_size = 5, refresh_interval = 30000, enable_real_time = true } = stream_config || {};

    console.log('Starting recommendation stream for user:', user_id);

    // Générer les recommandations initiales
    const recommendations = await generateAdvancedRecommendations(
      supabaseClient,
      user_id,
      insurance_type,
      batch_size
    );

    // Diffuser les recommandations via Realtime
    if (enable_real_time) {
      const { error: broadcastError } = await supabaseClient
        .channel(`recommendations-${user_id}`)
        .send({
          type: 'broadcast',
          event: 'recommendation_update',
          payload: {
            recommendations,
            metadata: {
              processing_time: Date.now(),
              algorithm_version: '3.0',
              batch_size: recommendations.length
            }
          }
        });

      if (broadcastError) {
        console.error('Broadcast error:', broadcastError);
      }
    }

    // Programmer les mises à jour périodiques (simulation)
    EdgeRuntime.waitUntil(schedulePeriodicUpdates(
      supabaseClient,
      user_id,
      insurance_type,
      refresh_interval,
      batch_size
    ));

    return new Response(
      JSON.stringify({ 
        success: true, 
        initial_recommendations: recommendations.length,
        stream_config: {
          batch_size,
          refresh_interval,
          enable_real_time
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in stream-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateAdvancedRecommendations(
  supabaseClient: any,
  userId: string,
  insuranceType: string,
  limit: number
) {
  // Récupérer le profil utilisateur et les interactions
  const [userProfile, interactions, products] = await Promise.all([
    getUserProfile(supabaseClient, userId),
    getUserInteractions(supabaseClient, userId),
    getAvailableProducts(supabaseClient, insuranceType)
  ]);

  // Analyser le comportement utilisateur
  const behavioralAnalysis = analyzeBehavioralPatterns(interactions);
  const contextualFactors = getContextualFactors(userProfile);

  // Générer les scores avancés pour chaque produit
  const scoredProducts = products.map(product => {
    const scores = calculateAdvancedScores(
      product,
      userProfile,
      behavioralAnalysis,
      contextualFactors
    );

    return {
      ...product,
      advanced_score: scores,
      recommendation_reasoning: generateReasoning(scores, product, behavioralAnalysis)
    };
  });

  // Appliquer la diversification et filtrer
  const diversified = applyDiversification(scoredProducts);
  const filtered = applyContextualFiltering(diversified, contextualFactors);

  return filtered
    .sort((a, b) => b.advanced_score.overall_score - a.advanced_score.overall_score)
    .slice(0, limit);
}

async function getUserProfile(supabaseClient: any, userId: string) {
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: preferences } = await supabaseClient
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId);

  return { ...profile, preferences: preferences || [] };
}

async function getUserInteractions(supabaseClient: any, userId: string) {
  const { data: interactions } = await supabaseClient
    .from('user_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  return interactions || [];
}

async function getAvailableProducts(supabaseClient: any, insuranceType: string) {
  const { data: productTypes } = await supabaseClient
    .from('product_types')
    .select('id')
    .eq('slug', insuranceType);

  if (!productTypes?.length) return [];

  const { data: products } = await supabaseClient
    .from('products')
    .select('*')
    .in('product_type_id', productTypes.map(pt => pt.id))
    .eq('is_active', true)
    .limit(50);

  return products || [];
}

function analyzeBehavioralPatterns(interactions: any[]) {
  const patterns = {
    engagement_level: calculateEngagementLevel(interactions),
    price_sensitivity: calculatePriceSensitivity(interactions),
    feature_preferences: extractFeaturePreferences(interactions),
    timing_patterns: analyzeTimingPatterns(interactions),
    conversion_probability: calculateConversionProbability(interactions)
  };

  return patterns;
}

function calculateEngagementLevel(interactions: any[]) {
  if (!interactions.length) return 0.5;

  const avgDuration = interactions
    .filter(i => i.duration_seconds)
    .reduce((sum, i) => sum + i.duration_seconds, 0) / interactions.length;

  return Math.min(1, avgDuration / 300); // Normaliser à 5 minutes
}

function calculatePriceSensitivity(interactions: any[]) {
  const priceInteractions = interactions.filter(i => i.metadata?.price_viewed);
  if (!priceInteractions.length) return 0.5;

  const avgPriceViewed = priceInteractions.reduce(
    (sum, i) => sum + (i.metadata.price_viewed || 0), 0
  ) / priceInteractions.length;

  return avgPriceViewed < 500 ? 0.8 : avgPriceViewed > 2000 ? 0.2 : 0.5;
}

function extractFeaturePreferences(interactions: any[]) {
  const features = new Map();
  interactions.forEach(interaction => {
    if (interaction.metadata?.features_viewed) {
      interaction.metadata.features_viewed.forEach((feature: string) => {
        features.set(feature, (features.get(feature) || 0) + 1);
      });
    }
  });

  return Array.from(features.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([feature]) => feature);
}

function analyzeTimingPatterns(interactions: any[]) {
  const hours = interactions.map(i => new Date(i.created_at).getHours());
  const peakHours = [];

  for (let hour = 0; hour < 24; hour++) {
    const count = hours.filter(h => h === hour).length;
    if (count > interactions.length / 24) {
      peakHours.push(hour);
    }
  }

  return { peak_hours: peakHours };
}

function calculateConversionProbability(interactions: any[]) {
  if (!interactions.length) return 0.1;

  const clickRate = interactions.filter(i => i.interaction_type === 'click').length / interactions.length;
  const engagementScore = calculateEngagementLevel(interactions);
  
  return Math.min(0.95, (clickRate * 0.6 + engagementScore * 0.4));
}

function getContextualFactors(userProfile: any) {
  return {
    geographic: {
      country: userProfile.country || 'unknown',
      local_preferences: getLocalPreferences(userProfile.country)
    },
    temporal: {
      time_of_day: new Date().getHours(),
      season: getCurrentSeason()
    },
    economic: {
      budget_category: userProfile.preferences?.[0]?.budget_range || 'medium',
      price_sensitivity: 0.5
    }
  };
}

function getLocalPreferences(country: string) {
  const preferences = {
    'france': ['premium_brands', 'comprehensive_coverage'],
    'senegal': ['affordable', 'mobile_friendly'],
    'cote_divoire': ['local_support', 'simple_process']
  };
  return preferences[country as keyof typeof preferences] || [];
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month < 3 || month === 11) return 'winter';
  if (month < 6) return 'spring';
  if (month < 9) return 'summer';
  return 'autumn';
}

function calculateAdvancedScores(product: any, userProfile: any, behavioral: any, contextual: any) {
  const semanticSimilarity = calculateSemanticScore(product, userProfile, behavioral);
  const behavioralMatch = calculateBehavioralScore(product, behavioral);
  const contextualRelevance = calculateContextualScore(product, contextual);
  const marketTrends = calculateMarketScore(product);

  const overallScore = (
    semanticSimilarity * 0.3 +
    behavioralMatch * 0.25 +
    contextualRelevance * 0.25 +
    marketTrends * 0.2
  );

  return {
    overall_score: overallScore,
    confidence_level: calculateConfidence(behavioral, contextual),
    breakdown: {
      semantic_similarity: semanticSimilarity,
      behavioral_match: behavioralMatch,
      contextual_relevance: contextualRelevance,
      market_trends: marketTrends
    }
  };
}

function calculateSemanticScore(product: any, userProfile: any, behavioral: any) {
  let score = 0.5;

  // Match des préférences de caractéristiques
  if (behavioral.feature_preferences?.length > 0) {
    const productFeatures = product.features || [];
    const matchingFeatures = behavioral.feature_preferences.filter(
      (pref: string) => productFeatures.includes(pref)
    );
    score += (matchingFeatures.length / behavioral.feature_preferences.length) * 0.4;
  }

  return Math.min(1, score);
}

function calculateBehavioralScore(product: any, behavioral: any) {
  let score = 0.5;

  // Score d'engagement
  score += behavioral.engagement_level * 0.3;

  // Probabilité de conversion
  score += behavioral.conversion_probability * 0.4;

  // Correspondance temporelle
  const currentHour = new Date().getHours();
  if (behavioral.timing_patterns?.peak_hours?.includes(currentHour)) {
    score += 0.2;
  }

  return Math.min(1, score);
}

function calculateContextualScore(product: any, contextual: any) {
  let score = 0.5;

  // Disponibilité géographique
  if (product.country_availability?.includes(contextual.geographic.country)) {
    score += 0.3;
  }

  // Correspondance avec le budget
  const budgetMatch = calculateBudgetMatch(product.price, contextual.economic.budget_category);
  score += budgetMatch * 0.4;

  return Math.min(1, score);
}

function calculateBudgetMatch(price: number, budgetCategory: string) {
  if (!price) return 0.5;

  const budgetRanges = {
    'low': { min: 0, max: 500 },
    'medium': { min: 500, max: 1500 },
    'high': { min: 1500, max: Infinity }
  };

  const range = budgetRanges[budgetCategory as keyof typeof budgetRanges];
  return (price >= range.min && price <= range.max) ? 1 : 0.3;
}

function calculateMarketScore(product: any) {
  // Score de tendance (simulation)
  return 0.5 + Math.random() * 0.4;
}

function calculateConfidence(behavioral: any, contextual: any) {
  let confidence = 0.5;

  // Confiance basée sur les données comportementales
  if (behavioral.engagement_level > 0.6) confidence += 0.2;
  if (behavioral.conversion_probability > 0.5) confidence += 0.2;

  return Math.min(0.95, confidence);
}

function generateReasoning(scores: any, product: any, behavioral: any) {
  const reasons = [];

  if (scores.breakdown.semantic_similarity > 0.7) {
    reasons.push("correspond à vos préférences");
  }
  if (scores.breakdown.behavioral_match > 0.7) {
    reasons.push("adapté à votre profil d'usage");
  }
  if (scores.breakdown.contextual_relevance > 0.7) {
    reasons.push("pertinent dans votre contexte");
  }

  return reasons.length > 0 
    ? `Recommandé car ${reasons.join(", ")}.`
    : "Recommandation basée sur l'analyse IA avancée.";
}

function applyDiversification(products: any[]) {
  // Grouper par catégorie et sélectionner le meilleur de chaque
  const categories = new Map();
  products.forEach(product => {
    const category = product.brand || 'default';
    if (!categories.has(category) || 
        product.advanced_score.overall_score > categories.get(category).advanced_score.overall_score) {
      categories.set(category, product);
    }
  });

  return Array.from(categories.values());
}

function applyContextualFiltering(products: any[], contextual: any) {
  return products.filter(product => {
    // Filtrer par disponibilité
    if (!product.country_availability?.includes(contextual.geographic.country)) {
      return false;
    }

    return true;
  });
}

async function schedulePeriodicUpdates(
  supabaseClient: any,
  userId: string,
  insuranceType: string,
  interval: number,
  batchSize: number
) {
  let updateCount = 0;
  const maxUpdates = 10; // Limiter le nombre de mises à jour

  const updateTimer = setInterval(async () => {
    try {
      if (updateCount >= maxUpdates) {
        clearInterval(updateTimer);
        return;
      }

      console.log(`Generating periodic update ${updateCount + 1} for user ${userId}`);

      const recommendations = await generateAdvancedRecommendations(
        supabaseClient,
        userId,
        insuranceType,
        batchSize
      );

      // Diffuser les nouvelles recommandations
      await supabaseClient
        .channel(`recommendations-${userId}`)
        .send({
          type: 'broadcast',
          event: 'recommendation_update',
          payload: {
            recommendations,
            metadata: {
              processing_time: Date.now(),
              update_number: updateCount + 1,
              is_periodic_update: true
            }
          }
        });

      updateCount++;

    } catch (error) {
      console.error('Error in periodic update:', error);
    }
  }, interval);

  // Nettoyer après 30 minutes maximum
  setTimeout(() => {
    clearInterval(updateTimer);
    console.log(`Stopped periodic updates for user ${userId}`);
  }, 30 * 60 * 1000);
}
