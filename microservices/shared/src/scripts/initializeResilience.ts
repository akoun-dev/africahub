
import { ResilienceInitializer } from '../middleware/resilienceInitializer';
import { logger } from '../utils/logger';

// Import all resilience services
import { resilienceService as aiResilienceService } from '../../../ai-recommendations/src/services/ResilienceService';
import { cmsResilienceService } from '../../../cms/src/services/ResilienceService';
import { analyticsResilienceService } from '../../../analytics/src/services/ResilienceService';

export async function initializeAllResilienceServices(): Promise<void> {
  try {
    logger.info('Starting resilience services initialization...');

    // Register all services
    ResilienceInitializer.registerService('ai-recommendations', aiResilienceService);
    ResilienceInitializer.registerService('cms', cmsResilienceService);
    ResilienceInitializer.registerService('analytics', analyticsResilienceService);

    // Initialize all services
    await ResilienceInitializer.initializeAll();

    // Log initial health status
    const health = ResilienceInitializer.getGlobalHealth();
    logger.info('Resilience services health status:', health);

    logger.info('✓ All resilience services are ready!');
  } catch (error) {
    logger.error('Failed to initialize resilience services:', error);
    throw error;
  }
}

// Health check function
export function getResilienceHealthStatus() {
  return ResilienceInitializer.getGlobalHealth();
}

// Metrics collection function
export function getResilienceMetrics() {
  return ResilienceInitializer.getGlobalMetrics();
}
