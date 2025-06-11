export interface TimeoutConfig {
  defaultTimeoutMs: number;
  operationTimeouts: Record<string, number>;
  enableGracefulTimeout: boolean;
  gracefulTimeoutMs: number;
}

export interface TimeoutMetrics {
  totalOperations: number;
  timeoutOperations: number;
  averageExecutionTime: number;
  timeoutsByOperation: Record<string, number>;
}

export class TimeoutManager {
  private config: TimeoutConfig;
  private metrics: TimeoutMetrics = {
    totalOperations: 0,
    timeoutOperations: 0,
    averageExecutionTime: 0,
    timeoutsByOperation: {}
  };
  private executionTimes: number[] = [];
  private readonly maxExecutionTimesSamples = 1000;

  constructor(config: Partial<TimeoutConfig> = {}) {
    this.config = {
      defaultTimeoutMs: 5000,
      operationTimeouts: {},
      enableGracefulTimeout: true,
      gracefulTimeoutMs: 1000,
      ...config
    };
  }

  async executeWithTimeout<T>(
    operation: () => Promise<T>,
    operationName?: string,
    customTimeoutMs?: number
  ): Promise<T> {
    const timeoutMs = customTimeoutMs || 
                     (operationName ? this.config.operationTimeouts[operationName] : undefined) || 
                     this.config.defaultTimeoutMs;

    const startTime = Date.now();
    this.metrics.totalOperations++;

    let timeoutHandle: NodeJS.Timeout;
    let operationPromise: Promise<T>;
    let isCompleted = false;

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          if (!isCompleted) {
            this.metrics.timeoutOperations++;
            if (operationName) {
              this.metrics.timeoutsByOperation[operationName] = 
                (this.metrics.timeoutsByOperation[operationName] || 0) + 1;
            }
            reject(new Error(`Operation${operationName ? ` '${operationName}'` : ''} timed out after ${timeoutMs}ms`));
          }
        }, timeoutMs);
      });

      // Create operation promise with graceful timeout handling
      operationPromise = this.config.enableGracefulTimeout 
        ? this.wrapWithGracefulTimeout(operation, timeoutMs)
        : operation();

      // Race between operation and timeout
      const result = await Promise.race([operationPromise, timeoutPromise]);
      
      isCompleted = true;
      clearTimeout(timeoutHandle!);

      // Record execution time
      const executionTime = Date.now() - startTime;
      this.recordExecutionTime(executionTime);

      return result;
    } catch (error) {
      isCompleted = true;
      if (timeoutHandle!) {
        clearTimeout(timeoutHandle);
      }

      // Record execution time even for failed operations
      const executionTime = Date.now() - startTime;
      this.recordExecutionTime(executionTime);

      throw error;
    }
  }

  private async wrapWithGracefulTimeout<T>(
    operation: () => Promise<T>,
    totalTimeoutMs: number
  ): Promise<T> {
    const gracefulTimeoutMs = Math.min(this.config.gracefulTimeoutMs, totalTimeoutMs * 0.8);
    const hardTimeoutMs = totalTimeoutMs - gracefulTimeoutMs;

    let gracefulTimeoutHandle: NodeJS.Timeout;
    let isGracefulTimeoutTriggered = false;

    // Set up graceful timeout warning
    gracefulTimeoutHandle = setTimeout(() => {
      isGracefulTimeoutTriggered = true;
      console.warn(`Operation approaching timeout (${gracefulTimeoutMs}ms elapsed), prepare for termination in ${hardTimeoutMs}ms`);
    }, gracefulTimeoutMs);

    try {
      const result = await operation();
      clearTimeout(gracefulTimeoutHandle);
      return result;
    } catch (error) {
      clearTimeout(gracefulTimeoutHandle);
      throw error;
    }
  }

  private recordExecutionTime(executionTime: number): void {
    this.executionTimes.push(executionTime);
    
    // Keep only recent samples for average calculation
    if (this.executionTimes.length > this.maxExecutionTimesSamples) {
      this.executionTimes.shift();
    }

    // Update average execution time
    this.metrics.averageExecutionTime = 
      this.executionTimes.reduce((sum, time) => sum + time, 0) / this.executionTimes.length;
  }

  setOperationTimeout(operationName: string, timeoutMs: number): void {
    this.config.operationTimeouts[operationName] = timeoutMs;
  }

  getOperationTimeout(operationName: string): number {
    return this.config.operationTimeouts[operationName] || this.config.defaultTimeoutMs;
  }

  getMetrics(): TimeoutMetrics {
    return { ...this.metrics };
  }

  getTimeoutRate(): number {
    return this.metrics.totalOperations > 0 
      ? this.metrics.timeoutOperations / this.metrics.totalOperations 
      : 0;
  }

  resetMetrics(): void {
    this.metrics = {
      totalOperations: 0,
      timeoutOperations: 0,
      averageExecutionTime: 0,
      timeoutsByOperation: {}
    };
    this.executionTimes = [];
  }

  // Health check based on timeout rates
  getHealthStatus(): { healthy: boolean; reason?: string } {
    const timeoutRate = this.getTimeoutRate();
    const healthyThreshold = 0.1; // 10% timeout rate threshold

    if (timeoutRate > healthyThreshold) {
      return {
        healthy: false,
        reason: `High timeout rate: ${(timeoutRate * 100).toFixed(1)}%`
      };
    }

    return { healthy: true };
  }
}

// Timeout decorator
export function withTimeout(timeoutMs: number, operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const timeoutManager = new TimeoutManager();

    descriptor.value = async function (...args: any[]) {
      return timeoutManager.executeWithTimeout(
        () => originalMethod.apply(this, args),
        operationName || `${target.constructor.name}.${propertyName}`,
        timeoutMs
      );
    };
  };
}

// Utility function for standalone timeout
export async function executeWithTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  operationName?: string
): Promise<T> {
  const timeoutManager = new TimeoutManager();
  return timeoutManager.executeWithTimeout(operation, operationName, timeoutMs);
}
