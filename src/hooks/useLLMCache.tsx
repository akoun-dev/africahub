
import { useCallback } from 'react';

export interface CacheEntry {
  response_content: string;
  provider_used: string;
  cost_saved: number;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalSavings: number;
  totalHits: number; // Propriété manquante ajoutée
}

export const generateCacheKey = (message: string, strategy: string, context: any): string => {
  return btoa(`${message}-${strategy}-${JSON.stringify(context)}`);
};

export const useLLMCache = () => {
  const getCachedResponse = useCallback(async (cacheKey: string): Promise<CacheEntry | null> => {
    // Mock implementation
    return null;
  }, []);

  const setCachedResponse = useCallback(async (
    cacheKey: string,
    content: string,
    provider: string,
    cost: number
  ): Promise<void> => {
    // Mock implementation
    console.log('Caching response:', { cacheKey, provider, cost });
  }, []);

  const getCacheStats = useCallback((): CacheStats => {
    return {
      totalEntries: 128,
      hitRate: 0.75,
      totalSavings: 24.50,
      totalHits: 96 // Valeur calculée basée sur hitRate
    };
  }, []);

  return {
    getCachedResponse,
    setCachedResponse,
    getCacheStats
  };
};
