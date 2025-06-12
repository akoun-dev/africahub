
import { useState, useEffect } from 'react';
import { useLLMCache, generateCacheKey } from './useLLMCache';

interface CacheStrategy {
  mode: 'aggressive' | 'balanced' | 'conservative';
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache entries
}

interface CacheStats {
  hitRate: number;
  totalEntries: number;
  totalSavings: number;
  lastOptimized: Date;
}

export const useAdvancedLLMCache = () => {
  const { getCachedResponse, setCachedResponse, getCacheStats } = useLLMCache();
  const [strategy, setStrategy] = useState<CacheStrategy>({
    mode: 'balanced',
    ttl: 3600000, // 1 hour
    maxSize: 1000
  });
  const [stats, setStats] = useState<CacheStats>({
    hitRate: 0,
    totalEntries: 0,
    totalSavings: 0,
    lastOptimized: new Date()
  });

  // Intelligent cache strategy based on usage patterns
  const optimizeCacheStrategy = () => {
    const currentStats = getCacheStats();
    
    if (currentStats.totalHits > 100) {
      if (currentStats.totalHits / currentStats.totalEntries > 0.8) {
        // High hit rate - use aggressive caching
        setStrategy({
          mode: 'aggressive',
          ttl: 7200000, // 2 hours
          maxSize: 2000
        });
      } else if (currentStats.totalHits / currentStats.totalEntries < 0.3) {
        // Low hit rate - use conservative caching
        setStrategy({
          mode: 'conservative',
          ttl: 1800000, // 30 minutes
          maxSize: 500
        });
      }
    }

    setStats({
      hitRate: currentStats.totalHits / Math.max(currentStats.totalEntries, 1),
      totalEntries: currentStats.totalEntries,
      totalSavings: currentStats.totalSavings,
      lastOptimized: new Date()
    });
  };

  // Smart cache key generation with context awareness
  const generateSmartCacheKey = (
    message: string, 
    strategy: string, 
    context?: any
  ): string => {
    // Normalize message for better cache hits
    const normalizedMessage = message
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[^\w\s]/g, ''); // Remove special chars for better matching

    // Create semantic fingerprint
    const semanticElements = [
      normalizedMessage,
      strategy,
      context?.country_code || 'global',
      context?.insurance_type || 'general'
    ];

    return generateCacheKey(semanticElements.join(':'), strategy, context);
  };

  // Preemptive cache warming for common queries
  const warmCache = async (commonQueries: string[]) => {
    console.log('Warming cache with common queries...');
    
    const warmingPromises = commonQueries.map(async (query) => {
      const cacheKey = generateSmartCacheKey(query, 'balanced');
      const cached = await getCachedResponse(cacheKey);
      
      if (!cached) {
        // This would normally trigger a real LLM request
        // For warming, we simulate common responses
        await setCachedResponse(
          cacheKey,
          `Réponse mise en cache pour: ${query}`,
          'cache_warmer',
          0.001
        );
      }
    });

    await Promise.all(warmingPromises);
  };

  // Automatic cache optimization every 5 minutes
  useEffect(() => {
    const interval = setInterval(optimizeCacheStrategy, 300000);
    return () => clearInterval(interval);
  }, []);

  return {
    strategy,
    stats,
    generateSmartCacheKey,
    optimizeCacheStrategy,
    warmCache,
    setStrategy
  };
};
