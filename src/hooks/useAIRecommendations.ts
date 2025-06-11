
import { useState, useEffect, useCallback } from 'react';
import { RecommendationEngine, RecommendationContext } from '@/services/RecommendationEngine';
import { SearchResult } from '@/types/search';
import { AIRecommendation, PersonalizedInsights } from '@/types/recommendations';
import { useAuth } from '@/contexts/AuthContext';

export const useAIRecommendations = (
  products: SearchResult[],
  context?: RecommendationContext
) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<PersonalizedInsights | null>(null);

  const generateRecommendations = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    try {
      const userProfile = {
        id: user.id,
        preferences: {
          budget_range: 'medium' as const,
          risk_tolerance: 'moderate' as const,
          preferred_brands: ['Samsung', 'Allianz', 'Orange'],
          preferred_categories: ['smartphones', 'assurance-auto']
        },
        behavior: {
          recent_searches: ['smartphone Samsung', 'assurance auto'],
          viewed_products: ['smartphones'],
          compared_products: [],
          location: 'Dakar'
        }
      };

      const recs = await RecommendationEngine.generateRecommendations(
        userProfile,
        context || {},
        products,
        6
      );

      setRecommendations(recs);

      const personalInsights = RecommendationEngine.getPersonalizedInsights(user.id);
      setInsights(personalInsights);

    } catch (error) {
      console.error('Erreur génération recommandations:', error);
    } finally {
      setLoading(false);
    }
  }, [user, products, context]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const trackRecommendationClick = useCallback((productId: string) => {
    if (user) {
      RecommendationEngine.trackInteraction(user.id, productId, 'click');
    }
  }, [user]);

  return {
    data: recommendations,
    isLoading: loading,
    recommendations,
    loading,
    insights,
    trackRecommendationClick,
    refreshRecommendations: generateRecommendations,
    refetch: generateRecommendations
  };
};

export const useGenerateRecommendations = () => {
  const { user } = useEnhancedAuth();

  return {
    mutateAsync: async ({ insuranceType, preferences }: any) => {
      console.log('Generating recommendations for:', { insuranceType, preferences, userId: user?.id });
      return Promise.resolve({ success: true });
    },
    isPending: false,
    mutate: async ({ insuranceType, preferences }: any) => {
      console.log('Mutate recommendations for:', { insuranceType, preferences, userId: user?.id });
    },
    error: null
  };
};
