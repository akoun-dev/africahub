
import { supabase } from '@/integrations/supabase/client';
import { Review, ReviewVote, ReviewReport, CreateReviewData, ReviewStats } from '@/types/core/Review';

export class ReviewService {
  // Récupérer les avis d'un produit
  static async getProductReviews(
    productId: string,
    options: {
      limit?: number;
      offset?: number;
      sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'most_helpful';
      filterRating?: number;
    } = {}
  ) {
    const { limit = 10, offset = 0, sortBy = 'newest', filterRating } = options;
    
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'active');

    if (filterRating) {
      query = query.eq('rating', filterRating);
    }

    // Tri
    switch (sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'rating_high':
        query = query.order('rating', { ascending: false });
        break;
      case 'rating_low':
        query = query.order('rating', { ascending: true });
        break;
      case 'most_helpful':
        query = query.order('helpful_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;

    return data as Review[];
  }

  // Récupérer les statistiques des avis d'un produit
  static async getProductReviewStats(productId: string): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('status', 'active');

    if (error) throw error;

    const reviews = data || [];
    const total_reviews = reviews.length;
    
    if (total_reviews === 0) {
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const average_rating = reviews.reduce((sum, review) => sum + review.rating, 0) / total_reviews;
    
    const rating_distribution = reviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++;
      return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      total_reviews,
      average_rating: Math.round(average_rating * 10) / 10,
      rating_distribution
    };
  }

  // Créer un nouvel avis
  static async createReview(reviewData: CreateReviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...reviewData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  }

  // Mettre à jour un avis
  static async updateReview(reviewId: string, updates: Partial<CreateReviewData>) {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  }

  // Supprimer un avis
  static async deleteReview(reviewId: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  }

  // Voter sur un avis
  static async voteOnReview(reviewId: string, voteType: 'helpful' | 'unhelpful') {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote } = await supabase
      .from('review_votes')
      .select('*')
      .eq('user_id', userId)
      .eq('review_id', reviewId)
      .single();

    if (existingVote) {
      // Mettre à jour le vote existant
      const { data, error } = await supabase
        .from('review_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id)
        .select()
        .single();

      if (error) throw error;
      return data as ReviewVote;
    } else {
      // Créer un nouveau vote
      const { data, error } = await supabase
        .from('review_votes')
        .insert({
          user_id: userId,
          review_id: reviewId,
          vote_type: voteType
        })
        .select()
        .single();

      if (error) throw error;
      return data as ReviewVote;
    }
  }

  // Supprimer un vote
  static async removeVote(reviewId: string) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('review_votes')
      .delete()
      .eq('user_id', userId)
      .eq('review_id', reviewId);

    if (error) throw error;
  }

  // Signaler un avis
  static async reportReview(
    reviewId: string, 
    reason: ReviewReport['reason'], 
    description?: string
  ) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('review_reports')
      .insert({
        user_id: userId,
        review_id: reviewId,
        reason,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data as ReviewReport;
  }

  // Récupérer les avis d'un utilisateur
  static async getUserReviews(userId?: string) {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        products (
          name,
          image_url,
          companies (
            name
          )
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Vérifier si un utilisateur a déjà laissé un avis pour un produit
  static async hasUserReviewedProduct(productId: string) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    return !error && !!data;
  }
}
