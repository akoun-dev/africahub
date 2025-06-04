import { CircuitBreaker, CircuitBreakerRegistry } from './CircuitBreaker';
import { RetryPolicy } from './RetryPolicy';
import { TimeoutManager } from './TimeoutManager';
import { DistributedCache } from '../cache/DistributedCache';
import { logger } from '../utils/logger';

export interface ResilienceConfig {
  circuitBreaker?: {
    enabled: boolean;
    failureThreshold: number;
    resetTimeoutMs: number;
    timeoutMs: number;
  };
  retry?: {
    enabled: boolean;
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
  };
  timeout?: {
    enabled: boolean;
    defaultTimeoutMs: number;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
  };
}

export interface ResilienceMetrics {
  circuitBreaker?: any;
  retry?: any;
  timeout?: any;
  cache?: any;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageLatency: number;
}

export class ResilienceOrchestrator {
  private circuitBreaker?: CircuitBreaker;
  private retryPolicy?: RetryPolicy;
  private timeoutManager?: TimeoutManager;
  private cache?: DistributedCache;
  private config: ResilienceConfig;
  private metrics: ResilienceMetrics = {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageLatency: 0
  };
  private latencies: number[] = [];

  constructor(
    serviceName: string,
    config: ResilienceConfig,
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

    // Initialize Retry Policy
    if (this.config.retry?.enabled) {
      this.retryPolicy = new RetryPolicy(this.config.retry);
    }

    // Initialize Timeout Manager
    if (this.config.timeout?.enabled) {
      this.timeoutManager = new TimeoutManager({
        defaultTimeoutMs: this.config.timeout.defaultTimeoutMs
      });
    }
  }

  async execute<T>(
    operation: () => Promise<T>,
    operationName: string,
    cacheKey?: string
  ): Promise<T> {
    const startTime = Date.now();
    this.metrics.totalExecutions++;

    try {
      // Try cache first if enabled and cache key provided
      if (this.config.cache?.enabled && this.cache && cacheKey) {
        const cachedResult = await this.cache.get<T>(cacheKey);
        if (cachedResult !== null) {
          this.recordLatency(Date.now() - startTime);
          this.metrics.successfulExecutions++;
          return cachedResult;
        }
      }

      // Build the execution chain
      let wrappedOperation = operation;

      // Apply timeout if enabled
      if (this.config.timeout?.enabled && this.timeoutManager) {
        const timeoutOperation = wrappedOperation;
        wrappedOperation = () => this.timeoutManager!.executeWithTimeout(
          timeoutOperation,
          operationName
        );
      }

      // Apply retry if enabled
      if (this.config.retry?.enabled && this.retryPolicy) {
        const retryOperation = wrappedOperation;
        wrappedOperation = () => this.retryPolicy!.execute(retryOperation);
      }

      // Apply circuit breaker if enabled
      if (this.config.circuitBreaker?.enabled && this.circuitBreaker) {
        const circuitBreakerOperation = wrappedOperation;
        wrappedOperation = () => this.circuitBreaker!.execute(circuitBreakerOperation);
      }

      // Execute the wrapped operation
      const result = await wrappedOperation();

      // Cache the result if enabled
      if (this.config.cache?.enabled && this.cache && cacheKey && result !== null) {
        await this.cache.set(cacheKey, result, this.config.cache.ttl);
      }

      this.recordLatency(Date.now() - startTime);
      this.metrics.successfulExecutions++;
      
      logger.info(`Resilient operation '${operationName}' completed successfully`, {
        latency: Date.now() - startTime,
        cached: false
      });

      return result;
    } catch (error) {
      this.recordLatency(Date.now() - startTime);
      this.metrics.failedExecutions++;
      
      logger.error(`Resilient operation '${operationName}' failed`, {
        error: error instanceof Error ? error.message : String(error),
        latency: Date.now() - startTime
      });

      throw error;
    }
  }

  private recordLatency(latency: number): void {
    this.latencies.push(latency);
    
    // Keep only recent 1000 samples for average calculation
    if (this.latencies.length > 1000) {
      this.latencies.shift();
    }

    this.metrics.averageLatency = 
      this.latencies.reduce((sum, l) => sum + l, 0) / this.latencies.length;
  }

  getMetrics(): ResilienceMetrics {
    const metrics: ResilienceMetrics = { ...this.metrics };

    if (this.circuitBreaker) {
      metrics.circuitBreaker = this.circuitBreaker.getMetrics();
    }

    if (this.retryPolicy) {
      metrics.retry = this.retryPolicy.getMetrics();
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

    // Check circuit breaker state
    if (this.circuitBreaker) {
      const state = this.circuitBreaker.getState();
      if (state === 'OPEN') {
        issues.push(`Circuit breaker is OPEN`);
      }
    }

    // Check timeout health
    if (this.timeoutManager) {
      const timeoutHealth = this.timeoutManager.getHealthStatus();
      if (!timeoutHealth.healthy) {
        issues.push(timeoutHealth.reason || 'Timeout issues detected');
      }
    }

    // Check cache health
    if (this.cache) {
      // This would need to be implemented in DistributedCache
      // For now, we'll skip cache health check
    }

    // Check success rate
    const successRate = this.metrics.totalExecutions > 0 
      ? this.metrics.successfulExecutions / this.metrics.totalExecutions 
      : 1;
    
    if (successRate < 0.95) { // 95% success rate threshold
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
      averageLatency: 0
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

// Factory function for easy creation
export function createResilienceOrchestrator(
  serviceName: string,
  config: Partial<ResilienceConfig> = {},
  cache?: DistributedCache
): ResilienceOrchestrator {
  const defaultConfig: ResilienceConfig = {
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
      maxDelayMs: 10000
    },
    timeout: {
      enabled: true,
      defaultTimeoutMs: 5000
    },
    cache: {
      enabled: !!cache,
      ttl: 300 // 5 minutes
    }
  };

  const mergedConfig = { ...defaultConfig, ...config };
  return new ResilienceOrchestrator(serviceName, mergedConfig, cache);
}
