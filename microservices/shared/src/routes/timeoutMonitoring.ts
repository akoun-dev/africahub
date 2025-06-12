
import express from 'express';
import { timeoutMonitoringService } from '../monitoring/TimeoutMonitoringService';
import { logger } from '../utils/logger';

const router = express.Router();

// GET /timeout/metrics - Métriques globales des timeouts
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await timeoutMonitoringService.collectMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching timeout metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeout metrics'
    });
  }
});

// GET /timeout/health - Statut de santé des timeouts
router.get('/health', async (req, res) => {
  try {
    const status = timeoutMonitoringService.getRealtimeStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching timeout health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeout health'
    });
  }
});

// POST /timeout/optimize - Optimisation des timeouts
router.post('/optimize', async (req, res) => {
  try {
    await timeoutMonitoringService.optimizeTimeouts();
    
    res.json({
      success: true,
      message: 'Timeout optimization completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error optimizing timeouts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize timeouts'
    });
  }
});

// GET /timeout/stats/adaptive - Statistiques des timeouts adaptatifs
router.get('/stats/adaptive', async (req, res) => {
  try {
    const metrics = await timeoutMonitoringService.collectMetrics();
    
    // Extraire les données adaptatives
    const adaptiveStats = Object.entries(metrics.services).map(([service, data]: [string, any]) => ({
      service,
      adaptiveTimeouts: data.adaptiveTimeouts || {},
      adjustments: data.adaptiveAdjustments || 0,
      health: data.health?.adaptiveStatus || 'No adaptive data'
    }));

    res.json({
      success: true,
      data: {
        services: adaptiveStats,
        globalAdjustments: metrics.global.adaptiveAdjustments,
        recommendations: metrics.recommendations
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching adaptive timeout stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch adaptive stats'
    });
  }
});

export default router;
