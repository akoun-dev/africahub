
import { IRecommendationService, GenerateRecommendationsRequest } from '../../domain/services/IRecommendationService';
import { IRecommendationRepository } from '../../domain/repositories/IRecommendationRepository';
import { Recommendation } from '../../domain/entities/Recommendation';
import { supabase } from '@/integrations/supabase/client';

export class RecommendationService implements IRecommendationService {
  constructor(private repository: IRecommendationRepository) {}

  async getRecommendations(userId: string, insuranceType?: string): Promise<Recommendation[]> {
    return this.repository.findByUserId(userId, insuranceType);
  }

  async generateRecommendations(request: GenerateRecommendationsRequest): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-advanced-recommendations', {
        body: {
          user_id: request.userId,
          insurance_type: request.insuranceType,
          preferences: request.preferences,
          behavioral_data: request.behavioralData,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  async updateInteraction(recommendationId: string, interactionType: 'viewed' | 'clicked' | 'purchased'): Promise<void> {
    await this.repository.updateInteraction(recommendationId, interactionType);
  }
}
