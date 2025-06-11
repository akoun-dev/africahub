
import { createResilienceOrchestrator, ResilienceOrchestrator } from '../../../shared/src/resilience/ResilienceOrchestrator';
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

class CMSResilienceService {
  private static instance: CMSResilienceService;
  private orchestrator: ResilienceOrchestrator;
  private cache: DistributedCache;

  private constructor() {
    // Initialize cache for CMS with longer TTL for static content
    this.cache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 3600, // 1 hour for CMS content
      keyPrefix: 'cms',
      compression: true,
      serialization: 'json'
    });

    // Configure resilience with CMS-specific settings
    this.orchestrator = createResilienceOrchestrator(
      'cms',
      {
        circuitBreaker: {
          enabled: true,
          failureThreshold: 0.3, // 30% failure rate threshold (stricter for CMS)
          resetTimeoutMs: 30000, // 30 seconds
          timeoutMs: 5000 // 5 seconds for content retrieval
        },
        retry: {
          enabled: true,
          maxAttempts: 2, // Less retries for content operations
          baseDelayMs: 500,
          maxDelayMs: 5000
        },
        timeout: {
          enabled: true,
          defaultTimeoutMs: 5000
        },
        cache: {
          enabled: true,
          ttl: 3600 // 1 hour for static content
        }
      },
      this.cache
    );
  }

  static getInstance(): CMSResilienceService {
    if (!CMSResilienceService.instance) {
      CMSResilienceService.instance = new CMSResilienceService();
    }
    return CMSResilienceService.instance;
  }

  async executeWithResilience<T>(
    operation: () => Promise<T>,
    operationName: string,
    cacheKey?: string
  ): Promise<T> {
    return this.orchestrator.execute(operation, operationName, cacheKey);
  }

  async initialize(): Promise<void> {
    try {
      await this.cache.connect();
      logger.info('CMS resilience service initialized');
    } catch (error) {
      logger.error('Failed to initialize CMS resilience service:', error);
      throw error;
    }
  }

  async invalidateCache(pattern: string): Promise<void> {
    try {
      await this.cache.deletePattern(pattern);
      logger.info(`Cache invalidated for pattern: ${pattern}`);
    } catch (error) {
      logger.error('Failed to invalidate cache:', error);
    }
  }

  getMetrics() {
    return this.orchestrator.getMetrics();
  }

  getHealthStatus() {
    return this.orchestrator.getHealthStatus();
  }
}

export const cmsResilienceService = CMSResilienceService.getInstance();
