
import { ResilienceInitializer } from '../middleware/resilienceInitializer';
import { logger } from '../utils/logger';

// Import enhanced resilience services
import { enhancedAIResilienceService } from '../../../ai-recommendations/src/services/EnhancedResilienceService';
import { enhancedCMSResilienceService } from '../../../cms/src/services/EnhancedResilienceService';
import { enhancedAnalyticsResilienceService } from '../../../analytics/src/services/EnhancedResilienceService';

export async function initializeAllEnhancedResilienceServices(): Promise<void> {
  try {
    logger.info('Starting enhanced resilience services initialization...');

    // Register all enhanced services
    ResilienceInitializer.registerService('ai-recommendations-enhanced', enhancedAIResilienceService);
    ResilienceInitializer.registerService('cms-enhanced', enhancedCMSResilienceService);
    ResilienceInitializer.registerService('analytics-enhanced', enhancedAnalyticsResilienceService);

    // Initialize all services
    await ResilienceInitializer.initializeAll();

    // Log detailed health status
    const health = ResilienceInitializer.getGlobalHealth();
    const metrics = ResilienceInitializer.getGlobalMetrics();
    
    logger.info('Enhanced resilience services health status:', {
      health,
      enhanced_features: {
        contextual_retries: true,
        operation_type_differentiation: true,
        intelligent_caching: true,
        jitter_enabled: true
      }
    });

    // Log retry patterns summary
    Object.entries(metrics).forEach(([serviceName, serviceMetrics]) => {
      if (serviceMetrics.retry?.retriesByOperationType) {
        logger.info(`${serviceName} retry patterns:`, serviceMetrics.retry.retriesByOperationType);
      }
    });

    logger.info('✓ All enhanced resilience services are ready with advanced retry patterns!');
  } catch (error) {
    logger.error('Failed to initialize enhanced resilience services:', error);
    throw error;
  }
}

// Enhanced health check with detailed retry metrics
export function getEnhancedResilienceHealthStatus() {
  const globalHealth = ResilienceInitializer.getGlobalHealth();
  const globalMetrics = ResilienceInitializer.getGlobalMetrics();
  
  return {
    ...globalHealth,
    enhanced_metrics: {
      retry_patterns: Object.entries(globalMetrics).reduce((acc, [service, metrics]) => {
        if (metrics.retry?.retriesByOperationType) {
          acc[service] = metrics.retry.retriesByOperationType;
        }
        return acc;
      }, {} as Record<string, any>),
      contextual_success_rates: Object.entries(globalMetrics).reduce((acc, [service, metrics]) => {
        if (metrics.retry?.contextualSuccessRate !== undefined) {
          acc[service] = metrics.retry.contextualSuccessRate;
        }
        return acc;
      }, {} as Record<string, number>)
    }
  };
}

// Enhanced metrics with retry pattern analysis
export function getEnhancedResilienceMetrics() {
  const globalMetrics = ResilienceInitializer.getGlobalMetrics();
  
  return {
    ...globalMetrics,
    retry_analysis: {
      total_retries_by_type: Object.values(globalMetrics).reduce((acc, metrics) => {
        if (metrics.retry?.retriesByOperationType) {
          Object.entries(metrics.retry.retriesByOperationType).forEach(([type, count]) => {
            acc[type] = (acc[type] || 0) + count;
          });
        }
        return acc;
      }, {} as Record<string, number>),
      
      avg_contextual_success_rate: Object.values(globalMetrics)
        .filter(m => m.retry?.contextualSuccessRate !== undefined)
        .reduce((sum, m, _, arr) => sum + (m.retry.contextualSuccessRate / arr.length), 0),
        
      jitter_effectiveness: 'enabled_across_all_services'
    }
  };
}
