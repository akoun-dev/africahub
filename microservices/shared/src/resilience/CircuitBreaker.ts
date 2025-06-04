
export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;
  timeoutMs: number;
  resetTimeoutMs: number;
  monitoringPeriodMs: number;
}

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export interface CircuitBreakerMetrics {
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  rejectedCount: number;
  totalRequests: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private metrics: CircuitBreakerMetrics = {
    successCount: 0,
    failureCount: 0,
    timeoutCount: 0,
    rejectedCount: 0,
    totalRequests: 0
  };
  private nextAttempt: number = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.metrics.totalRequests++;

    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        this.metrics.rejectedCount++;
        throw new Error(`Circuit breaker ${this.config.name} is OPEN`);
      }
      this.state = CircuitBreakerState.HALF_OPEN;
    }

    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.metrics.timeoutCount++;
        reject(new Error(`Operation timed out after ${this.config.timeoutMs}ms`));
      }, this.config.timeoutMs);

      operation()
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private onSuccess(): void {
    this.metrics.successCount++;
    this.metrics.lastSuccessTime = new Date();
    
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.CLOSED;
      this.resetMetrics();
    }
  }

  private onFailure(): void {
    this.metrics.failureCount++;
    this.metrics.lastFailureTime = new Date();

    const failureRate = this.metrics.failureCount / Math.max(this.metrics.totalRequests, 1);
    
    if (failureRate >= this.config.failureThreshold && this.state === CircuitBreakerState.CLOSED) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttempt = Date.now() + this.config.resetTimeoutMs;
    } else if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttempt = Date.now() + this.config.resetTimeoutMs;
    }
  }

  private resetMetrics(): void {
    this.metrics = {
      successCount: 0,
      failureCount: 0,
      timeoutCount: 0,
      rejectedCount: this.metrics.rejectedCount,
      totalRequests: 0,
      lastSuccessTime: this.metrics.lastSuccessTime
    };
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  getName(): string {
    return this.config.name;
  }
}

// Circuit Breaker Registry for managing multiple instances
export class CircuitBreakerRegistry {
  private static instance: CircuitBreakerRegistry;
  private breakers: Map<string, CircuitBreaker> = new Map();

  static getInstance(): CircuitBreakerRegistry {
    if (!CircuitBreakerRegistry.instance) {
      CircuitBreakerRegistry.instance = new CircuitBreakerRegistry();
    }
    return CircuitBreakerRegistry.instance;
  }

  getOrCreate(name: string, config: Partial<CircuitBreakerConfig> = {}): CircuitBreaker {
    if (!this.breakers.has(name)) {
      const defaultConfig: CircuitBreakerConfig = {
        name,
        failureThreshold: 0.5, // 50% failure rate
        timeoutMs: 5000, // 5 seconds
        resetTimeoutMs: 60000, // 1 minute
        monitoringPeriodMs: 10000, // 10 seconds
        ...config
      };
      this.breakers.set(name, new CircuitBreaker(defaultConfig));
    }
    return this.breakers.get(name)!;
  }

  getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    this.breakers.forEach((breaker, name) => {
      metrics[name] = breaker.getMetrics();
    });
    return metrics;
  }

  getHealthStatus(): Record<string, { state: CircuitBreakerState; healthy: boolean }> {
    const status: Record<string, { state: CircuitBreakerState; healthy: boolean }> = {};
    this.breakers.forEach((breaker, name) => {
      const state = breaker.getState();
      status[name] = {
        state,
        healthy: state !== CircuitBreakerState.OPEN
      };
    });
    return status;
  }
}
