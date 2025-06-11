
import express from 'express';
import { cacheMonitoringService } from '../cache/CacheMonitoringService';
import { logger } from '../utils/logger';

const router = express.Router();

// GET /cache/metrics - Métriques globales des caches
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await cacheMonitoringService.collectMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching cache metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cache metrics'
    });
  }
});

// GET /cache/health - Statut de santé des caches
router.get('/health', async (req, res) => {
  try {
    const status = cacheMonitoringService.getRealtimeStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching cache health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cache health'
    });
  }
});

// POST /cache/invalidate - Invalidation globale des caches
router.post('/invalidate', async (req, res) => {
  try {
    await cacheMonitoringService.invalidateAllCaches();
    
    res.json({
      success: true,
      message: 'All caches invalidated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error invalidating caches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to invalidate caches'
    });
  }
});

// GET /cache/stats/realtime - Statistiques temps réel
router.get('/stats/realtime', async (req, res) => {
  try {
    const metrics = await cacheMonitoringService.collectMetrics();
    
    // Formatter pour affichage temps réel
    const realtimeStats = {
      hitRates: {
        aiRecommendations: metrics.services.aiRecommendations.distributed.hitRate,
        cms: metrics.services.cms.distributed.hitRate,
        analytics: metrics.services.analytics.distributed.hitRate,
        global: metrics.global.totalHitRate
      },
      cacheUtilization: {
        aiRecommendations: metrics.services.aiRecommendations.local.utilizationRate,
        cms: metrics.services.cms.local.utilizationRate,
        analytics: metrics.services.analytics.local.utilizationRate
      },
      activeAlerts: metrics.alerts.length,
      performance: {
        totalOperations: metrics.services.aiRecommendations.distributed.totalOperations +
                        metrics.services.cms.distributed.totalOperations +
                        metrics.services.analytics.distributed.totalOperations,
        averageLatency: metrics.global.averageLatency
      }
    };

    res.json({
      success: true,
      data: realtimeStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching realtime cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch realtime stats'
    });
  }
});

export default router;
