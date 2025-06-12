
import { EmbeddingService } from './EmbeddingService';
import { BehavioralAnalysisService } from './BehavioralAnalysisService';
import { AdvancedRecommendationScore } from '@/types/AdvancedAI';

export class AdvancedRecommendationEngine {
  private embeddingService = EmbeddingService.getInstance();
  private behavioralService = BehavioralAnalysisService.getInstance();

  async generateAdvancedRecommendations(
    userId: string,
    userProfile: any,
    interactions: any[],
    availableProducts: any[],
    options: { limit?: number; context?: string } = {}
  ): Promise<any[]> {
    const { limit = 5, context } = options;

    // Étape 1: Analyser le comportement de l'utilisateur
    const behavioralPattern = await this.behavioralService.analyzeUserBehavior(userId, interactions);
    const contextualFactors = await this.behavioralService.getContextualFactors(userId, userProfile);
    const userIntent = await this.behavioralService.predictUserIntent(interactions);

    // Étape 2: Générer les embeddings
    const userEmbedding = await this.embeddingService.generateUserEmbedding(userProfile, interactions);
    const productEmbeddings = await Promise.all(
      availableProducts.map(async product => ({
        product,
        embedding: await this.embeddingService.generateProductEmbedding(product)
      }))
    );

    // Étape 3: Calculer les scores avancés
    const scoredProducts = await Promise.all(
      productEmbeddings.map(async ({ product, embedding }) => {
        const score = await this.calculateAdvancedScore(
          userEmbedding,
          embedding,
          product,
          behavioralPattern,
          contextualFactors,
          userIntent
        );

        return {
          ...product,
          advanced_score: score,
          recommendation_reasoning: this.generateRecommendationReasoning(score, product, behavioralPattern)
        };
      })
    );

    // Étape 4: Appliquer la diversification et le filtrage
    const diversifiedProducts = this.applyDiversification(scoredProducts, behavioralPattern);
    const filteredProducts = this.applyContextualFiltering(diversifiedProducts, contextualFactors);

    // Étape 5: Trier et limiter les résultats
    return filteredProducts
      .sort((a, b) => b.advanced_score.overall_score - a.advanced_score.overall_score)
      .slice(0, limit);
  }

  private async calculateAdvancedScore(
    userEmbedding: number[],
    productEmbedding: number[],
    product: any,
    behavioralPattern: any,
    contextualFactors: any,
    userIntent: string[]
  ): Promise<AdvancedRecommendationScore> {
    // Score de similarité sémantique
    const semanticSimilarity = await this.embeddingService.calculateSimilarity(
      userEmbedding,
      productEmbedding
    );

    // Score de correspondance comportementale
    const behavioralMatch = this.calculateBehavioralMatch(product, behavioralPattern);

    // Score de pertinence contextuelle
    const contextualRelevance = this.calculateContextualRelevance(product, contextualFactors);

    // Score de tendances du marché
    const marketTrends = this.calculateMarketTrendsScore(product, contextualFactors);

    // Score global pondéré
    const overallScore = (
      semanticSimilarity * 0.3 +
      behavioralMatch * 0.25 +
      contextualRelevance * 0.25 +
      marketTrends * 0.2
    );

    // Niveau de confiance basé sur la quantité et la qualité des données
    const confidenceLevel = this.calculateConfidenceLevel(
      behavioralPattern,
      contextualFactors,
      userIntent
    );

    return {
      overall_score: overallScore,
      confidence_level: confidenceLevel,
      explanation: this.generateScoreExplanation(
        semanticSimilarity,
        behavioralMatch,
        contextualRelevance,
        marketTrends,
        product
      ),
      breakdown: {
        semantic_similarity: semanticSimilarity,
        behavioral_match: behavioralMatch,
        contextual_relevance: contextualRelevance,
        market_trends: marketTrends
      }
    };
  }

  private calculateBehavioralMatch(product: any, behavioralPattern: any): number {
    let score = 0.5; // Score de base

    // Correspondance avec les caractéristiques préférées
    const featureMatch = this.calculateFeatureMatch(product, behavioralPattern.preferred_features);
    score += featureMatch * 0.4;

    // Correspondance avec le segment utilisateur
    const segmentMatch = this.calculateSegmentMatch(product, behavioralPattern.user_segment);
    score += segmentMatch * 0.3;

    // Facteur de probabilité de conversion
    score += behavioralPattern.conversion_probability * 0.3;

    return Math.min(1, score);
  }

