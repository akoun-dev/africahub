
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { SearchManager } from '@/services/managers/SearchManager';
import { SearchCriteria, SearchState, AnalyticsData } from '@/types/search';
import { toast } from 'sonner';

export const useSearch = () => {
  const { user } = useAuth();
  const { country } = useCountry();
  
  const [state, setState] = useState<SearchState>({
    loading: false,
    results: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    searchTime: 0,
    error: null
  });

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const performSearch = useCallback(async (
    criteria: SearchCriteria,
    page: number = 1
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await SearchManager.performSearch(criteria, page, {
        useCache: true,
        trackAnalytics: true,
        userId: user?.id,
        country: country.code
      });

      setState({
        loading: false,
        results: result.response.results,
        totalCount: result.response.totalCount,
        totalPages: result.response.totalPages,
        currentPage: result.response.currentPage,
        searchTime: result.response.searchTime,
        error: null
      });

      setAnalytics(result.analytics);

      // Toast pour les performances
      if (result.cacheHit) {
        toast.success(`Résultats instantanés (${result.response.searchTime}ms) 🚀`, { duration: 2000 });
      } else if (result.response.searchTime < 200) {
        toast.success(`Recherche ultra-rapide (${result.response.searchTime}ms) ⚡`, { duration: 2000 });
      }

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la recherche',
        results: [],
        totalCount: 0
      }));
      toast.error('Erreur lors de la recherche');
    }
  }, [user?.id, country.code]);

  const trackClick = useCallback(async (
    productId: string,
    query: string,
    position: number
  ) => {
    try {
      await SearchManager.trackResultClick(productId, query, position, user?.id);
    } catch (error) {
      console.error('Click tracking error:', error);
    }
  }, [user?.id]);

  return {
    ...state,
    analytics,
    performSearch,
    trackClick,
    clearCache: SearchManager.clearCache,
    getCacheStats: SearchManager.getCacheStats
  };
};
