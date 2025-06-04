
import { Recommendation } from '../entities/Recommendation';

export interface IRecommendationRepository {
  findByUserId(userId: string, insuranceType?: string): Promise<Recommendation[]>;
  findById(id: string): Promise<Recommendation | null>;
  create(recommendation: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation>;
  update(id: string, updates: Partial<Recommendation>): Promise<Recommendation>;
  delete(id: string): Promise<void>;
  updateInteraction(id: string, interaction: 'viewed' | 'clicked' | 'purchased'): Promise<void>;
}
