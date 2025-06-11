
import { createResilienceOrchestrator, ResilienceOrchestrator } from '../../../shared/src/resilience/ResilienceOrchestrator';
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

class AnalyticsResilienceService {
  private static instance: AnalyticsResilienceService;
  private orchestrator: ResilienceOrchestrator;
  private cache: DistributedCache;

  private constructor() {
    // Initialize cache for Analytics with short TTL for real-time data
    this.cache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 30, // 30 seconds for real-time metrics
      keyPrefix: 'analytics',
      compression: false,
      serialization: 'json'
    });

    // Configure resilience with Analytics-specific settings
    this.orchestrator = createResilienceOrchestrator(
      'analytics',
      {
        circuitBreaker: {
          enabled: true,
          failureThreshold: 0.4, // 40% failure rate threshold
          resetTimeoutMs: 45000, // 45 seconds
          timeoutMs: 3000 // 3 seconds for real-time data
        },
        retry: {
          enabled: true,
          maxAttempts: 3,
          baseDelayMs: 200, // Faster retry for analytics
          maxDelayMs: 2000
        },
        timeout: {
          enabled: true,
          defaultTimeoutMs: 3000 // Short timeout for real-time data
        },
        cache: {
          enabled: true,
          ttl: 30 // 30 seconds for metrics
        }
      },
      this.cache
    );
  }

  static getInstance(): AnalyticsResilienceService {
    if (!AnalyticsResilienceService.instance) {
      AnalyticsResilienceService.instance = new AnalyticsResilienceService();
    }
    return AnalyticsResilienceService.instance;
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
      logger.info('Analytics resilience service initialized');
    } catch (error) {
      logger.error('Failed to initialize Analytics resilience service:', error);
      throw error;
    }
  }

  getMetrics() {
    return this.orchestrator.getMetrics();
  }

  getHealthStatus() {
    return this.orchestrator.getHealthStatus();
  }

  // Special method for analytics to handle high-frequency events
  async trackEventWithResilience(eventData: any): Promise<void> {
    return this.orchestrator.execute(
      async () => {
        // Event tracking logic would go here
        logger.info('Event tracked:', eventData.eventType);
      },
      'track-event'
    );
  }
}

export const analyticsResilienceService = AnalyticsResilienceService.getInstance();
