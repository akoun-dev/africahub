
import { createEnhancedResilienceOrchestrator, EnhancedResilienceOrchestrator } from '../../../shared/src/resilience/EnhancedResilienceOrchestrator';
import { EnhancedTimeoutManager } from '../../../shared/src/resilience/TimeoutManager';
import { enhancedAICache } from '../config/enhancedCache';
import { logger } from '../utils/logger';

class EnhancedAIResilienceService {
  private static instance: EnhancedAIResilienceService;
  private orchestrator: EnhancedResilienceOrchestrator;
  private timeoutManager: EnhancedTimeoutManager;

  private constructor() {
    // Configure enhanced timeout management for AI operations
    this.timeoutManager = new EnhancedTimeoutManager({
      defaultTimeoutMs: 8000, // 8s for AI operations
      operationTimeouts: {
        'generate-recommendations': 12000, // 12s for complex ML operations
        'get-user-recommendations': 5000,  // 5s for data retrieval
        'update-interaction': 3000,        // 3s for simple writes
        'behavioral-analysis': 15000,      // 15s for complex analysis
        'model-training': 30000            // 30s for model operations
      },
      enableGracefulTimeout: true,
      gracefulTimeoutMs: 2000,
      adaptiveTimeouts: true,
      timeoutMultiplier: 1.8
    });

    // Configure enhanced resilience with optimized multi-level cache
    this.orchestrator = createEnhancedResilienceOrchestrator(
      'ai-recommendations-enhanced',
      {
        circuitBreaker: {
          enabled: true,
          failureThreshold: 0.5,
          resetTimeoutMs: 60000,
          timeoutMs: 8000
        },
        retry: {
          enabled: true,
          contextualRetries: true,
          enableJitter: true,
          operationTypes: {
            read: { maxAttempts: 3, baseDelayMs: 500, maxDelayMs: 5000 },
            write: { maxAttempts: 2, baseDelayMs: 1000, maxDelayMs: 8000 },
            external: { maxAttempts: 4, baseDelayMs: 2000, maxDelayMs: 15000 },
            critical: { maxAttempts: 5, baseDelayMs: 1500, maxDelayMs: 20000 }
          }
        },
        timeout: {
          enabled: true,
          defaultTimeoutMs: 8000,
          operationTimeouts: {
            read: 5000,
            write: 8000,
            external: 15000,
            critical: 12000
          }
        },
        cache: {
          enabled: true,
          ttl: 300,
          strategyByOperation: {
            'get-user-recommendations': { ttl: 300, priority: 'high' },
            'generate-recommendations': { ttl: 600, priority: 'high' },
            'get-recommendation-metrics': { ttl: 120, priority: 'medium' },
            'update-interaction': { ttl: 60, priority: 'low' }
          }
        }
      }
    );
  }

  static getInstance(): EnhancedAIResilienceService {
    if (!EnhancedAIResilienceService.instance) {
      EnhancedAIResilienceService.instance = new EnhancedAIResilienceService();
    }
    return EnhancedAIResilienceService.instance;
  }

  async executeWithEnhancedResilience<T>(
    operation: () => Promise<T>,
    operationName: string,
    operationType: 'read' | 'write' | 'external' | 'critical' = 'read',
    cacheKey?: string
  ): Promise<T> {
    // Use enhanced timeout management
    const timedOperation = () => this.timeoutManager.executeWithTimeout(
      operation,
      operationName,
      undefined,
      operationType
    );

    return this.orchestrator.executeWithContext(timedOperation, operationName, operationType, cacheKey);
  }

  async initialize(): Promise<void> {
    try {
      await enhancedAICache.initialize();
      logger.info('Enhanced AI Recommendations resilience service initialized with advanced timeout management');
    } catch (error) {
      logger.error('Failed to initialize enhanced AI resilience service:', error);
      throw error;
    }
  }

  // AI-specific helper methods with enhanced timeout and caching
  async executeRecommendationGeneration<T>(
    operation: () => Promise<T>,
    userId: string,
    insuranceType: string
  ): Promise<T> {
    const cacheKey = `rec-gen:${userId}:${insuranceType}`;
    
    // Vérifier d'abord le cache optimisé
    const cached = await enhancedAICache.get<T>(cacheKey, 'userRecommendations');
    if (cached !== null) {
      logger.info(`AI recommendation cache hit for user ${userId}`);
      return cached;
    }

    // Exécuter avec résilience et timeout adaptatif
    const result = await this.executeWithEnhancedResilience(
      operation,
      'generate-recommendations',
      'critical',
      cacheKey
    );

    // Mettre en cache le résultat
    await enhancedAICache.set(cacheKey, result, 'userRecommendations');
    
    return result;
  }

  async executeUserDataRetrieval<T>(
    operation: () => Promise<T>,
    userId: string
  ): Promise<T> {
    const cacheKey = `user-data:${userId}`;
    
    // Cache intelligent pour données comportementales
    const cached = await enhancedAICache.get<T>(cacheKey, 'behavioralData');
    if (cached !== null) {
      return cached;
    }

    const result = await this.executeWithEnhancedResilience(
      operation,
      'get-user-recommendations',
      'read',
      cacheKey
    );

    await enhancedAICache.set(cacheKey, result, 'behavioralData');
    return result;
  }

  async executeBehavioralAnalysis<T>(
    operation: () => Promise<T>,
    userId: string
  ): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      'behavioral-analysis',
      'critical'
    );
  }

  async executeInteractionTracking<T>(operation: () => Promise<T>): Promise<T> {
    return this.executeWithEnhancedResilience(
      operation,
      'update-interaction',
      'write'
    );
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await enhancedAICache.invalidate(`*${userId}*`, 'userRecommendations');
    await enhancedAICache.invalidate(`*${userId}*`, 'behavioralData');
  }

  getMetrics() {
    return {
      resilience: this.orchestrator.getEnhancedMetrics(),
      cache: enhancedAICache.getMetrics(),
      timeout: this.timeoutManager.getMetrics(),
      adaptive: this.timeoutManager.getAdaptiveTimeouts()
    };
  }

  getHealthStatus() {
    const resilienceHealth = this.orchestrator.getHealthStatus();
    const timeoutHealth = this.timeoutManager.getHealthStatus();
    
    return {
      resilience: resilienceHealth,
      timeout: timeoutHealth,
      overall: resilienceHealth.healthy && timeoutHealth.healthy
    };
  }
}

export const enhancedAIResilienceService = EnhancedAIResilienceService.getInstance();
