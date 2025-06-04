
import { createEnhancedResilienceOrchestrator, EnhancedResilienceOrchestrator } from '../../../shared/src/resilience/EnhancedResilienceOrchestrator';
import { DistributedCache } from '../../../shared/src/cache/DistributedCache';
import { logger } from '../utils/logger';

class EnhancedAnalyticsResilienceService {
  private static instance: EnhancedAnalyticsResilienceService;
  private orchestrator: EnhancedResilienceOrchestrator;
  private cache: DistributedCache;

  private constructor() {
    this.cache = new DistributedCache({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      },
      defaultTTL: 30, // 30 seconds for real-time analytics
      keyPrefix: 'analytics-enhanced',
      compression: false,
      serialization: 'json'
    });

    this.orchestrator = createEnhancedResilienceOrchestrator(
      'analytics-enhanced',
      {
        circuitBreaker: {
          enabled: true,
          failureThreshold: 0.4,
          resetTimeoutMs: 45000,
          timeoutMs: 3000
        },
        retry: {
          enabled: true,
          contextualRetries: true,
          enableJitter: true,
          operationTypes: {
            read: { maxAttempts: 3, baseDelayMs: 100, maxDelayMs: 1000 },
            write: { maxAttempts: 2, baseDelayMs: 200, maxDelayMs: 2000 },
            external: { maxAttempts: 4, baseDelayMs: 500, maxDelayMs: 5000 },
            critical: { maxAttempts: 5, baseDelayMs: 300, maxDelayMs: 3000 }
          }
        },
        timeout: {
          enabled: true,
          defaultTimeoutMs: 3000,
          operationTimeouts: {
            read: 2000,
            write: 3000,
            external: 5000,
            critical: 4000
          }
        },
        cache: {
          enabled: true,
          ttl: 30,
          strategyByOperation: {
            'track-event': { ttl: 60, priority: 'low' },
            'get-dashboard': { ttl: 120, priority: 'medium' },
            'get-realtime-metrics': { ttl: 15, priority: 'high' },
            'batch-track': { ttl: 30, priority: 'medium' }
          }
        }
      },
      this.cache
    );
  }

  static getInstance(): EnhancedAnalyticsResilienceService {
    if (!EnhancedAnalyticsResilienceService.instance) {
      EnhancedAnalyticsResilienceService.instance = new EnhancedAnalyticsResilienceService();
    }
    return EnhancedAnalyticsResilienceService.instance;
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
      logger.info('Enhanced Analytics resilience service initialized');
    } catch (error) {
      logger.error('Failed to initialize enhanced Analytics resilience service:', error);
      throw error;
    }
  }

  getMetrics() {
    return this.orchestrator.getEnhancedMetrics();
  }

  getHealthStatus() {
    return this.orchestrator.getHealthStatus();
  }

  // Analytics-specific helper methods
  async executeEventTracking<T>(
    operation: () => Promise<T>,
    eventType: string,
    sessionId: string
  ): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      'track-event',
      'write',
      `event:${eventType}:${sessionId}`
    );
  }

  async executeBatchTracking<T>(
    operation: () => Promise<T>,
    batchSize: number
  ): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      'batch-track',
      'critical',
      `batch:${batchSize}:${Date.now()}`
    );
  }

  async executeRealtimeQuery<T>(
    operation: () => Promise<T>,
    queryType: string
  ): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      'get-realtime-metrics',
      'read',
      `realtime:${queryType}`
    );
  }
}

export const enhancedAnalyticsResilienceService = EnhancedAnalyticsResilienceService.getInstance();
