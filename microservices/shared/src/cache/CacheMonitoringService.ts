
import { enhancedAICache } from '../../../ai-recommendations/src/config/enhancedCache';
import { enhancedCMSCache } from '../../../cms/src/config/enhancedCache';
import { enhancedAnalyticsCache } from '../../../analytics/src/config/enhancedCache';
import { logger } from '../utils/logger';

export interface GlobalCacheMetrics {
  services: {
    aiRecommendations: any;
    cms: any;
    analytics: any;
  };
  global: {
    totalCacheSize: number;
    totalHitRate: number;
    totalMissRate: number;
    averageLatency: number;
  };
  alerts: string[];
}

export class CacheMonitoringService {
  private static instance: CacheMonitoringService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alerts: string[] = [];

  private constructor() {
    // Monitoring toutes les 30 secondes
    this.monitoringInterval = setInterval(() => this.collectMetrics(), 30000);
  }

  static getInstance(): CacheMonitoringService {
    if (!CacheMonitoringService.instance) {
      CacheMonitoringService.instance = new CacheMonitoringService();
    }
    return CacheMonitoringService.instance;
  }

  async collectMetrics(): Promise<GlobalCacheMetrics> {
    this.alerts = [];

    try {
      const aiMetrics = enhancedAICache.getMetrics();
      const cmsMetrics = enhancedCMSCache.getMetrics();
      const analyticsMetrics = enhancedAnalyticsCache.getMetrics();

      // Calculer les métriques globales
      const totalLocalSize = aiMetrics.local.size + cmsMetrics.local.size + analyticsMetrics.local.size;
      const totalDistributedHits = aiMetrics.distributed.hits + cmsMetrics.distributed.hits + analyticsMetrics.distributed.hits;
      const totalDistributedMisses = aiMetrics.distributed.misses + cmsMetrics.distributed.misses + analyticsMetrics.distributed.misses;
      const totalOperations = totalDistributedHits + totalDistributedMisses;

      // Vérifications d'alerte
      this.checkCacheHealth(aiMetrics, 'AI-Recommendations');
      this.checkCacheHealth(cmsMetrics, 'CMS');
      this.checkCacheHealth(analyticsMetrics, 'Analytics');

      const globalMetrics: GlobalCacheMetrics = {
        services: {
          aiRecommendations: aiMetrics,
          cms: cmsMetrics,
          analytics: analyticsMetrics
        },
        global: {
          totalCacheSize: totalLocalSize,
          totalHitRate: totalOperations > 0 ? totalDistributedHits / totalOperations : 0,
          totalMissRate: totalOperations > 0 ? totalDistributedMisses / totalOperations : 0,
          averageLatency: (aiMetrics.distributed.hitRate + cmsMetrics.distributed.hitRate + analyticsMetrics.distributed.hitRate) / 3
        },
        alerts: this.alerts
      };

      // Log des métriques importantes
      if (globalMetrics.global.totalHitRate < 0.7) {
        logger.warn(`Global cache hit rate below threshold: ${(globalMetrics.global.totalHitRate * 100).toFixed(1)}%`);
      }

      return globalMetrics;
    } catch (error) {
      logger.error('Error collecting cache metrics:', error);
      throw error;
    }
  }

  private checkCacheHealth(metrics: any, serviceName: string): void {
    // Vérifier le taux de hit du cache distribué
    if (metrics.distributed.hitRate < 0.7) {
      this.alerts.push(`${serviceName}: Hit rate below 70% (${(metrics.distributed.hitRate * 100).toFixed(1)}%)`);
    }

    // Vérifier l'utilisation du cache local
    if (metrics.local.utilizationRate > 0.9) {
      this.alerts.push(`${serviceName}: Local cache utilization above 90% (${(metrics.local.utilizationRate * 100).toFixed(1)}%)`);
    }

    // Vérifier les erreurs
    if (metrics.distributed.errors > 10) {
      this.alerts.push(`${serviceName}: High error count (${metrics.distributed.errors})`);
    }
  }

  getRealtimeStatus(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];

    if (this.alerts.length > 0) {
      issues.push(...this.alerts);
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  }

  async invalidateAllCaches(): Promise<void> {
    try {
      await enhancedAICache.invalidate('*');
      await enhancedCMSCache.invalidateContent('*');
      await enhancedAnalyticsCache.invalidateStaleMetrics();
      
      logger.info('All caches invalidated successfully');
    } catch (error) {
      logger.error('Error invalidating all caches:', error);
      throw error;
    }
  }

  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

export const cacheMonitoringService = CacheMonitoringService.getInstance();
