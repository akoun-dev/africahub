
export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterEnabled: boolean;
  retryableErrors?: string[];
}

export interface RetryMetrics {
  totalAttempts: number;
  successfulRetries: number;
  failedRetries: number;
  totalDelay: number;
}

export class RetryPolicy {
  private config: RetryConfig;
  private metrics: RetryMetrics = {
    totalAttempts: 0,
    successfulRetries: 0,
    failedRetries: 0,
    totalDelay: 0
  };

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: 3,
      baseDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      jitterEnabled: true,
      retryableErrors: ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'],
      ...config
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    let attempt = 0;

    while (attempt < this.config.maxAttempts) {
      attempt++;
      this.metrics.totalAttempts++;

      try {
        const result = await operation();
        if (attempt > 1) {
          this.metrics.successfulRetries++;
        }
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (!this.shouldRetry(error as Error, attempt)) {
          this.metrics.failedRetries++;
          throw error;
        }

        if (attempt < this.config.maxAttempts) {
          const delay = this.calculateDelay(attempt);
          this.metrics.totalDelay += delay;
          await this.sleep(delay);
        }
      }
    }

    this.metrics.failedRetries++;
    throw lastError!;
  }

  private shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.config.maxAttempts) {
      return false;
    }

    // Check if error type is retryable
    if (this.config.retryableErrors && this.config.retryableErrors.length > 0) {
      return this.config.retryableErrors.some(retryableError => 
        error.message.includes(retryableError) || error.name === retryableError
      );
    }

    // Default retryable conditions
    return (
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('connection') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED')
    );
  }

  private calculateDelay(attempt: number): number {
    let delay = this.config.baseDelayMs * Math.pow(this.config.backoffMultiplier, attempt - 1);
    delay = Math.min(delay, this.config.maxDelayMs);

    // Add jitter to prevent thundering herd
    if (this.config.jitterEnabled) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getMetrics(): RetryMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      totalAttempts: 0,
      successfulRetries: 0,
      failedRetries: 0,
      totalDelay: 0
    };
  }
}

// Retry decorator for easy integration
export function withRetry<T extends any[], R>(
  config: Partial<RetryConfig> = {}
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R>>
  ) {
    const method = descriptor.value!;
    const retryPolicy = new RetryPolicy(config);

    descriptor.value = async function (...args: T): Promise<R> {
      return retryPolicy.execute(() => method.apply(this, args));
    };
  };
}

// Utility function for standalone retry
export async function retry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryPolicy = new RetryPolicy(config);
  return retryPolicy.execute(operation);
}
