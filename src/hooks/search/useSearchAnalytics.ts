
import { useState, useEffect } from 'react';
import { SearchAnalytics } from '@/services/search/SearchAnalytics';

export const useSearchAnalytics = () => {
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    const loadRecentSearches = () => {
      const searches = SearchAnalytics.getRecentSearches(10);
      setRecentSearches(searches);
    };

    loadRecentSearches();
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadRecentSearches, 30000);
    return () => clearInterval(interval);
  }, []);

  const analyzeIntent = (query: string) => {
    return SearchAnalytics.analyzeSearchIntent(query);
  };

  return {
    recentSearches,
    analyzeIntent
  };
};
