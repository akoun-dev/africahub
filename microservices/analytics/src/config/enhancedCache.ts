
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

export interface AnalyticsCacheConfig {
  realtimeMetrics: { ttl: number; priority: 'high' | 'medium' | 'low' };
  aggregatedData: { ttl: number; priority: 'high' | 'medium' | 'low' };
  dashboardData: { ttl: number; priority: 'high' | 'medium' | 'low' };
  userBehavior: { ttl: number; priority: 'high' | 'medium' | 'low' };
  reportData: { ttl: number; priority: 'high' | 'medium' | 'low' };
}

export class EnhancedAnalyticsCache {
  private static instance: EnhancedAnalyticsCache;
  private distributedCache: DistributedCache;
  private localCache: Map<string, { value: any; expiry: number; frequency: number }>;
  private maxLocalCacheSize = 1000;
  private refreshInterval: NodeJS.Timeout | null = null;

  private cacheStrategies: AnalyticsCacheConfig = {
    realtimeMetrics: { ttl: 15, priority: 'high' },      // 15s - métriques temps réel
    aggregatedData: { ttl: 120, priority: 'high' },      // 2min - données agrégées
    dashboardData: { ttl: 60, priority: 'medium' },      // 1min - données de dashboard
    userBehavior: { ttl: 300, priority: 'medium' },      // 5min - comportement utilisateur
    reportData: { ttl: 900, priority: 'low' }            // 15min - rapports
  };

  private constructor() {
    this.localCache = new Map();
    this.distributedCache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 30,
      keyPrefix: 'analytics-enhanced',
      compression: false, // Pas de compression pour la vitesse
      serialization: 'json'
    });

    // Refresh automatique des métriques temps réel toutes les 10 secondes
    this.refreshInterval = setInterval(() => this.refreshRealtimeMetrics(), 10000);
    
    // Nettoyage du cache local toutes les 2 minutes
    setInterval(() => this.cleanupLocalCache(), 120000);
  }

  static getInstance(): EnhancedAnalyticsCache {
    if (!EnhancedAnalyticsCache.instance) {
      EnhancedAnalyticsCache.instance = new EnhancedAnalyticsCache();
    }
    return EnhancedAnalyticsCache.instance;
  }

  async initialize(): Promise<void> {
    await this.distributedCache.connect();
    logger.info('Enhanced Analytics cache initialized');
  }

  async get<T>(key: string, cacheType: keyof AnalyticsCacheConfig): Promise<T | null> {
    const fullKey = `${cacheType}:${key}`;
    
    // Pour les métriques temps réel, priorité absolue au cache local
    if (cacheType === 'realtimeMetrics') {
      const localResult = this.getFromLocalCache<T>(fullKey);
      if (localResult !== null) {
        return localResult;
      }
    }

    // Cache local standard
    const localResult = this.getFromLocalCache<T>(fullKey);
    if (localResult !== null) {
      return localResult;
    }

    // Cache distribué
    const distributedResult = await this.distributedCache.get<T>(fullKey);
    if (distributedResult !== null) {
      // Toujours mettre en cache local pour analytics (accès fréquent)
      this.setToLocalCache(fullKey, distributedResult, this.cacheStrategies[cacheType].ttl);
      return distributedResult;
    }

    return null;
  }

  async set<T>(
    key: string, 
    value: T, 
    cacheType: keyof AnalyticsCacheConfig,
    forceLocal = false
  ): Promise<void> {
    const fullKey = `${cacheType}:${key}`;
    const strategy = this.cacheStrategies[cacheType];
    
    // Toujours sauvegarder dans Redis
    await this.distributedCache.set(fullKey, value, strategy.ttl);
    
    // Cache local automatique pour métriques temps réel et données agrégées
    if (cacheType === 'realtimeMetrics' || cacheType === 'aggregatedData' || forceLocal) {
      this.setToLocalCache(fullKey, value, strategy.ttl);
    }
  }

  async invalidateStaleMetrics(): Promise<void> {
    // Invalidation automatique des métriques obsolètes
    const patterns = [
      'realtimeMetrics:*',
      'aggregatedData:*'
    ];

    for (const pattern of patterns) {
      await this.distributedCache.deletePattern(pattern);
    }

    // Nettoyer le cache local des métriques temps réel
    for (const [key] of this.localCache) {
      if (key.startsWith('realtimeMetrics:') || key.startsWith('aggregatedData:')) {
        this.localCache.delete(key);
      }
    }

    logger.info('Analytics stale metrics invalidated');
  }

  private async refreshRealtimeMetrics(): Promise<void> {
    // Logique de refresh automatique des métriques temps réel
    try {
      // Cette méthode sera appelée pour regénérer les métriques les plus importantes
      logger.debug('Refreshing realtime metrics cache');
    } catch (error) {
      logger.error('Error refreshing realtime metrics:', error);
    }
  }

  private getFromLocalCache<T>(key: string): T | null {
    const entry = this.localCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.localCache.delete(key);
      return null;
    }

    // Incrémenter la fréquence d'accès
    entry.frequency++;
    return entry.value;
  }

  private setToLocalCache<T>(key: string, value: T, ttl: number): void {
    if (this.localCache.size >= this.maxLocalCacheSize) {
      this.evictLeastFrequentlyUsed();
    }

    this.localCache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000),
      frequency: 1
    });
  }

  private evictLeastFrequentlyUsed(): void {
    let leastUsedKey = '';
    let minFrequency = Infinity;

    for (const [key, entry] of this.localCache) {
      if (entry.frequency < minFrequency) {
        minFrequency = entry.frequency;
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
    return {
      local: {
        size: this.localCache.size,
        maxSize: this.maxLocalCacheSize,
        utilizationRate: this.localCache.size / this.maxLocalCacheSize,
        averageFrequency: Array.from(this.localCache.values())
          .reduce((sum, entry) => sum + entry.frequency, 0) / this.localCache.size || 0
      },
      distributed: this.distributedCache.getMetrics(),
      strategies: this.cacheStrategies
    };
  }

  destroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

export const enhancedAnalyticsCache = EnhancedAnalyticsCache.getInstance();
