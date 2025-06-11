import { SearchResult } from '@/types/search';
import { AIRecommendation } from '@/types/recommendations';

export interface UserProfile {
  id: string;
  preferences: {
    budget_range: 'low' | 'medium' | 'high';
    risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
    preferred_brands: string[];
    preferred_categories: string[];
  };
  behavior: {
    recent_searches: string[];
    viewed_products: string[];
    compared_products: string[];
    location: string;
  };
}

export interface RecommendationContext {
  current_product?: SearchResult;
  search_query?: string;
  user_location?: string;
  time_of_day?: 'morning' | 'afternoon' | 'evening';
  season?: 'dry' | 'rainy';
}

// Interface interne pour le moteur de recommandation
interface InternalRecommendation {
  product: SearchResult;
  score: number;
  reasoning: string[];
  confidence: number;
  type: 'similar' | 'complementary' | 'popular' | 'personalized';
}

export class RecommendationEngine {
  private static readonly WEIGHTS = {
    behavior: 0.4,
    preferences: 0.3,
    popularity: 0.2,
    contextual: 0.1
  };

  static async generateRecommendations(
    userProfile: UserProfile,
    context: RecommendationContext,
    availableProducts: SearchResult[],
    limit: number = 6
  ): Promise<AIRecommendation[]> {
    console.log('🤖 Génération de recommandations IA pour:', userProfile.id);

    const scoredProducts = availableProducts.map(product => {
      const score = this.calculateRecommendationScore(product, userProfile, context);
      const reasoning = this.generateReasoning(product, userProfile, context, score);
      
      return {
        product,
        score,
        reasoning,
        confidence: Math.min(score * 1.2, 1),
        type: this.determineRecommendationType(product, context)
      } as InternalRecommendation;
    });

    const filteredRecommendations = scoredProducts
      .filter(rec => rec.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Convertir vers le format AIRecommendation unifié
    return filteredRecommendations.map(rec => ({
      id: rec.product.id,
      user_id: userProfile.id,
      product_id: rec.product.id,
      recommendation_score: rec.score,
      reasoning: rec.reasoning.join(', '), // Convertir array en string
      insurance_type: rec.product.category,
      created_at: new Date().toISOString(),
      products: {
        name: rec.product.name,
        brand: rec.product.brand,
        price: rec.product.price,
        currency: rec.product.currency,
        description: rec.product.category
      },
      product: rec.product,
      score: rec.score,
      confidence: rec.confidence,
      type: rec.type
    } as AIRecommendation));
  }

  private static calculateRecommendationScore(
    product: SearchResult,
    profile: UserProfile,
    context: RecommendationContext
  ): number {
    let score = 0;

    const behaviorScore = this.calculateBehaviorScore(product, profile);
    score += behaviorScore * this.WEIGHTS.behavior;

    const preferenceScore = this.calculatePreferenceScore(product, profile);
    score += preferenceScore * this.WEIGHTS.preferences;

    const popularityScore = this.calculatePopularityScore(product);
    score += popularityScore * this.WEIGHTS.popularity;

    const contextualScore = this.calculateContextualScore(product, context);
    score += contextualScore * this.WEIGHTS.contextual;

    return Math.min(score, 1);
  }

  private static calculateBehaviorScore(product: SearchResult, profile: UserProfile): number {
    let score = 0;

    if (profile.behavior.recent_searches.some(search => 
      search.toLowerCase().includes(product.category.toLowerCase())
    )) {
      score += 0.3;
    }

    if (profile.behavior.recent_searches.some(search => 
      search.toLowerCase().includes(product.brand.toLowerCase())
    )) {
      score += 0.2;
    }

    if (profile.behavior.location === product.location) {
      score += 0.2;
    }

    const viewedCategories = profile.behavior.viewed_products;
    if (viewedCategories.includes(product.category)) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }

  private static calculatePreferenceScore(product: SearchResult, profile: UserProfile): number {
    let score = 0;

    const budgetRange = profile.preferences.budget_range;
    if (budgetRange === 'low' && product.price < 500) score += 0.4;
    else if (budgetRange === 'medium' && product.price >= 500 && product.price <= 2000) score += 0.4;
    else if (budgetRange === 'high' && product.price > 2000) score += 0.4;

    if (profile.preferences.preferred_brands.includes(product.brand)) {
      score += 0.3;
    }

    if (profile.preferences.preferred_categories.includes(product.category)) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }

  private static calculatePopularityScore(product: SearchResult): number {
    const ratingScore = product.rating / 5;
    const reviewScore = Math.min(product.reviewCount / 100, 1);
    
    return (ratingScore * 0.6 + reviewScore * 0.4);
  }

  private static calculateContextualScore(product: SearchResult, context: RecommendationContext): number {
    let score = 0.5;

    if (context.current_product) {
      if (context.current_product.category === product.category) {
        score += 0.3;
      }
      if (context.current_product.brand === product.brand) {
        score += 0.2;
      }
    }

    if (context.user_location && product.location === context.user_location) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  private static generateReasoning(
    product: SearchResult,
    profile: UserProfile,
    context: RecommendationContext,
    score: number
  ): string[] {
    const reasons: string[] = [];

    if (score > 0.8) {
      reasons.push("Excellent match pour votre profil");
    }

    if (profile.preferences.preferred_brands.includes(product.brand)) {
      reasons.push("Marque dans vos préférences");
    }

    if (product.rating >= 4.5) {
      reasons.push("Très bien noté par les utilisateurs");
    }

    if (context.current_product?.category === product.category) {
      reasons.push("Similaire à ce que vous consultez");
    }

    if (product.location === profile.behavior.location) {
      reasons.push("Disponible dans votre région");
    }

    if (reasons.length === 0) {
      reasons.push("Recommandé par notre IA");
    }

    return reasons;
  }

  private static determineRecommendationType(
    product: SearchResult,
    context: RecommendationContext
  ): 'similar' | 'complementary' | 'popular' | 'personalized' {
    if (context.current_product) {
      if (context.current_product.category === product.category) {
        return 'similar';
      }
      return 'complementary';
    }

    if (product.rating >= 4.5 && product.reviewCount > 50) {
      return 'popular';
    }

    return 'personalized';
  }

  static trackInteraction(
    userId: string,
    productId: string,
    interactionType: 'view' | 'click' | 'compare' | 'favorite'
  ): void {
    const interactions = JSON.parse(localStorage.getItem('ai_interactions') || '[]');
    interactions.push({
      userId,
      productId,
      type: interactionType,
      timestamp: Date.now()
    });
    
    localStorage.setItem('ai_interactions', JSON.stringify(interactions.slice(-500)));
  }

  static getPersonalizedInsights(userId: string): {
    top_categories: string[];
    preferred_price_range: { min: number; max: number };
    favorite_brands: string[];
    activity_score: number;
  } {
    const interactions = JSON.parse(localStorage.getItem('ai_interactions') || '[]')
      .filter((i: any) => i.userId === userId);

    const categoryCount = new Map();
    const brandCount = new Map();
    const prices: number[] = [];

    interactions.forEach((interaction: any) => {
      const mockCategory = ['assurance-auto', 'smartphones', 'ordinateurs'][Math.floor(Math.random() * 3)];
      const mockBrand = ['Samsung', 'Apple', 'Allianz'][Math.floor(Math.random() * 3)];
      const mockPrice = Math.random() * 2000 + 200;

      categoryCount.set(mockCategory, (categoryCount.get(mockCategory) || 0) + 1);
      brandCount.set(mockBrand, (brandCount.get(mockBrand) || 0) + 1);
      prices.push(mockPrice);
    });

    return {
      top_categories: Array.from(categoryCount.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([cat]) => cat),
      preferred_price_range: {
        min: Math.min(...prices) || 0,
        max: Math.max(...prices) || 1000
      },
      favorite_brands: Array.from(brandCount.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([brand]) => brand),
      activity_score: Math.min(interactions.length / 20, 1)
    };
  }
}
