
import { AIRecommendation } from '@/types/recommendations';
import { Recommendation, ReasoningDetails, ContextFactors } from '@/domain/entities/Recommendation';

export const aiToRecommendation = (aiRec: AIRecommendation): Recommendation => {
  const reasoning: ReasoningDetails = {
    mainFactors: aiRec.reasoning ? [aiRec.reasoning] : [],
    scoreBreakdown: { overall: aiRec.recommendation_score }
  };

  const contextFactors: ContextFactors = {
    locationMatch: false,
    behaviorSimilarity: 0,
    contentRelevance: 0
  };

  return {
    id: aiRec.id,
    userId: aiRec.user_id,
    productId: aiRec.product_id,
    recommendationType: 'hybrid',
    confidenceScore: aiRec.recommendation_score,
    reasoning,
    contextFactors,
    insuranceType: aiRec.insurance_type,
    isViewed: false,
    isClicked: false,
    isPurchased: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(aiRec.created_at),
    product: aiRec.products ? {
      id: aiRec.product_id,
      name: aiRec.products.name,
      brand: aiRec.products.brand,
      price: aiRec.products.price,
      currency: aiRec.products.currency,
      description: aiRec.products.description
    } : undefined
  };
};