  private calculateFeatureMatch(product: any, preferredFeatures: string[]): number {
    if (!product.features || preferredFeatures.length === 0) return 0.5;

    const productFeatures = new Set(product.features);
    const matchingFeatures = preferredFeatures.filter(feature => productFeatures.has(feature));
    
    return matchingFeatures.length / preferredFeatures.length;
  }

  private calculateSegmentMatch(product: any, userSegment: string): number {
    const segmentProductMapping = {
      'analytical_buyer': ['detailed_specs', 'comparison_tools', 'expert_reviews'],
      'browser': ['popular_choices', 'trending', 'featured'],
      'quick_decision_maker': ['best_seller', 'recommended', 'quick_quote'],
      'standard_user': ['balanced_features', 'good_value', 'reliable']
    };

    const targetFeatures = segmentProductMapping[userSegment as keyof typeof segmentProductMapping] || [];
    return this.calculateFeatureMatch(product, targetFeatures);
  }

  private calculateContextualRelevance(product: any, contextualFactors: any): number {
    let score = 0.5;

    // Pertinence géographique
    const geoRelevance = this.calculateGeographicRelevance(product, contextualFactors.geographic);
    score += geoRelevance * 0.4;

    // Pertinence temporelle
    const temporalRelevance = this.calculateTemporalRelevance(product, contextualFactors.temporal);
    score += temporalRelevance * 0.3;

    // Pertinence économique
    const economicRelevance = this.calculateEconomicRelevance(product, contextualFactors.economic);
    score += economicRelevance * 0.3;

    return Math.min(1, score);
  }

  private calculateGeographicRelevance(product: any, geographic: any): number {
    // Vérifier la disponibilité dans le pays
    if (!product.country_availability?.includes(geographic.country)) {
      return 0;
    }

    // Correspondance avec les préférences locales
    const localMatch = geographic.local_preferences.some((pref: string) => 
      product.tags?.includes(pref) || product.category?.includes(pref)
    );

    return localMatch ? 0.8 : 0.6;
  }

  private calculateTemporalRelevance(product: any, temporal: any): number {
    let score = 0.5;

    // Pertinence saisonnière
    if (product.seasonal_relevance?.includes(temporal.season)) {
      score += 0.3;
    }

    // Pertinence des événements de marché
    const eventRelevance = temporal.market_events.some((event: string) => 
      product.marketing_tags?.includes(event)
    );
    if (eventRelevance) score += 0.2;

    return Math.min(1, score);
  }

  private calculateEconomicRelevance(product: any, economic: any): number {
    if (!product.price) return 0.5;

    // Correspondance avec la sensibilité au prix
    const priceScore = this.calculatePriceScore(product.price, economic);
    
    // Correspondance avec la catégorie de budget
    const budgetScore = this.calculateBudgetScore(product, economic.budget_category);

    return (priceScore + budgetScore) / 2;
  }

  private calculatePriceScore(price: number, economic: any): number {
    const { price_sensitivity } = economic;
    
    // Score inversement proportionnel au prix pour les utilisateurs sensibles au prix
    if (price_sensitivity > 0.7) {
      return Math.max(0, 1 - (price / 2000));
    } else if (price_sensitivity < 0.3) {
      return Math.min(1, price / 1000); // Les utilisateurs moins sensibles préfèrent parfois les produits plus chers
    }
    
    return 0.5; // Neutral pour la sensibilité moyenne
  }

  private calculateBudgetScore(product: any, budgetCategory: string): number {
    const budgetRanges = {
      'low': { min: 0, max: 500 },
      'medium': { min: 500, max: 1500 },
      'high': { min: 1500, max: Infinity }
    };

    const range = budgetRanges[budgetCategory as keyof typeof budgetRanges];
    if (!range || !product.price) return 0.5;

    if (product.price >= range.min && product.price <= range.max) {
      return 1;
    }

    // Score dégradé si hors budget
    const distance = Math.min(
      Math.abs(product.price - range.min),
      Math.abs(product.price - range.max)
    );
    
    return Math.max(0, 1 - (distance / 1000));
  }

  private calculateMarketTrendsScore(product: any, contextualFactors: any): number {
    let score = 0.5;

    // Popularité du produit (simulation)
    const popularityScore = Math.random() * 0.3 + 0.2; // 0.2 - 0.5
    score += popularityScore;

    // Nouveauté du produit
    const ageInDays = product.created_at ? 
      (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24) : 365;
    const noveltyScore = Math.max(0, (365 - ageInDays) / 365) * 0.2;
    score += noveltyScore;

    // Score de tendance sectorielle
    const sectorTrendScore = Math.random() * 0.3; // Simulation
    score += sectorTrendScore;

    return Math.min(1, score);
  }

