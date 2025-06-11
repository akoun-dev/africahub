
import { enhancedAIResilienceService } from '../../../ai-recommendations/src/services/EnhancedResilienceService';
import { enhancedCMSResilienceService } from '../../../cms/src/services/EnhancedResilienceService';
import { enhancedAnalyticsResilienceService } from '../../../analytics/src/services/EnhancedResilienceService';
import { timeoutMonitoringService } from '../monitoring/TimeoutMonitoringService';
import { logger } from '../utils/logger';

export async function initializeTimeoutManagement(): Promise<void> {
  try {
    logger.info('🕐 Starting timeout management initialization...');

    // Initialiser tous les services avec timeout management
    await Promise.all([
      enhancedAIResilienceService.initialize(),
      enhancedCMSResilienceService.initialize(),
      enhancedAnalyticsResilienceService.initialize()
    ]);

    // Démarrer le monitoring des timeouts
    const monitoringService = timeoutMonitoringService;

    // Vérifier la santé initiale
    const healthStatus = monitoringService.getRealtimeStatus();
    const initialMetrics = await monitoringService.collectMetrics();

    logger.info('✅ Timeout management system initialized successfully!', {
      services: {
        aiRecommendations: {
          timeouts: initialMetrics.services.aiRecommendations?.timeoutsByOperation || {},
          adaptiveAdjustments: initialMetrics.services.aiRecommendations?.adaptiveAdjustments || 0
        },
        cms: {
          timeouts: initialMetrics.services.cms?.timeoutsByOperation || {},
          adaptiveAdjustments: initialMetrics.services.cms?.adaptiveAdjustments || 0
        },
        analytics: {
          timeouts: initialMetrics.services.analytics?.timeoutsByOperation || {},
          adaptiveAdjustments: initialMetrics.services.analytics?.adaptiveAdjustments || 0
        }
      },
      globalHealth: healthStatus,
      features: {
        adaptiveTimeouts: 'enabled',
        gracefulTimeouts: 'enabled',
        contextualOperations: 'enabled',
        realtimeMonitoring: 'enabled'
      }
    });

    // Log des configurations de timeout par service
    logger.info('⏱️ Timeout configurations active:', {
      aiRecommendations: {
        defaultTimeout: '8s',
        generateRecommendations: '12s',
        behavioralAnalysis: '15s',
        adaptiveMultiplier: '1.8x'
      },
      cms: {
        defaultTimeout: '5s',
        contentRetrieval: '3s',
        contentModification: '5s',
        adaptiveMultiplier: '1.5x'
      },
      analytics: {
        defaultTimeout: '3s',
        realtimeMetrics: '2s',
        batchProcessing: '4s',
        adaptiveMultiplier: '1.3x'
      }
    });

  } catch (error) {
    logger.error('❌ Failed to initialize timeout management system:', error);
    throw error;
  }
}

// Fonction de diagnostic des timeouts
export async function diagnoseTimeoutPerformance(): Promise<{
  overall: string;
  recommendations: string[];
  criticalIssues: string[];
  adaptiveInsights: string[];
}> {
  try {
    const metrics = await timeoutMonitoringService.collectMetrics();
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];
    const adaptiveInsights: string[] = [];

    // Analyser les performances globales
    if (metrics.global.globalTimeoutRate > 0.1) {
      criticalIssues.push('Global timeout rate is critically high (>10%)');
      recommendations.push('Review timeout configurations and optimize slow operations');
    } else if (metrics.global.globalTimeoutRate > 0.05) {
      recommendations.push('Global timeout rate above 5% - consider optimization');
    }

    // Analyser les ajustements adaptatifs
    if (metrics.global.adaptiveAdjustments > 50) {
      adaptiveInsights.push('High number of adaptive adjustments - system is learning');
      recommendations.push('Monitor adaptive changes and consider updating base timeouts');
    }

    // Analyser par service
    Object.entries(metrics.services).forEach(([service, serviceMetrics]: [string, any]) => {
      if (serviceMetrics.timeoutOperations > 10) {
        recommendations.push(`Service ${service} has high timeout count - review operations`);
      }
      
      if (Object.keys(serviceMetrics.adaptiveTimeouts || {}).length > 0) {
        adaptiveInsights.push(`Service ${service} has active adaptive timeouts`);
      }
    });

    const overall = criticalIssues.length > 0 ? 'CRITICAL' : 
                   recommendations.length > 3 ? 'NEEDS_OPTIMIZATION' : 'OPTIMAL';

    return { overall, recommendations, criticalIssues, adaptiveInsights };
  } catch (error) {
    logger.error('Error diagnosing timeout performance:', error);
    return {
      overall: 'ERROR',
      recommendations: [],
      criticalIssues: ['Failed to diagnose timeout performance'],
      adaptiveInsights: []
    };
  }
}

// Fonction de nettoyage gracieux
export async function shutdownTimeoutManagement(): Promise<void> {
  try {
    logger.info('🔄 Shutting down timeout management system...');
    
    // Nettoyer les services
    timeoutMonitoringService.destroy();
    
    logger.info('✅ Timeout management system shutdown completed');
  } catch (error) {
    logger.error('❌ Error during timeout system shutdown:', error);
  }
}
