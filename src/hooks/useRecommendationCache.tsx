
import { useState, useCallback, useRef } from 'react';
import { Recommendation } from '@/domain/entities/Recommendation';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
}

export const useRecommendationCache = () => {
  const cache = useRef(new Map<string, CacheEntry<any>>());
  const config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  };

  const generateCacheKey = useCallback((userId: string, insuranceType?: string, params?: any) => {
    const baseKey = `${userId}-${insuranceType || 'all'}`;
    if (params) {
      const sortedParams = Object.keys(params).sort().map(key => `${key}:${params[key]}`).join('|');
      return `${baseKey}-${sortedParams}`;
    }
    return baseKey;
  }, []);

  const get = useCallback(<T,>(key: string): T | null => {
    const entry = cache.current.get(key);
    if (!entry) return null;

    if (Date.now() > entry.timestamp + entry.ttl) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback(<T,>(key: string, data: T, ttl?: number) => {
    // Evict oldest entries if cache is full
    if (cache.current.size >= config.maxSize) {
      const oldestKey = cache.current.keys().next().value;
      cache.current.delete(oldestKey);
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || config.defaultTTL
    });
  }, [config.defaultTTL, config.maxSize]);

  const invalidate = useCallback((pattern?: string) => {
    if (!pattern) {
      cache.current.clear();
      return;
    }

    const keysToDelete = Array.from(cache.current.keys()).filter(key => 
      key.includes(pattern)
    );
    
    keysToDelete.forEach(key => cache.current.delete(key));
  }, []);

  const getRecommendations = useCallback((userId: string, insuranceType?: string): Recommendation[] | null => {
    const key = generateCacheKey(userId, insuranceType);
    return get<Recommendation[]>(key);
  }, [generateCacheKey, get]);

  const setRecommendations = useCallback((
    userId: string, 
    recommendations: Recommendation[], 
    insuranceType?: string,
    ttl?: number
  ) => {
    const key = generateCacheKey(userId, insuranceType);
    set(key, recommendations, ttl);
  }, [generateCacheKey, set]);

  const getCacheStats = useCallback(() => {
    let validEntries = 0;
    let expiredEntries = 0;
    const now = Date.now();

    cache.current.forEach(entry => {
      if (now > entry.timestamp + entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      totalEntries: cache.current.size,
      validEntries,
      expiredEntries,
      hitRate: validEntries / (validEntries + expiredEntries) || 0
    };
  }, []);

  return {
    get,
    set,
    invalidate,
    getRecommendations,
    setRecommendations,
    getCacheStats,
    generateCacheKey
  };
};
