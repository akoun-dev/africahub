
export interface OperationTypeConfig {
  read: Partial<RetryConfig>;
  write: Partial<RetryConfig>;
  external: Partial<RetryConfig>;
  critical: Partial<RetryConfig>;
}

export interface EnhancedRetryConfig extends RetryConfig {
  operationTypes?: OperationTypeConfig;
  enableJitter: boolean;
  contextualRetries: boolean;
}

export interface EnhancedRetryMetrics extends RetryMetrics {
  retriesByOperationType: Record<string, number>;
  avgRetryDelay: number;
  lastRetryTime?: Date;
  contextualSuccessRate: number;
}

export class EnhancedRetryPolicy {
  private config: EnhancedRetryConfig;
  private metrics: EnhancedRetryMetrics = {
    totalAttempts: 0,
    successfulRetries: 0,
    failedRetries: 0,
    totalDelay: 0,
    retriesByOperationType: {},
    avgRetryDelay: 0,
    contextualSuccessRate: 1.0
  };

  constructor(config: Partial<EnhancedRetryConfig> = {}) {
    this.config = {
      maxAttempts: 3,
      baseDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      jitterEnabled: true,
      enableJitter: true,
      contextualRetries: true,
      retryableErrors: ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'timeout'],
      operationTypes: {
        read: { maxAttempts: 3, baseDelayMs: 500, maxDelayMs: 5000 },
        write: { maxAttempts: 2, baseDelayMs: 1000, maxDelayMs: 8000 },
        external: { maxAttempts: 4, baseDelayMs: 2000, maxDelayMs: 15000 },
        critical: { maxAttempts: 5, baseDelayMs: 1500, maxDelayMs: 20000 }
      },
      ...config
    };
  }

  async executeWithContext<T>(
    operation: () => Promise<T>,
    operationType: 'read' | 'write' | 'external' | 'critical' = 'read',
    context?: { serviceName?: string; operationName?: string }
  ): Promise<T> {
    const effectiveConfig = this.getEffectiveConfig(operationType);
    let lastError: Error;
    let attempt = 0;
    const startTime = Date.now();

    while (attempt < effectiveConfig.maxAttempts) {
      attempt++;
      this.metrics.totalAttempts++;
      this.metrics.retriesByOperationType[operationType] = 
        (this.metrics.retriesByOperationType[operationType] || 0) + 1;

      try {
        const result = await operation();
        
        if (attempt > 1) {
          this.metrics.successfulRetries++;
          this.updateContextualSuccess(true);
        }

        this.updateMetrics(Date.now() - startTime);
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (!this.shouldRetryWithContext(error as Error, attempt, operationType, context)) {
          this.metrics.failedRetries++;
          this.updateContextualSuccess(false);
          throw error;
        }

        if (attempt < effectiveConfig.maxAttempts) {
          const delay = this.calculateContextualDelay(attempt, operationType, context);
          this.metrics.totalDelay += delay;
          this.metrics.lastRetryTime = new Date();
          await this.sleep(delay);
        }
      }
    }

    this.metrics.failedRetries++;
    this.updateContextualSuccess(false);
    throw lastError!;
  }

  private getEffectiveConfig(operationType: string): RetryConfig {
    const baseConfig = { ...this.config };
    const typeConfig = this.config.operationTypes?.[operationType as keyof OperationTypeConfig];
    
    if (typeConfig) {
      return { ...baseConfig, ...typeConfig };
    }
    
    return baseConfig;
  }

  private shouldRetryWithContext(
    error: Error, 
    attempt: number, 
    operationType: string,
    context?: { serviceName?: string; operationName?: string }
  ): boolean {
    const effectiveConfig = this.getEffectiveConfig(operationType);
    
    if (attempt >= effectiveConfig.maxAttempts) {
      return false;
    }

    // Context-aware retry decisions
    if (this.config.contextualRetries && context) {
      // Don't retry write operations on validation errors
      if (operationType === 'write' && error.message.includes('validation')) {
        return false;
      }
      
      // Be more aggressive with external service retries
      if (operationType === 'external' && this.isNetworkError(error)) {
        return true;
      }
    }

    // Standard retryable error check
    return this.config.retryableErrors?.some(retryableError => 
      error.message.includes(retryableError) || error.name === retryableError
    ) || this.isNetworkError(error);
  }

  private calculateContextualDelay(
    attempt: number, 
    operationType: string,
    context?: { serviceName?: string; operationName?: string }
  ): number {
    const effectiveConfig = this.getEffectiveConfig(operationType);
    let delay = effectiveConfig.baseDelayMs * Math.pow(effectiveConfig.backoffMultiplier, attempt - 1);
    delay = Math.min(delay, effectiveConfig.maxDelayMs);

    // Add contextual adjustments
    if (this.config.contextualRetries && context) {
      // Increase delay for external services
      if (operationType === 'external') {
        delay *= 1.5;
      }
      
      // Reduce delay for critical operations
      if (operationType === 'critical') {
        delay *= 0.8;
      }
    }

    // Add jitter to prevent thundering herd
    if (this.config.enableJitter) {
      const jitterRange = delay * 0.3; // 30% jitter
      const jitter = (Math.random() - 0.5) * jitterRange;
      delay = Math.max(100, delay + jitter); // Minimum 100ms delay
    }

    return Math.floor(delay);
  }

  private isNetworkError(error: Error): boolean {
    const networkIndicators = [
      'network', 'connection', 'timeout', 'ECONNRESET', 'ENOTFOUND', 
      'ECONNREFUSED', 'ETIMEDOUT', 'socket hang up', 'fetch failed'
    ];
    
    return networkIndicators.some(indicator => 
      error.message.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  private updateContextualSuccess(success: boolean): void {
    const alpha = 0.1; // Exponential moving average factor
    const newValue = success ? 1 : 0;
    this.metrics.contextualSuccessRate = 
      (1 - alpha) * this.metrics.contextualSuccessRate + alpha * newValue;
  }

  private updateMetrics(operationTime: number): void {
    this.metrics.avgRetryDelay = this.metrics.totalDelay / Math.max(this.metrics.totalAttempts, 1);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getEnhancedMetrics(): EnhancedRetryMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      totalAttempts: 0,
      successfulRetries: 0,
      failedRetries: 0,
      totalDelay: 0,
      retriesByOperationType: {},
      avgRetryDelay: 0,
      contextualSuccessRate: 1.0
    };
  }
}

// Enhanced decorator for context-aware retries
export function withContextualRetry<T extends any[], R>(
  operationType: 'read' | 'write' | 'external' | 'critical' = 'read',
  config: Partial<EnhancedRetryConfig> = {}
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const method = descriptor.value!;
    const retryPolicy = new EnhancedRetryPolicy(config);

    descriptor.value = async function (...args: T): Promise<R> {
      return retryPolicy.executeWithContext(
        () => method.apply(this, args),
        operationType,
        { serviceName: target.constructor.name, operationName: propertyName }
      );
    };
  };
}
