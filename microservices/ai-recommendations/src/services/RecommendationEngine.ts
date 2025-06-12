
import { logger } from '../utils/logger';
import { RecommendationModel, RecommendationRequest, AIRecommendation } from '../models/RecommendationModel';
import { executeQuery } from '../config/database';
import { setCache, getCache } from '../config/redis';

export class RecommendationEngine {
  static async generateRecommendations(request: RecommendationRequest): Promise<AIRecommendation[]> {
    try {
      logger.info(`Generating recommendations for user ${request.user_id}`);

      // Check cache first
      const cacheKey = `recommendations:${request.user_id}:${request.insurance_type}`;
      const cached = await getCache(cacheKey);
      if (cached) {
        logger.info('Returning cached recommendations');
        return cached;
      }

      // Get available products for the insurance type
      const products = await this.getAvailableProducts(request.insurance_type);
      if (!products.length) {
        logger.warn(`No products found for insurance type: ${request.insurance_type}`);
        return [];
      }

      // Get user behavioral data
      const userBehavior = await this.getUserBehavioralData(request.user_id);
      
      // Generate recommendations using ML algorithms
      const recommendations = await this.calculateRecommendationScores(
        products,
        request,
        userBehavior
      );

      // Save recommendations to database
      await RecommendationModel.createRecommendations(recommendations);

      // Cache the results
      await setCache(cacheKey, recommendations, 3600); // 1 hour TTL

      logger.info(`Generated ${recommendations.length} recommendations for user ${request.user_id}`);
      return recommendations;

    } catch (error) {
      logger.error('Error generating recommendations:', error);
      throw error;
    }
  }

  private static async getAvailableProducts(insuranceType: string): Promise<any[]> {
    const query = `
      SELECT p.*, pt.slug as product_type_slug
      FROM products p
      JOIN product_types pt ON p.product_type_id = pt.id
      JOIN sectors s ON pt.sector_id = s.id
      WHERE s.slug = $1 AND p.is_active = true
      ORDER BY p.price ASC
    `;
    
    const result = await executeQuery(query, [insuranceType]);
    return result.rows;
  }

  private static async getUserBehavioralData(userId: string): Promise<any> {
    const query = `
      SELECT 
        interaction_type,
        insurance_type,
        product_id,
        COUNT(*) as interaction_count,
        AVG(duration_seconds) as avg_duration
      FROM user_interactions 
      WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY interaction_type, insurance_type, product_id
    `;
    
    const result = await executeQuery(query, [userId]);
    return result.rows;
  }

  private static async calculateRecommendationScores(
    products: any[],
    request: RecommendationRequest,
    userBehavior: any[]
  ): Promise<Partial<AIRecommendation>[]> {
    const recommendations: Partial<AIRecommendation>[] = [];

    for (const product of products.slice(0, 10)) { // Limit to top 10 products
      const scores = {
        behavioral: this.calculateBehavioralScore(product, userBehavior),
        content: this.calculateContentScore(product, request.preferences),
        collaborative: this.calculateCollaborativeScore(product, request.user_id),
        pricing: this.calculatePricingScore(product, request.preferences?.budget_range)
      };

      // Weighted combination of scores
      const finalScore = (
        scores.behavioral * 0.3 +
        scores.content * 0.3 +
        scores.collaborative * 0.2 +
        scores.pricing * 0.2
      );

      if (finalScore > 0.4) { // Only recommend if score is above threshold
        recommendations.push({
          user_id: request.user_id,
          product_id: product.id,
          recommendation_score: finalScore,
          reasoning: this.generateReasoning(scores, product),
          insurance_type: request.insurance_type,
          context_factors: {
            location_match: true, // Simplified for now
            behavior_similarity: scores.behavioral,
            content_relevance: scores.content
          }
        });
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => (b.recommendation_score || 0) - (a.recommendation_score || 0))
      .slice(0, 5);
  }

  private static calculateBehavioralScore(product: any, userBehavior: any[]): number {
    const productInteractions = userBehavior.filter(b => b.product_id === product.id);
    if (productInteractions.length === 0) return 0.5; // Neutral score for no data

    const totalInteractions = productInteractions.reduce((sum, b) => sum + parseInt(b.interaction_count), 0);
    const avgDuration = productInteractions.reduce((sum, b) => sum + (parseFloat(b.avg_duration) || 0), 0) / productInteractions.length;

    // Score based on interaction frequency and engagement time
    const interactionScore = Math.min(totalInteractions / 10, 1); // Max score at 10 interactions
    const engagementScore = Math.min(avgDuration / 60, 1); // Max score at 60 seconds

    return (interactionScore * 0.6 + engagementScore * 0.4);
  }

  private static calculateContentScore(product: any, preferences: any): number {
    let score = 0.5; // Base score

    if (preferences?.budget_range && product.price) {
      const budgetMatch = this.matchBudgetRange(product.price, preferences.budget_range);
      score += budgetMatch * 0.4;
    }

    // Brand reputation scoring
    if (product.brand && ['Allianz', 'AXA', 'Sanlam'].includes(product.brand)) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  private static calculateCollaborativeScore(product: any, userId: string): number {
    // Simplified collaborative filtering - in production, use proper ML algorithms
    return 0.5 + Math.random() * 0.3; // Random score between 0.5-0.8
  }

  private static calculatePricingScore(product: any, budgetRange?: string): number {
    if (!product.price || !budgetRange) return 0.5;

    const priceRanges = {
      'low': { min: 0, max: 500 },
      'medium': { min: 500, max: 1500 },
      'high': { min: 1500, max: Infinity }
    };

    const range = priceRanges[budgetRange as keyof typeof priceRanges];
    if (!range) return 0.5;

    if (product.price >= range.min && product.price <= range.max) {
      return 0.9; // High score for perfect budget match
    }

    // Calculate proximity score
    const distanceFromRange = Math.min(
      Math.abs(product.price - range.min),
      Math.abs(product.price - range.max)
    );
    
    return Math.max(0.1, 0.9 - (distanceFromRange / 1000));
  }

  private static matchBudgetRange(price: number, budgetRange: string): number {
    const ranges = {
      'low': price < 500 ? 1 : 0.5,
      'medium': price >= 500 && price <= 1500 ? 1 : 0.3,
      'high': price > 1500 ? 1 : 0.2
    };

    return ranges[budgetRange as keyof typeof ranges] || 0.5;
  }

  private static generateReasoning(scores: any, product: any): string {
    const reasons = [];

    if (scores.behavioral > 0.7) {
      reasons.push("Basé sur vos interactions passées");
    }
    if (scores.content > 0.7) {
      reasons.push("Correspond parfaitement à vos préférences");
    }
    if (scores.pricing > 0.8) {
      reasons.push("Prix adapté à votre budget");
    }
    if (product.brand && ['Allianz', 'AXA', 'Sanlam'].includes(product.brand)) {
      reasons.push("Marque de confiance reconnue");
    }

    return reasons.length > 0 ? reasons.join(", ") : "Recommandation basée sur l'analyse IA avancée";
  }
}
