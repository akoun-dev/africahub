
import { Recommendation } from '../entities/Recommendation';

export interface GenerateRecommendationsRequest {
  userId: string;
  insuranceType: string;
  preferences: any;
  behavioralData?: any;
}

export interface IRecommendationService {
  getRecommendations(userId: string, insuranceType?: string): Promise<Recommendation[]>;
  generateRecommendations(request: GenerateRecommendationsRequest): Promise<void>;
  updateInteraction(recommendationId: string, interactionType: 'viewed' | 'clicked' | 'purchased'): Promise<void>;
}