  private calculateConfidenceLevel(behavioralPattern: any, contextualFactors: any, userIntent: string[]): number {
    let confidence = 0.5;

    // Confiance basée sur la quantité de données comportementales
    const dataRichness = Math.min(1, behavioralPattern.interaction_sequence.length / 20);
    confidence += dataRichness * 0.3;

    // Confiance basée sur la clarté de l'intention
    const intentClarity = userIntent.length > 0 ? 0.2 : 0;
    confidence += intentClarity;

    // Confiance basée sur la fraîcheur des données
    const dataFreshness = behavioralPattern.conversion_probability > 0.3 ? 0.2 : 0.1;
    confidence += dataFreshness;

    return Math.min(0.95, confidence);
  }

  private generateScoreExplanation(
    semanticSimilarity: number,
    behavioralMatch: number,
    contextualRelevance: number,
    marketTrends: number,
    product: any
  ): any {
    const factors = [];
    const secondary = [];
    const risks = [];

    // Facteurs principaux
    if (semanticSimilarity > 0.7) {
      factors.push("Très bonne correspondance avec vos préférences");
    }
    if (behavioralMatch > 0.7) {
      factors.push("Correspond à votre profil d'achat");
    }
    if (contextualRelevance > 0.7) {
      factors.push("Adapté à votre situation actuelle");
    }

    // Facteurs secondaires
    if (marketTrends > 0.6) {
      secondary.push("Produit populaire sur le marché");
    }
    if (product.rating && product.rating > 4) {
      secondary.push("Bien noté par les utilisateurs");
    }

    // Facteurs de risque
    if (semanticSimilarity < 0.4) {
      risks.push("Correspondance limitée avec vos critères");
    }
    if (product.price && product.price > 2000) {
      risks.push("Prix élevé");
    }

    return {
      primary_factors: factors,
      secondary_factors: secondary,
      risk_factors: risks
    };
  }

  private generateRecommendationReasoning(score: AdvancedRecommendationScore, product: any, behavioralPattern: any): string {
    const reasons = [];

    if (score.breakdown.semantic_similarity > 0.7) {
      reasons.push("correspond parfaitement à vos critères de recherche");
    }

    if (score.breakdown.behavioral_match > 0.7) {
      reasons.push(`adapté aux ${behavioralPattern.user_segment.replace('_', ' ')}`);
    }

    if (score.breakdown.contextual_relevance > 0.7) {
      reasons.push("particulièrement pertinent dans votre contexte actuel");
    }

    if (score.breakdown.market_trends > 0.6) {
      reasons.push("tendance populaire du moment");
    }

    const baseReason = reasons.length > 0 ? reasons.join(", ") : "recommandation basée sur l'analyse IA";
    return `Ce produit est recommandé car il ${baseReason}.`;
  }

  private applyDiversification(products: any[], behavioralPattern: any): any[] {
    // Grouper par catégorie/type
    const categories = new Map<string, any[]>();
    products.forEach(product => {
      const category = product.category || 'default';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(product);
    });

    // Sélectionner les meilleurs de chaque catégorie
    const diversified = [];
    const maxPerCategory = Math.max(1, Math.floor(10 / categories.size));

    for (const [category, categoryProducts] of categories) {
      const topProducts = categoryProducts
        .sort((a, b) => b.advanced_score.overall_score - a.advanced_score.overall_score)
        .slice(0, maxPerCategory);
      
      diversified.push(...topProducts);
    }

    return diversified;
  }

  private applyContextualFiltering(products: any[], contextualFactors: any): any[] {
    return products.filter(product => {
      // Filtrer par disponibilité géographique
      if (!product.country_availability?.includes(contextualFactors.geographic.country)) {
        return false;
      }

      // Filtrer par conditions économiques
      const maxPrice = this.getMaxPriceForBudget(contextualFactors.economic.budget_category);
      if (product.price && product.price > maxPrice) {
        return false;
      }

      return true;
    });
  }

  private getMaxPriceForBudget(budgetCategory: string): number {
    const budgetLimits = {
      'low': 800,
      'medium': 2000,
      'high': Infinity
    };
    
    return budgetLimits[budgetCategory as keyof typeof budgetLimits] || 2000;
  }
}
