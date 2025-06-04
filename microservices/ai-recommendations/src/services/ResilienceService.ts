
import { createResilienceOrchestrator, ResilienceOrchestrator } from '../../../shared/src/resilience/ResilienceOrchestrator';
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

class ResilienceService {
  private static instance: ResilienceService;
  private orchestrator: ResilienceOrchestrator;
  private cache: DistributedCache;

  private constructor() {
    // Initialize cache for AI Recommendations
    this.cache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 300, // 5 minutes for recommendations
      keyPrefix: 'ai-rec',
      compression: false,
      serialization: 'json'
    });

    // Configure resilience with AI-specific settings
    this.orchestrator = createResilienceOrchestrator(
      'ai-recommendations',
      {
        circuitBreaker: {
          enabled: true,
          failureThreshold: 0.5, // 50% failure rate threshold
          resetTimeoutMs: 60000, // 1 minute
          timeoutMs: 8000 // 8 seconds for AI operations
        },
        retry: {
          enabled: true,
          maxAttempts: 3,
          baseDelayMs: 1000,
          maxDelayMs: 10000
        },
        timeout: {
          enabled: true,
          defaultTimeoutMs: 8000 // AI operations can take longer
        },
        cache: {
          enabled: true,
          ttl: 300 // 5 minutes
        }
      },
      this.cache
    );
  }

  static getInstance(): ResilienceService {
    if (!ResilienceService.instance) {
      ResilienceService.instance = new ResilienceService();
    }
    return ResilienceService.instance;
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
      logger.info('AI Recommendations resilience service initialized');
    } catch (error) {
      logger.error('Failed to initialize resilience service:', error);
      throw error;
    }
  }

  getMetrics() {
    return this.orchestrator.getMetrics();
  }

  getHealthStatus() {
    return this.orchestrator.getHealthStatus();
  }
}

export const resilienceService = ResilienceService.getInstance();
