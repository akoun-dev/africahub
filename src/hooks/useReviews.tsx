
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService } from '@/services/ReviewService';
import { Review, CreateReviewData, ReviewStats } from '@/types/core/Review';
import { toast } from 'sonner';

export const useProductReviews = (
  productId: string,
  options: {
    limit?: number;
    sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'most_helpful';
    filterRating?: number;
  } = {}
) => {
  const [page, setPage] = useState(1);
  const limit = options.limit || 10;

  return useQuery({
    queryKey: ['product-reviews', productId, page, options],
    queryFn: () => ReviewService.getProductReviews(productId, {
      ...options,
      limit,
      offset: (page - 1) * limit
    }),
    enabled: !!productId
  });
};

export const useProductReviewStats = (productId: string) => {
  return useQuery({
    queryKey: ['product-review-stats', productId],
    queryFn: () => ReviewService.getProductReviewStats(productId),
    enabled: !!productId
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: CreateReviewData) => ReviewService.createReview(reviewData),
    onSuccess: (data) => {
      toast.success('Avis publié avec succès !');
      // Invalider les caches pertinents
      queryClient.invalidateQueries({ queryKey: ['product-reviews', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['product-review-stats', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      toast.error('Erreur lors de la publication de l\'avis');
    }
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, updates }: { reviewId: string; updates: Partial<CreateReviewData> }) =>
      ReviewService.updateReview(reviewId, updates),
    onSuccess: (data) => {
      toast.success('Avis mis à jour avec succès !');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['product-review-stats', data.product_id] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
    },
    onError: (error) => {
      console.error('Error updating review:', error);
      toast.error('Erreur lors de la mise à jour de l\'avis');
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ReviewService.deleteReview,
    onSuccess: () => {
      toast.success('Avis supprimé avec succès !');
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['product-review-stats'] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      toast.error('Erreur lors de la suppression de l\'avis');
    }
  });
};

export const useVoteOnReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, voteType }: { reviewId: string; voteType: 'helpful' | 'unhelpful' }) =>
      ReviewService.voteOnReview(reviewId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
    },
    onError: (error) => {
      console.error('Error voting on review:', error);
      toast.error('Erreur lors du vote');
    }
  });
};

export const useReportReview = () => {
  return useMutation({
    mutationFn: ({ reviewId, reason, description }: { 
      reviewId: string; 
      reason: string; 
      description?: string;
    }) => ReviewService.reportReview(reviewId, reason as any, description),
    onSuccess: () => {
      toast.success('Avis signalé avec succès');
    },
    onError: (error) => {
      console.error('Error reporting review:', error);
      toast.error('Erreur lors du signalement');
    }
  });
};

export const useUserReviews = () => {
  return useQuery({
    queryKey: ['user-reviews'],
    queryFn: () => ReviewService.getUserReviews()
  });
};

export const useHasUserReviewedProduct = (productId: string) => {
  return useQuery({
    queryKey: ['has-user-reviewed', productId],
    queryFn: () => ReviewService.hasUserReviewedProduct(productId),
    enabled: !!productId
  });
};
