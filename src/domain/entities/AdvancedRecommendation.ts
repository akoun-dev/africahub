
import { Recommendation, ReasoningDetails, ContextFactors } from './Recommendation';

export interface AdvancedRecommendation {
  id: string;
  user_id: string;
  product_id: string;
  recommendation_type: 'behavioral' | 'collaborative' | 'content' | 'hybrid' | 'ai_generated';
  recommendation_score: number;
  reasoning?: string;
  context_factors?: {
    location_match?: boolean;
    behavior_similarity?: number;
    content_relevance?: number;
  };
  insurance_type: string;
  is_viewed: boolean;
  is_clicked: boolean;
  is_purchased: boolean;
  products?: {
    name: string;
    brand: string;
    price: number;
    currency: string;
    description: string;
  };
}

// Helper function to convert AdvancedRecommendation to Recommendation
export const toRecommendation = (advanced: AdvancedRecommendation): Recommendation => {
  const reasoning: ReasoningDetails = {
    mainFactors: advanced.reasoning ? [advanced.reasoning] : [],
    scoreBreakdown: { overall: advanced.recommendation_score || 0 }
  };

  const contextFactors: ContextFactors = {
    locationMatch: advanced.context_factors?.location_match || false,
    behaviorSimilarity: advanced.context_factors?.behavior_similarity || 0,
    contentRelevance: advanced.context_factors?.content_relevance || 0
  };

  return {
    id: advanced.id,
    userId: advanced.user_id || '',
    productId: advanced.product_id || '',
    recommendationType: advanced.recommendation_type === 'ai_generated' ? 'hybrid' : advanced.recommendation_type as 'behavioral' | 'collaborative' | 'content' | 'hybrid',
    confidenceScore: advanced.recommendation_score || 0,
    reasoning,
    contextFactors,
    insuranceType: advanced.insurance_type,
    isViewed: advanced.is_viewed || false,
    isClicked: advanced.is_clicked || false,
    isPurchased: advanced.is_purchased || false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  };
};
