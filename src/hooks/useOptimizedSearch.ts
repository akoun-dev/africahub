
import { useSearch } from './search/useSearch';
import { useSearchAnalytics } from './search/useSearchAnalytics';
import { useSearchGeo } from './search/useSearchGeo';

// Hook de compatibilité pour l'ancien système
export const useOptimizedSearch = () => {
  const search = useSearch();
  const analytics = useSearchAnalytics();
  const geo = useSearchGeo();

  return {
    // États de recherche
    loading: search.loading,
    results: search.results,
    totalCount: search.totalCount,
    totalPages: search.totalPages,
    currentPage: search.currentPage,
    searchTime: search.searchTime,
    cacheHit: false,
    error: search.error,
    userLocation: geo.location,
    analytics: search.analytics,

    // Actions principales
    performOptimizedSearch: search.performSearch,
    trackResultClick: search.trackClick,
    
    // Analytics
    searchWithSuggestions: async (query: string) => {
      const intent = analytics.analyzeIntent(query);
      // Logique simplifiée pour les suggestions
      return [];
    },
    
    // Utilitaires
    clearCache: search.clearCache,
    getCacheStats: search.getCacheStats,
    getPerformanceMetrics: () => ({
      cache: search.getCacheStats(),
      search: search.analytics,
      location: geo.location
    }),

    // Fonctions compatibilité (simplifiées)
    searchByRegion: async () => {},
    preloadPopularQueries: async () => {}
  };
};
