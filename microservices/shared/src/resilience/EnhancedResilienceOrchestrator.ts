
import { CircuitBreaker, CircuitBreakerRegistry } from './CircuitBreaker';
import { EnhancedRetryPolicy, EnhancedRetryConfig } from './EnhancedRetryPolicy';
import { TimeoutManager } from './TimeoutManager';
import { DistributedCache } from '../cache/DistributedCache';
import { logger } from '../utils/logger';

export interface EnhancedResilienceConfig {
  circuitBreaker?: {
    enabled: boolean;
    failureThreshold: number;
    resetTimeoutMs: number;
    timeoutMs: number;
  };
  retry?: EnhancedRetryConfig;
  timeout?: {
    enabled: boolean;
    defaultTimeoutMs: number;
    operationTimeouts?: Record<string, number>;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    strategyByOperation?: Record<string, { ttl: number; priority: 'low' | 'medium' | 'high' }>;
  };
}

export interface EnhancedResilienceMetrics {
  circuitBreaker?: any;
  retry?: any;
  timeout?: any;
  cache?: any;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageLatency: number;
  operationMetrics: Record<string, {
    executions: number;
    successes: number;
    failures: number;
    avgLatency: number;
  }>;
}

export class EnhancedResilienceOrchestrator {
  private circuitBreaker?: CircuitBreaker;
  private retryPolicy?: EnhancedRetryPolicy;
  private timeoutManager?: TimeoutManager;
  private cache?: DistributedCache;
  private config: EnhancedResilienceConfig;
  private metrics: EnhancedResilienceMetrics = {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageLatency: 0,
    operationMetrics: {}
  };
  private latencies: number[] = [];

  constructor(
    serviceName: string,
    config: EnhancedResilienceConfig,
    cache?: DistributedCache
  ) {
    this.config = config;
    this.cache = cache;
    this.initializeComponents(serviceName);
  }

  private initializeComponents(serviceName: string): void {
    // Initialize Circuit Breaker
    if (this.config.circuitBreaker?.enabled) {
      const registry = CircuitBreakerRegistry.getInstance();
      this.circuitBreaker = registry.getOrCreate(serviceName, {
        name: serviceName,
        ...this.config.circuitBreaker
      });
    }

    // Initialize Enhanced Retry Policy
    if (this.config.retry?.enabled) {
      this.retryPolicy = new EnhancedRetryPolicy(this.config.retry);
    }

    // Initialize Timeout Manager
    if (this.config.timeout?.enabled) {
      this.timeoutManager = new TimeoutManager({
        defaultTimeoutMs: this.config.timeout.defaultTimeoutMs
      });
    }
  }

  async executeWithContext<T>(
    operation: () => Promise<T>,
    operationName: string,
    operationType: 'read' | 'write' | 'external' | 'critical' = 'read',
    cacheKey?: string
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalExecutions++;
    this.initOperationMetrics(operationName);

    try {
      // Try cache first if enabled and cache key provided
      if (this.config.cache?.enabled && this.cache && cacheKey) {
        const cachedResult = await this.getCachedResult<T>(cacheKey, operationName);
        if (cachedResult !== null) {
          this.recordSuccess(startTime, operationName);
          return cachedResult;
        }
      }

      // Build the execution chain
      let wrappedOperation = operation;

      // Apply timeout if enabled
      if (this.config.timeout?.enabled && this.timeoutManager) {
        const timeoutMs = this.config.timeout.operationTimeouts?.[operationType] || 
                         this.config.timeout.defaultTimeoutMs;
        const timeoutOperation = wrappedOperation;
        wrappedOperation = () => this.timeoutManager!.executeWithTimeout(
          timeoutOperation,
          operationName,
          timeoutMs
        );
      }

      // Apply enhanced retry if enabled
      if (this.config.retry?.enabled && this.retryPolicy) {
        const retryOperation = wrappedOperation;
        wrappedOperation = () => this.retryPolicy!.executeWithContext(
          retryOperation,
          operationType,
          { serviceName: 'resilience-orchestrator', operationName }
        );
      }

      // Apply circuit breaker if enabled
      if (this.config.circuitBreaker?.enabled && this.circuitBreaker) {
        const circuitBreakerOperation = wrappedOperation;
        wrappedOperation = () => this.circuitBreaker!.execute(circuitBreakerOperation);
      }

      // Execute the wrapped operation
      const result = await wrappedOperation();

      // Cache the result if enabled
      await this.cacheResult(cacheKey, result, operationName);

      this.recordSuccess(startTime, operationName);
      
      logger.info(`Enhanced resilient operation '${operationName}' completed successfully`, {
        operationType,
        latency: Date.now() - startTime,
        cached: false
      });

      return result;
    } catch (error) {
      this.recordFailure(startTime, operationName);
      
      logger.error(`Enhanced resilient operation '${operationName}' failed`, {
        operationType,
        error: error instanceof Error ? error.message : String(error),
        latency: Date.now() - startTime
      });

      throw error;
    }
  }

  private async getCachedResult<T>(cacheKey: string, operationName: string): Promise<T | null> {
    try {
      const strategy = this.config.cache?.strategyByOperation?.[operationName];
      if (strategy?.priority === 'low') {
        // For low priority, allow cache misses without logging
        return await this.cache!.get<T>(cacheKey);
      }
      return await this.cache!.get<T>(cacheKey);
    } catch (error) {
      logger.warn(`Cache get failed for operation ${operationName}:`, error);
      return null;
    }
  }

