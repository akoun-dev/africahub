
import { IRecommendationRepository } from '../../domain/repositories/IRecommendationRepository';
import { Recommendation, ReasoningDetails, ContextFactors } from '../../domain/entities/Recommendation';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseRecommendationRepository implements IRecommendationRepository {
  async findByUserId(userId: string, insuranceType?: string): Promise<Recommendation[]> {
    let query = supabase
      .from('ai_recommendations_v2')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('confidence_score', { ascending: false });

    if (insuranceType) {
      query = query.eq('insurance_type', insuranceType);
    }

    const { data, error } = await query.limit(10);
    if (error) throw error;

    return (data || []).map(this.mapToEntity);
  }

  async findById(id: string): Promise<Recommendation | null> {
    const { data, error } = await supabase
      .from('ai_recommendations_v2')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? this.mapToEntity(data) : null;
  }

  async create(recommendation: Omit<Recommendation, 'id' | 'createdAt'>): Promise<Recommendation> {
    const insertData = {
      user_id: recommendation.userId,
      product_id: recommendation.productId,
      recommendation_type: recommendation.recommendationType,
      confidence_score: recommendation.confidenceScore,
      reasoning: recommendation.reasoning as any, // Convert to JSON
      context_factors: recommendation.contextFactors as any, // Convert to JSON
      insurance_type: recommendation.insuranceType,
      is_viewed: recommendation.isViewed,
      is_clicked: recommendation.isClicked,
      is_purchased: recommendation.isPurchased,
      expires_at: recommendation.expiresAt.toISOString()
    };

    const { data, error } = await supabase
      .from('ai_recommendations_v2')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return this.mapToEntity(data);
  }

  async update(id: string, updates: Partial<Recommendation>): Promise<Recommendation> {
    const updateData: any = {};
    if (updates.confidenceScore !== undefined) updateData.confidence_score = updates.confidenceScore;
    if (updates.isViewed !== undefined) updateData.is_viewed = updates.isViewed;
    if (updates.isClicked !== undefined) updateData.is_clicked = updates.isClicked;
    if (updates.isPurchased !== undefined) updateData.is_purchased = updates.isPurchased;

    const { data, error } = await supabase
      .from('ai_recommendations_v2')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_recommendations_v2')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateInteraction(id: string, interaction: 'viewed' | 'clicked' | 'purchased'): Promise<void> {
    const updateData: any = {};
    if (interaction === 'viewed') updateData.is_viewed = true;
    if (interaction === 'clicked') updateData.is_clicked = true;
    if (interaction === 'purchased') updateData.is_purchased = true;

    const { error } = await supabase
      .from('ai_recommendations_v2')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  private mapToEntity(data: any): Recommendation {
    const reasoning: ReasoningDetails = typeof data.reasoning === 'object' && data.reasoning 
      ? data.reasoning 
      : { mainFactors: [], scoreBreakdown: { overall: data.confidence_score || 0 } };

    const contextFactors: ContextFactors = data.context_factors || { 
      locationMatch: false, 
      behaviorSimilarity: 0, 
      contentRelevance: 0 
    };

    return {
      id: data.id,
      userId: data.user_id,
      productId: data.product_id,
      recommendationType: data.recommendation_type,
      confidenceScore: data.confidence_score,
      reasoning,
      contextFactors,
      insuranceType: data.insurance_type,
      isViewed: data.is_viewed,
      isClicked: data.is_clicked,
      isPurchased: data.is_purchased,
      expiresAt: new Date(data.expires_at),
      createdAt: new Date(data.created_at)
    };
  }
}
