import { AIRecommendation } from '@/types/recommendations';

interface MicroserviceConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
}

export class RecommendationMicroservice {
  private config: MicroserviceConfig;

  constructor(config: MicroserviceConfig) {
    this.config = config;
  }

  async getUserRecommendations(
    userId: string, 
    insuranceType?: string, 
    limit: number = 10
  ): Promise<AIRecommendation[]> {
    try {
      const params = new URLSearchParams();
      if (insuranceType) params.append('insurance_type', insuranceType);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(
        `${this.config.baseUrl}/api/v1/recommendations/${userId}?${params}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching recommendations from microservice:', error);
      // Fallback to existing implementation
      return this.fallbackToLocal(userId, insuranceType, limit);
    }
  }

  async generateRecommendations(request: {
    user_id: string;
    insurance_type: string;
    preferences: any;
    behavioral_data?: any;
  }): Promise<AIRecommendation[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/recommendations/generate`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(request),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error generating recommendations from microservice:', error);
      throw error;
    }
  }

  async updateInteraction(recommendationId: string, interactionType: 'viewed' | 'clicked' | 'purchased'): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/recommendations/interaction`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            recommendation_id: recommendationId,
            interaction_type: interactionType
          }),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating interaction in microservice:', error);
      // Don't throw - interaction tracking is not critical
    }
  }

  async getRecommendationMetrics(userId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/recommendations/${userId}/metrics`,
        {
          method: 'GET',
          headers: this.getHeaders(),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching metrics from microservice:', error);
      return null;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  private async fallbackToLocal(
    userId: string, 
    insuranceType?: string, 
    limit: number = 10
  ): Promise<AIRecommendation[]> {
    // Import the existing Supabase implementation as fallback
    const { supabase } = await import('@/integrations/supabase/client');
    
    let query = supabase
      .from('ai_recommendations')
      .select(`
        *,
        products (
          name,
          brand,
          price,
          currency,
          description
        )
      `)
      .eq('user_id', userId)
      .order('recommendation_score', { ascending: false })
      .limit(limit);

    if (insuranceType) {
      query = query.eq('insurance_type', insuranceType);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Fallback query error:', error);
      return [];
    }

    return data as AIRecommendation[] || [];
  }
}

// Singleton instance
export const recommendationMicroservice = new RecommendationMicroservice({
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com' 
    : 'http://localhost:8000', // Kong API Gateway
  timeout: 5000
});
