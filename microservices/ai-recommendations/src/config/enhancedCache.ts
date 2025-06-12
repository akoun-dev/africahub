
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

export interface AIRecommendationsCacheConfig {
  userRecommendations: { ttl: number; priority: 'high' | 'medium' | 'low' };
  behavioralData: { ttl: number; priority: 'high' | 'medium' | 'low' };
  scoringModels: { ttl: number; priority: 'high' | 'medium' | 'low' };
  interactionPatterns: { ttl: number; priority: 'high' | 'medium' | 'low' };
}

export class EnhancedAIRecommendationsCache {
  private static instance: EnhancedAIRecommendationsCache;
  private distributedCache: DistributedCache;
  private localCache: Map<string, { value: any; expiry: number; hits: number }>;
  private maxLocalCacheSize = 1000;

  private cacheStrategies: AIRecommendationsCacheConfig = {
    userRecommendations: { ttl: 300, priority: 'high' },      // 5 min - données dynamiques
    behavioralData: { ttl: 600, priority: 'high' },           // 10 min - patterns utilisateur
    scoringModels: { ttl: 1800, priority: 'medium' },         // 30 min - modèles de scoring
    interactionPatterns: { ttl: 900, priority: 'medium' }     // 15 min - patterns d'interaction
  };

  private constructor() {
    this.localCache = new Map();
    this.distributedCache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 300,
      keyPrefix: 'ai-rec-enhanced',
      compression: true,
      serialization: 'json'
    });

    // Nettoyage automatique du cache local toutes les 5 minutes
    setInterval(() => this.cleanupLocalCache(), 300000);
  }

  static getInstance(): EnhancedAIRecommendationsCache {
    if (!EnhancedAIRecommendationsCache.instance) {
      EnhancedAIRecommendationsCache.instance = new EnhancedAIRecommendationsCache();
    }
    return EnhancedAIRecommendationsCache.instance;
  }

  async initialize(): Promise<void> {
    await this.distributedCache.connect();
    logger.info('Enhanced AI Recommendations cache initialized');
  }

  async get<T>(key: string, cacheType: keyof AIRecommendationsCacheConfig): Promise<T | null> {
    const fullKey = `${cacheType}:${key}`;
    
    // 1. Vérifier le cache local d'abord
    const localResult = this.getFromLocalCache<T>(fullKey);
    if (localResult !== null) {
      return localResult;
    }

    // 2. Vérifier Redis
    const distributedResult = await this.distributedCache.get<T>(fullKey);
    if (distributedResult !== null) {
      // Mettre à jour le cache local
      this.setToLocalCache(fullKey, distributedResult, this.cacheStrategies[cacheType].ttl);
      return distributedResult;
    }

    return null;
  }

  async set<T>(
    key: string, 
    value: T, 
    cacheType: keyof AIRecommendationsCacheConfig
  ): Promise<void> {
    const fullKey = `${cacheType}:${key}`;
    const strategy = this.cacheStrategies[cacheType];
    
    // Sauvegarder dans Redis
    await this.distributedCache.set(fullKey, value, strategy.ttl);
    
    // Sauvegarder dans le cache local si priorité élevée
    if (strategy.priority === 'high') {
      this.setToLocalCache(fullKey, value, strategy.ttl);
    }
  }

  async invalidate(pattern: string, cacheType?: keyof AIRecommendationsCacheConfig): Promise<void> {
    const fullPattern = cacheType ? `${cacheType}:${pattern}` : pattern;
    
    // Invalider dans Redis
    await this.distributedCache.deletePattern(fullPattern);
    
    // Invalider dans le cache local
    for (const [key] of this.localCache) {
      if (key.includes(fullPattern.replace('*', ''))) {
        this.localCache.delete(key);
      }
    }

    logger.info(`AI cache invalidated for pattern: ${fullPattern}`);
  }

  private getFromLocalCache<T>(key: string): T | null {
    const entry = this.localCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.localCache.delete(key);
      return null;
    }

    // Increment hit count for LRU
    entry.hits++;
    return entry.value;
  }

  private setToLocalCache<T>(key: string, value: T, ttl: number): void {
    // Éviction LRU si le cache est plein
    if (this.localCache.size >= this.maxLocalCacheSize) {
      this.evictLeastRecentlyUsed();
    }

    this.localCache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000),
      hits: 0
    });
  }

  private evictLeastRecentlyUsed(): void {
    let leastUsedKey = '';
    let minHits = Infinity;

    for (const [key, entry] of this.localCache) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.localCache.delete(leastUsedKey);
    }
  }

  private cleanupLocalCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.localCache) {
      if (now > entry.expiry) {
        this.localCache.delete(key);
      }
    }
  }

  getMetrics() {
    const localCacheSize = this.localCache.size;
    const distributedMetrics = this.distributedCache.getMetrics();
    
    return {
      local: {
        size: localCacheSize,
        maxSize: this.maxLocalCacheSize,
        utilizationRate: localCacheSize / this.maxLocalCacheSize
      },
      distributed: distributedMetrics,
      strategies: this.cacheStrategies
    };
  }
}

export const enhancedAICache = EnhancedAIRecommendationsCache.getInstance();
