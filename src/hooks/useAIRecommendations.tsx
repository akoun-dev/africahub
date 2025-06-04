
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIRecommendation {
  id: string;
  user_id: string;
  product_id: string;
  recommendation_score: number;
  reasoning?: string;
  insurance_type: string;
  created_at: string;
  products?: {
    name: string;
    brand: string;
    price: number;
    currency: string;
    description: string;
  };
}

export const useAIRecommendations = (insuranceType?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['ai-recommendations', user?.id, insuranceType],
    queryFn: async () => {
      if (!user) return [];
      
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
        .eq('user_id', user.id)
        .order('recommendation_score', { ascending: false });

      if (insuranceType) {
        query = query.eq('insurance_type', insuranceType);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AIRecommendation[];
    },
    enabled: !!user,
  });
};

export const useGenerateRecommendations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      insuranceType, 
      preferences 
    }: { 
      insuranceType: string;
      preferences: any;
    }) => {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase.functions.invoke('generate-ai-recommendations', {
        body: {
          user_id: user.id,
          insurance_type: insuranceType,
          preferences,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations', user?.id] });
    },
  });
};
