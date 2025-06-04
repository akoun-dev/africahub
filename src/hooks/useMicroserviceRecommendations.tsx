import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { recommendationMicroservice } from '@/services/microservices/RecommendationMicroservice';
import { AIRecommendation } from '@/types/recommendations';

export const useMicroserviceRecommendations = (insuranceType?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['microservice-recommendations', user?.id, insuranceType],
    queryFn: async () => {
      if (!user) return [];
      
      return await recommendationMicroservice.getUserRecommendations(
        user.id,
        insuranceType
      );
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};

export const useGenerateMicroserviceRecommendations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      insuranceType, 
      preferences,
      behavioralData 
    }: { 
      insuranceType: string;
      preferences: any;
      behavioralData?: any;
    }) => {
      if (!user) throw new Error('No user logged in');
      
      return await recommendationMicroservice.generateRecommendations({
        user_id: user.id,
        insurance_type: insuranceType,
        preferences,
        behavioral_data: behavioralData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['microservice-recommendations', user?.id] 
      });
    },
  });
};

export const useUpdateMicroserviceInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      recommendationId, 
      interactionType 
    }: { 
      recommendationId: string; 
      interactionType: 'viewed' | 'clicked' | 'purchased';
    }) => {
      return await recommendationMicroservice.updateInteraction(
        recommendationId, 
        interactionType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['microservice-recommendations'] 
      });
    },
  });
};

export const useMicroserviceRecommendationMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['microservice-recommendation-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      return await recommendationMicroservice.getRecommendationMetrics(user.id);
    },
    enabled: !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
