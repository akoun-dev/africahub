
import { createEnhancedResilienceOrchestrator, EnhancedResilienceOrchestrator } from '../../../shared/src/resilience/EnhancedResilienceOrchestrator';
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

class EnhancedCMSResilienceService {
  private static instance: EnhancedCMSResilienceService;
  private orchestrator: EnhancedResilienceOrchestrator;
  private cache: DistributedCache;

  private constructor() {
    this.cache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 3600, // 1 hour for CMS content
      keyPrefix: 'cms-enhanced',
      compression: true,
      serialization: 'json'
    });

    this.orchestrator = createEnhancedResilienceOrchestrator(
      'cms-enhanced',
      {
        circuitBreaker: {
          enabled: true,
          failureThreshold: 0.3,
          resetTimeoutMs: 30000,
          timeoutMs: 5000
        },
        retry: {
          enabled: true,
          contextualRetries: true,
          enableJitter: true,
          operationTypes: {
            read: { maxAttempts: 3, baseDelayMs: 300, maxDelayMs: 3000 },
            write: { maxAttempts: 2, baseDelayMs: 500, maxDelayMs: 5000 },
            external: { maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 8000 },
            critical: { maxAttempts: 4, baseDelayMs: 800, maxDelayMs: 10000 }
          }
        },
        timeout: {
          enabled: true,
          defaultTimeoutMs: 5000,
          operationTimeouts: {
            read: 3000,
            write: 5000,
            external: 8000,
            critical: 7000
          }
        },
        cache: {
          enabled: true,
          ttl: 3600,
          strategyByOperation: {
            'get-content': { ttl: 3600, priority: 'high' },
            'create-content': { ttl: 1800, priority: 'medium' },
            'update-content': { ttl: 900, priority: 'medium' },
            'get-templates': { ttl: 7200, priority: 'low' }
          }
        }
      },
      this.cache
    );
  }

  static getInstance(): EnhancedCMSResilienceService {
    if (!EnhancedCMSResilienceService.instance) {
      EnhancedCMSResilienceService.instance = new EnhancedCMSResilienceService();
    }
    return EnhancedCMSResilienceService.instance;
  }

  async executeWithEnhancedResilience<T>(
    operation: () => Promise<T>,
    operationName: string,
    operationType: 'read' | 'write' | 'external' | 'critical' = 'read',
    cacheKey?: string
  ): Promise<T> {
    return this.orchestrator.executeWithContext(operation, operationName, operationType, cacheKey);
  }

  async initialize(): Promise<void> {
    try {
      await this.cache.connect();
      logger.info('Enhanced CMS resilience service initialized');
    } catch (error) {
      logger.error('Failed to initialize enhanced CMS resilience service:', error);
      throw error;
    }
  }

  async invalidateCache(pattern: string): Promise<void> {
    try {
      await this.cache.deletePattern(pattern);
      logger.info(`Enhanced cache invalidated for pattern: ${pattern}`);
    } catch (error) {
      logger.error('Failed to invalidate enhanced cache:', error);
    }
  }

  getMetrics() {
    return this.orchestrator.getEnhancedMetrics();
  }

  getHealthStatus() {
    return this.orchestrator.getHealthStatus();
  }

  // CMS-specific helper methods
  async executeContentRetrieval<T>(
    operation: () => Promise<T>,
    contentKey: string
  ): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      'get-content',
      'read',
      `content:${contentKey}`
    );
  }

  async executeContentModification<T>(
    operation: () => Promise<T>,
    contentId: string,
    operationType: 'create' | 'update' | 'delete'
  ): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      `${operationType}-content`,
      'write',
      `content-mod:${contentId}`
    );
  }
}

export const enhancedCMSResilienceService = EnhancedCMSResilienceService.getInstance();
