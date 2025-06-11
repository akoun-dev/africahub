
import { Request, Response } from 'express';
import { Pool } from 'pg';
import { Redis } from 'ioredis';
import { standardResponse } from '../middleware/apiStandards';
import { updateServiceHealth } from '../monitoring/metricsCollector';
import { logger } from '../utils/logger';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      time: string;
      error?: string;
      metadata?: any;
    };
  };
  uptime: number;
}

export interface HealthChecker {
  name: string;
  check: () => Promise<{ status: 'pass' | 'fail' | 'warn'; metadata?: any; error?: string }>;
  timeout?: number;
  critical?: boolean;
}

export class HealthCheckService {
  private checkers: HealthChecker[] = [];
  private serviceName: string;
  private version: string;
  private startTime: number;

  constructor(serviceName: string, version: string = '1.0.0') {
    this.serviceName = serviceName;
    this.version = version;
    this.startTime = Date.now();
  }

  // Add health checker
  addChecker(checker: HealthChecker) {
    this.checkers.push(checker);
  }

  // Database health checker
  addDatabaseChecker(pool: Pool, name: string = 'database') {
    this.addChecker({
      name,
      critical: true,
      timeout: 5000,
      check: async () => {
        try {
          const start = Date.now();
          const result = await pool.query('SELECT 1 as health_check');
          const duration = Date.now() - start;
          
          updateServiceHealth(this.serviceName, name, true);
          
          return {
            status: 'pass' as const,
            metadata: {
              query_time_ms: duration,
              connection_count: pool.totalCount,
              idle_count: pool.idleCount,
              waiting_count: pool.waitingCount
            }
          };
        } catch (error) {
          updateServiceHealth(this.serviceName, name, false);
          
          return {
            status: 'fail' as const,
            error: error instanceof Error ? error.message : 'Database connection failed'
          };
        }
      }
    });
  }

  // Redis health checker
  addRedisChecker(redis: Redis, name: string = 'redis') {
    this.addChecker({
      name,
      critical: true,
      timeout: 3000,
      check: async () => {
        try {
          const start = Date.now();
          await redis.ping();
          const duration = Date.now() - start;
          
          updateServiceHealth(this.serviceName, name, true);
          
          return {
            status: 'pass' as const,
            metadata: {
              ping_time_ms: duration,
              connection_status: redis.status
            }
          };
        } catch (error) {
          updateServiceHealth(this.serviceName, name, false);
          
          return {
            status: 'fail' as const,
            error: error instanceof Error ? error.message : 'Redis connection failed'
          };
        }
      }
    });
  }

  // External service health checker
  addExternalServiceChecker(url: string, name: string, timeout: number = 5000) {
    this.addChecker({
      name,
      critical: false,
      timeout,
      check: async () => {
        try {
          const start = Date.now();
          const response = await fetch(url, { 
            method: 'GET',
            signal: AbortSignal.timeout(timeout)
          });
          const duration = Date.now() - start;
          
          const isHealthy = response.ok;
          updateServiceHealth(this.serviceName, name, isHealthy);
          
          return {
            status: response.ok ? 'pass' as const : 'warn' as const,
            metadata: {
              status_code: response.status,
              response_time_ms: duration,
              url
            }
          };
        } catch (error) {
          updateServiceHealth(this.serviceName, name, false);
          
          return {
            status: 'fail' as const,
            error: error instanceof Error ? error.message : 'External service unreachable'
          };
        }
      }
    });
  }

  // Memory usage checker
  addMemoryChecker(thresholdMB: number = 500) {
    this.addChecker({
      name: 'memory',
      critical: false,
      check: async () => {
        const memUsage = process.memoryUsage();
        const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
        
        const status = heapUsedMB > thresholdMB ? 'warn' : 'pass';
        
        return {
          status: status as const,
          metadata: {
            heap_used_mb: Math.round(heapUsedMB),
            heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
            external_mb: Math.round(memUsage.external / 1024 / 1024),
            threshold_mb: thresholdMB
          }
        };
      }
    });
  }

  // Run all health checks
  async runChecks(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const uptime = (Date.now() - this.startTime) / 1000;
    const checks: HealthCheckResult['checks'] = {};
    
    const checkPromises = this.checkers.map(async (checker) => {
      const checkStart = Date.now();
      
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Health check timeout')), checker.timeout || 10000);
        });
        
        const result = await Promise.race([
          checker.check(),
          timeoutPromise
        ]) as any;
        
        checks[checker.name] = {
          ...result,
          time: `${Date.now() - checkStart}ms`
        };
      } catch (error) {
        checks[checker.name] = {
          status: 'fail',
          time: `${Date.now() - checkStart}ms`,
          error: error instanceof Error ? error.message : 'Check failed'
        };
      }
    });

    await Promise.all(checkPromises);

    // Determine overall status
    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    
    const criticalCheckers = this.checkers.filter(c => c.critical);
    const hasCriticalFailures = criticalCheckers.some(c => checks[c.name]?.status === 'fail');
    const hasWarnings = Object.values(checks).some(c => c.status === 'warn' || c.status === 'fail');
    
    if (hasCriticalFailures) {
      status = 'unhealthy';
    } else if (hasWarnings) {
      status = 'degraded';
    }

    return {
      status,
      timestamp,
      service: this.serviceName,
      version: this.version,
      checks,
      uptime
    };
  }

  // Express middleware for health endpoint
  getHealthMiddleware() {
    return async (req: Request, res: Response) => {
      try {
        const healthResult = await this.runChecks();
        const statusCode = healthResult.status === 'healthy' ? 200 : 
                          healthResult.status === 'degraded' ? 200 : 503;
        
        // Log health check results
        logger.info('Health check completed', {
          service: this.serviceName,
          status: healthResult.status,
          checks: Object.keys(healthResult.checks).length,
          requestId: req.requestId
        });
        
        res.status(statusCode).json(standardResponse.success(healthResult));
      } catch (error) {
        logger.error('Health check failed', {
          service: this.serviceName,
          error: error instanceof Error ? error.message : 'Unknown error',
          requestId: req.requestId
        });
        
        res.status(503).json(
          standardResponse.error(
            'HEALTH_CHECK_FAILED',
            'Unable to perform health check'
          )
        );
      }
    };
  }

  // Simple liveness probe (always returns 200 if service is running)
  getLivenessMiddleware() {
    return (req: Request, res: Response) => {
      res.status(200).json(standardResponse.success({
        status: 'alive',
        service: this.serviceName,
        timestamp: new Date().toISOString(),
        uptime: (Date.now() - this.startTime) / 1000
      }));
    };
  }

  // Readiness probe (checks if service is ready to serve requests)
  getReadinessMiddleware() {
    return async (req: Request, res: Response) => {
      try {
        const criticalCheckers = this.checkers.filter(c => c.critical);
        const criticalChecks = await Promise.all(
          criticalCheckers.map(async (checker) => {
            try {
              const result = await checker.check();
              return { name: checker.name, ...result };
            } catch (error) {
              return { 
                name: checker.name, 
                status: 'fail' as const, 
                error: error instanceof Error ? error.message : 'Check failed' 
              };
            }
          })
        );

        const isReady = criticalChecks.every(check => check.status === 'pass');
        const statusCode = isReady ? 200 : 503;

        res.status(statusCode).json(standardResponse.success({
          ready: isReady,
          service: this.serviceName,
          timestamp: new Date().toISOString(),
          critical_checks: criticalChecks
        }));
      } catch (error) {
        res.status(503).json(
          standardResponse.error(
            'READINESS_CHECK_FAILED',
            'Unable to perform readiness check'
          )
        );
      }
    };
  }
}
