
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

export interface CMSCacheConfig {
  staticContent: { ttl: number; priority: 'high' | 'medium' | 'low' };
  templates: { ttl: number; priority: 'high' | 'medium' | 'low' };
  countryContent: { ttl: number; priority: 'high' | 'medium' | 'low' };
  sectorContent: { ttl: number; priority: 'high' | 'medium' | 'low' };
  translations: { ttl: number; priority: 'high' | 'medium' | 'low' };
}

export class EnhancedCMSCache {
  private static instance: EnhancedCMSCache;
  private distributedCache: DistributedCache;
  private localCache: Map<string, { value: any; expiry: number; accessTime: number }>;
  private maxLocalCacheSize = 1000;

  private cacheStrategies: CMSCacheConfig = {
    staticContent: { ttl: 3600, priority: 'high' },     // 1h - contenu statique
    templates: { ttl: 7200, priority: 'high' },         // 2h - templates
    countryContent: { ttl: 1800, priority: 'medium' },  // 30min - contenu par pays
    sectorContent: { ttl: 2400, priority: 'medium' },   // 40min - contenu par secteur
    translations: { ttl: 14400, priority: 'low' }       // 4h - traductions
  };

  private constructor() {
    this.localCache = new Map();
    this.distributedCache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 3600,
      keyPrefix: 'cms-enhanced',
      compression: true,
      serialization: 'json'
    });

    // Nettoyage automatique du cache local toutes les 10 minutes
    setInterval(() => this.cleanupLocalCache(), 600000);
  }

  static getInstance(): EnhancedCMSCache {
    if (!EnhancedCMSCache.instance) {
      EnhancedCMSCache.instance = new EnhancedCMSCache();
    }
    return EnhancedCMSCache.instance;
  }

  async initialize(): Promise<void> {
    await this.distributedCache.connect();
    logger.info('Enhanced CMS cache initialized');
  }

  async get<T>(key: string, cacheType: keyof CMSCacheConfig): Promise<T | null> {
    const fullKey = `${cacheType}:${key}`;
    
    // 1. Cache local (priorité au contenu statique et templates)
    const localResult = this.getFromLocalCache<T>(fullKey);
    if (localResult !== null) {
      return localResult;
    }

    // 2. Cache distribué Redis
    const distributedResult = await this.distributedCache.get<T>(fullKey);
    if (distributedResult !== null) {
      // Mettre en cache localement si priorité élevée ou medium
      const strategy = this.cacheStrategies[cacheType];
      if (strategy.priority === 'high' || strategy.priority === 'medium') {
        this.setToLocalCache(fullKey, distributedResult, strategy.ttl);
      }
      return distributedResult;
    }

    return null;
  }

  async set<T>(
    key: string, 
    value: T, 
    cacheType: keyof CMSCacheConfig,
    tags?: string[]
  ): Promise<void> {
    const fullKey = `${cacheType}:${key}`;
    const strategy = this.cacheStrategies[cacheType];
    
    // Sauvegarder dans Redis avec tags pour invalidation
    await this.distributedCache.set(fullKey, { data: value, tags: tags || [] }, strategy.ttl);
    
    // Cache local pour contenu haute priorité
    if (strategy.priority === 'high') {
      this.setToLocalCache(fullKey, value, strategy.ttl);
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    // Invalidation intelligente par tags
    const pattern = `*`;
    const keys = await this.distributedCache.mget([pattern]);
    
    // TODO: Implémenter la logique d'invalidation par tags
    logger.info(`CMS cache invalidated by tag: ${tag}`);
  }

  async invalidateContent(contentId: string): Promise<void> {
    // Invalidation en cascade pour le contenu modifié
    const patterns = [
      `staticContent:*${contentId}*`,
      `countryContent:*${contentId}*`,
      `sectorContent:*${contentId}*`
    ];

    for (const pattern of patterns) {
      await this.distributedCache.deletePattern(pattern);
      
      // Invalider le cache local
      for (const [key] of this.localCache) {
        if (key.includes(contentId)) {
          this.localCache.delete(key);
        }
      }
    }

    logger.info(`CMS content cache invalidated for content: ${contentId}`);
  }

  private getFromLocalCache<T>(key: string): T | null {
    const entry = this.localCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.localCache.delete(key);
      return null;
    }

    // Marquer comme récemment accédé
    entry.accessTime = Date.now();
    return entry.value;
  }

  private setToLocalCache<T>(key: string, value: T, ttl: number): void {
    if (this.localCache.size >= this.maxLocalCacheSize) {
      this.evictLeastRecentlyAccessed();
    }

    this.localCache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000),
      accessTime: Date.now()
    });
  }

  private evictLeastRecentlyAccessed(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.localCache) {
      if (entry.accessTime < oldestTime) {
        oldestTime = entry.accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.localCache.delete(oldestKey);
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
    return {
      local: {
        size: this.localCache.size,
        maxSize: this.maxLocalCacheSize,
        utilizationRate: this.localCache.size / this.maxLocalCacheSize
      },
      distributed: this.distributedCache.getMetrics(),
      strategies: this.cacheStrategies
    };
  }
}

export const enhancedCMSCache = EnhancedCMSCache.getInstance();
