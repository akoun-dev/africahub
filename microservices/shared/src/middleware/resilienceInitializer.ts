
import { logger } from '../utils/logger';

export interface ResilienceService {
  initialize(): Promise<void>;
  getHealthStatus(): { healthy: boolean; issues: string[] };
  getMetrics(): any;
}

export class ResilienceInitializer {
  private static services: Map<string, ResilienceService> = new Map();

  static registerService(name: string, service: ResilienceService): void {
    this.services.set(name, service);
    logger.info(`Resilience service registered: ${name}`);
  }

  static async initializeAll(): Promise<void> {
    logger.info('Initializing all resilience services...');
    
    const initPromises = Array.from(this.services.entries()).map(
      async ([name, service]) => {
        try {
          await service.initialize();
          logger.info(`✓ ${name} resilience service initialized`);
        } catch (error) {
          logger.error(`✗ Failed to initialize ${name} resilience service:`, error);
          throw error;
        }
      }
    );

    await Promise.all(initPromises);
    logger.info('All resilience services initialized successfully');
  }

  static getGlobalHealth(): {
    healthy: boolean;
    services: Record<string, { healthy: boolean; issues: string[] }>;
  } {
    const serviceHealth: Record<string, { healthy: boolean; issues: string[] }> = {};
    let globalHealthy = true;

    this.services.forEach((service, name) => {
      const health = service.getHealthStatus();
      serviceHealth[name] = health;
      if (!health.healthy) {
        globalHealthy = false;
      }
    });

    return {
      healthy: globalHealthy,
      services: serviceHealth
    };
  }

  static getGlobalMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};
    
    this.services.forEach((service, name) => {
      metrics[name] = service.getMetrics();
    });

    return metrics;
  }
}

// Express middleware for resilience health monitoring
export const resilienceHealthMiddleware = (req: any, res: any, next: any) => {
  if (req.path === '/health/resilience') {
    const health = ResilienceInitializer.getGlobalHealth();
    const metrics = ResilienceInitializer.getGlobalMetrics();

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      health,
      metrics
    });
  }
  next();
};
