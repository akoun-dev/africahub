
import { executeQuery } from '../config/database';
import { logger } from '../utils/logger';

export interface AIRecommendation {
  id: string;
  user_id: string;
  product_id: string;
  recommendation_score: number;
  reasoning: string;
  insurance_type: string;
  context_factors: {
    location_match: boolean;
    behavior_similarity: number;
    content_relevance: number;
  };
  is_viewed: boolean;
  is_clicked: boolean;
  is_purchased: boolean;
  created_at: Date;
  expires_at: Date;
}

export interface RecommendationRequest {
  user_id: string;
  insurance_type: string;
  preferences: {
    budget_range?: string;
    risk_tolerance?: string;
    coverage_priorities?: string[];
  };
  behavioral_data?: {
    recent_searches: string[];
    interaction_patterns: Record<string, any>;
  };
}

export class RecommendationModel {
  static async getUserRecommendations(
    userId: string, 
    insuranceType?: string,
    limit: number = 10
  ): Promise<AIRecommendation[]> {
    try {
      let query = `
        SELECT r.*, p.name as product_name, p.brand, p.price, p.currency, p.description
        FROM ai_recommendations_v2 r
        LEFT JOIN products p ON r.product_id = p.id
        WHERE r.user_id = $1 AND r.expires_at > NOW()
      `;
      const params: any[] = [userId];

      if (insuranceType) {
        query += ' AND r.insurance_type = $2';
        params.push(insuranceType);
      }

      query += ' ORDER BY r.confidence_score DESC LIMIT $' + (params.length + 1);
      params.push(limit);

      const result = await executeQuery(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching user recommendations:', error);
      throw error;
    }
  }

  static async createRecommendations(recommendations: Partial<AIRecommendation>[]): Promise<void> {
    try {
      const query = `
        INSERT INTO ai_recommendations_v2 
        (user_id, product_id, recommendation_type, confidence_score, reasoning, context_factors, insurance_type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      for (const rec of recommendations) {
        await executeQuery(query, [
          rec.user_id,
          rec.product_id,
          'ai_generated',
          rec.recommendation_score,
          { mainFactors: [rec.reasoning || ''], scoreBreakdown: { overall: rec.recommendation_score } },
          rec.context_factors,
          rec.insurance_type
        ]);
      }
    } catch (error) {
      logger.error('Error creating recommendations:', error);
      throw error;
    }
  }

  static async updateInteraction(
    recommendationId: string, 
    interactionType: 'viewed' | 'clicked' | 'purchased'
  ): Promise<void> {
    try {
      const updateData: Record<string, boolean> = {};
      updateData[`is_${interactionType}`] = true;

      const setClause = Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const query = `UPDATE ai_recommendations_v2 SET ${setClause} WHERE id = $1`;
      
      await executeQuery(query, [recommendationId, ...Object.values(updateData)]);
    } catch (error) {
      logger.error('Error updating recommendation interaction:', error);
      throw error;
    }
  }

  static async getRecommendationMetrics(userId: string): Promise<any> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_recommendations,
          SUM(CASE WHEN is_viewed THEN 1 ELSE 0 END) as viewed_count,
          SUM(CASE WHEN is_clicked THEN 1 ELSE 0 END) as clicked_count,
          SUM(CASE WHEN is_purchased THEN 1 ELSE 0 END) as purchased_count,
          AVG(confidence_score) as avg_confidence_score
        FROM ai_recommendations_v2 
        WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      `;
      
      const result = await executeQuery(query, [userId]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error fetching recommendation metrics:', error);
      throw error;
    }
  }
}
