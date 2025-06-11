
import { enhancedAICache } from '../../../ai-recommendations/src/config/enhancedCache';
import { enhancedCMSCache } from '../../../cms/src/config/enhancedCache';
import { enhancedAnalyticsCache } from '../../../analytics/src/config/enhancedCache';
import { cacheMonitoringService } from '../cache/CacheMonitoringService';
import { logger } from '../utils/logger';

export async function initializeMultiLevelCache(): Promise<void> {
  try {
    logger.info('🚀 Starting multi-level cache initialization...');

    // Initialiser tous les caches améliorés
    await Promise.all([
      enhancedAICache.initialize(),
      enhancedCMSCache.initialize(),
      enhancedAnalyticsCache.initialize()
    ]);

    // Démarrer le monitoring
    cacheMonitoringService.getInstance();

    // Vérifier la santé initiale
    const healthStatus = cacheMonitoringService.getRealtimeStatus();
    const initialMetrics = await cacheMonitoringService.collectMetrics();

    logger.info('✅ Multi-level cache system initialized successfully!', {
      services: {
        aiRecommendations: {
          local: initialMetrics.services.aiRecommendations.local,
          strategies: Object.keys(initialMetrics.services.aiRecommendations.strategies)
        },
        cms: {
          local: initialMetrics.services.cms.local,
          strategies: Object.keys(initialMetrics.services.cms.strategies)
        },
        analytics: {
          local: initialMetrics.services.analytics.local,
          strategies: Object.keys(initialMetrics.services.analytics.strategies)
        }
      },
      globalHealth: healthStatus,
      features: {
        distributedRedis: 'active',
        localCache: 'active with LRU/LFU eviction',
        automaticInvalidation: 'enabled',
        realtimeMonitoring: 'enabled'
      }
    });

    // Log des stratégies de cache par service
    logger.info('🎯 Cache strategies configured:', {
      aiRecommendations: {
        userRecommendations: '5min TTL, high priority',
        behavioralData: '10min TTL, high priority',
        scoringModels: '30min TTL, medium priority'
      },
      cms: {
        staticContent: '1h TTL, high priority',
        templates: '2h TTL, high priority',
        countryContent: '30min TTL, medium priority'
      },
      analytics: {
        realtimeMetrics: '15s TTL, high priority',
        aggregatedData: '2min TTL, high priority',
        dashboardData: '1min TTL, medium priority'
      }
    });

  } catch (error) {
    logger.error('❌ Failed to initialize multi-level cache system:', error);
    throw error;
  }
}

// Fonction de nettoyage gracieux
export async function shutdownMultiLevelCache(): Promise<void> {
  try {
    logger.info('🔄 Shutting down multi-level cache system...');
    
    // Nettoyer les services
    enhancedAnalyticsCache.destroy();
    cacheMonitoringService.destroy();
    
    logger.info('✅ Multi-level cache system shutdown completed');
  } catch (error) {
    logger.error('❌ Error during cache system shutdown:', error);
  }
}

// Fonction de diagnostic du cache
export async function diagnoseCachePerformance(): Promise<{
  overall: string;
  recommendations: string[];
  criticalIssues: string[];
}> {
  try {
    const metrics = await cacheMonitoringService.collectMetrics();
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];

    // Analyser les performances
    if (metrics.global.totalHitRate < 0.5) {
      criticalIssues.push('Global cache hit rate is critically low (<50%)');
      recommendations.push('Review cache TTL strategies and cache key patterns');
    } else if (metrics.global.totalHitRate < 0.7) {
      recommendations.push('Consider optimizing cache strategies for better hit rates');
    }

    // Analyser l'utilisation mémoire
    Object.entries(metrics.services).forEach(([service, serviceMetrics]) => {
      if (serviceMetrics.local.utilizationRate > 0.9) {
        recommendations.push(`Increase local cache size for ${service} service`);
      }
    });

    const overall = criticalIssues.length > 0 ? 'CRITICAL' : 
                   recommendations.length > 0 ? 'NEEDS_OPTIMIZATION' : 'OPTIMAL';

    return { overall, recommendations, criticalIssues };
  } catch (error) {
    logger.error('Error diagnosing cache performance:', error);
    return {
      overall: 'ERROR',
      recommendations: [],
      criticalIssues: ['Failed to diagnose cache performance']
    };
  }
}
