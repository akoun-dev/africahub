
import client from 'prom-client';
import { Request, Response } from 'express';

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics for microservices
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  registers: [register]
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

export const databaseConnectionsActive = new client.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
  labelNames: ['service_name'],
  registers: [register]
});

export const redisConnectionsActive = new client.Gauge({
  name: 'redis_connections_active',
  help: 'Number of active Redis connections',
  labelNames: ['service_name'],
  registers: [register]
});

export const businessMetricsCounter = new client.Counter({
  name: 'business_events_total',
  help: 'Total number of business events',
  labelNames: ['event_type', 'service_name', 'status'],
  registers: [register]
});

export const activeUsersGauge = new client.Gauge({
  name: 'active_users_current',
  help: 'Number of currently active users',
  labelNames: ['service_name'],
  registers: [register]
});

// Middleware to collect HTTP metrics
export const metricsMiddleware = (serviceName: string) => {
  return (req: Request, res: Response, next: Function) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route?.path || req.path;
      
      httpRequestsTotal.labels(
        req.method,
        route,
        res.statusCode.toString(),
        serviceName
      ).inc();
      
      httpRequestDuration.labels(
        req.method,
        route,
        res.statusCode.toString(),
        serviceName
      ).observe(duration);
    });
    
    next();
  };
};

// Business metrics helpers
export const trackBusinessEvent = (
  eventType: string, 
  serviceName: string, 
  status: 'success' | 'failure' = 'success'
) => {
  businessMetricsCounter.labels(eventType, serviceName, status).inc();
};

export const updateActiveUsers = (count: number, serviceName: string) => {
  activeUsersGauge.labels(serviceName).set(count);
};

export const updateDatabaseConnections = (count: number, serviceName: string) => {
  databaseConnectionsActive.labels(serviceName).set(count);
};

export const updateRedisConnections = (count: number, serviceName: string) => {
  redisConnectionsActive.labels(serviceName).set(count);
};

// Get metrics for Prometheus
export const getMetrics = async (): Promise<string> => {
  return await register.metrics();
};

// Health check metrics
export const serviceHealthGauge = new client.Gauge({
  name: 'service_health_status',
  help: 'Health status of the service (1 = healthy, 0 = unhealthy)',
  labelNames: ['service_name', 'component'],
  registers: [register]
});

export const updateServiceHealth = (
  serviceName: string, 
  component: string, 
  isHealthy: boolean
) => {
  serviceHealthGauge.labels(serviceName, component).set(isHealthy ? 1 : 0);
};