  private async cacheResult<T>(cacheKey: string | undefined, result: T, operationName: string): Promise<void> {
    if (!this.config.cache?.enabled || !this.cache || !cacheKey || result === null) {
      return;
    }

    try {
      const strategy = this.config.cache.strategyByOperation?.[operationName];
      const ttl = strategy?.ttl || this.config.cache.ttl;
      
      await this.cache.set(cacheKey, result, ttl);
    } catch (error) {
      logger.warn(`Cache set failed for operation ${operationName}:`, error);
    }
  }

  private initOperationMetrics(operationName: string): void {
    if (!this.metrics.operationMetrics[operationName]) {
      this.metrics.operationMetrics[operationName] = {
        executions: 0,
        successes: 0,
        failures: 0,
        avgLatency: 0
      };
    }
    this.metrics.operationMetrics[operationName].executions++;
  }

  private recordSuccess(startTime: number, operationName: string): void {
    const latency = Date.now() - startTime;
    this.recordLatency(latency);
    this.metrics.successfulExecutions++;
    
    const opMetrics = this.metrics.operationMetrics[operationName];
    opMetrics.successes++;
    opMetrics.avgLatency = (opMetrics.avgLatency * (opMetrics.successes - 1) + latency) / opMetrics.successes;
  }

  private recordFailure(startTime: number, operationName: string): void {
    const latency = Date.now() - startTime;
    this.recordLatency(latency);
    this.metrics.failedExecutions++;
    
    this.metrics.operationMetrics[operationName].failures++;
  }

  private recordLatency(latency: number): void {
    this.latencies.push(latency);
    
    if (this.latencies.length > 1000) {
      this.latencies.shift();
    }

    this.metrics.averageLatency = 
      this.latencies.reduce((sum, l) => sum + l, 0) / this.latencies.length;
  }

  getEnhancedMetrics(): EnhancedResilienceMetrics {
    const metrics: EnhancedResilienceMetrics = { ...this.metrics };

    if (this.circuitBreaker) {
      metrics.circuitBreaker = this.circuitBreaker.getMetrics();
    }

    if (this.retryPolicy) {
      metrics.retry = this.retryPolicy.getEnhancedMetrics();
    }

    if (this.timeoutManager) {
      metrics.timeout = this.timeoutManager.getMetrics();
    }

    if (this.cache) {
      metrics.cache = this.cache.getMetrics();
    }

    return metrics;
  }

  getHealthStatus(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];

    // Circuit breaker health
    if (this.circuitBreaker) {
      const state = this.circuitBreaker.getState();
      if (state === 'OPEN') {
        issues.push(`Circuit breaker is OPEN`);
      }
    }

    // Retry health
    if (this.retryPolicy) {
      const retryMetrics = this.retryPolicy.getEnhancedMetrics();
      if (retryMetrics.contextualSuccessRate < 0.8) {
        issues.push(`Low contextual success rate: ${(retryMetrics.contextualSuccessRate * 100).toFixed(1)}%`);
      }
    }

    // Timeout health
    if (this.timeoutManager) {
      const timeoutHealth = this.timeoutManager.getHealthStatus();
      if (!timeoutHealth.healthy) {
        issues.push(timeoutHealth.reason || 'Timeout issues detected');
      }
    }

    // Overall success rate
    const successRate = this.metrics.totalExecutions > 0 
      ? this.metrics.successfulExecutions / this.metrics.totalExecutions 
      : 1;
    
    if (successRate < 0.95) {
      issues.push(`Low success rate: ${(successRate * 100).toFixed(1)}%`);
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  }

  resetMetrics(): void {
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageLatency: 0,
      operationMetrics: {}
    };
    this.latencies = [];

    if (this.retryPolicy) {
      this.retryPolicy.resetMetrics();
    }

    if (this.timeoutManager) {
      this.timeoutManager.resetMetrics();
    }
  }
}

// Factory function for enhanced resilience
export function createEnhancedResilienceOrchestrator(
  serviceName: string,
  config: Partial<EnhancedResilienceConfig> = {},
  cache?: DistributedCache
): EnhancedResilienceOrchestrator {
  const defaultConfig: EnhancedResilienceConfig = {
    circuitBreaker: {
      enabled: true,
      failureThreshold: 0.5,
      resetTimeoutMs: 60000,
      timeoutMs: 5000
    },
    retry: {
      enabled: true,
      maxAttempts: 3,
      baseDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      jitterEnabled: true,
      enableJitter: true,
      contextualRetries: true,
      operationTypes: {
        read: { maxAttempts: 3, baseDelayMs: 500, maxDelayMs: 5000 },
        write: { maxAttempts: 2, baseDelayMs: 1000, maxDelayMs: 8000 },
        external: { maxAttempts: 4, baseDelayMs: 2000, maxDelayMs: 15000 },
        critical: { maxAttempts: 5, baseDelayMs: 1500, maxDelayMs: 20000 }
      }
    },
    timeout: {
      enabled: true,
      defaultTimeoutMs: 5000,
      operationTimeouts: {
        read: 3000,
        write: 5000,
        external: 10000,
        critical: 8000
      }
    },
    cache: {
      enabled: !!cache,
      ttl: 300,
      strategyByOperation: {
        'get-recommendations': { ttl: 300, priority: 'high' },
        'get-content': { ttl: 3600, priority: 'medium' },
        'track-event': { ttl: 30, priority: 'low' }
      }
    }
  };

  const mergedConfig = { ...defaultConfig, ...config };
  return new EnhancedResilienceOrchestrator(serviceName, mergedConfig, cache);
}
