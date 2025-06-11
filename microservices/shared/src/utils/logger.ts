
import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston about our custom colors
winston.addColors(colors);

// Define format for development
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${
      Object.keys(info).length > 3 ? ` ${JSON.stringify(
        Object.fromEntries(
          Object.entries(info).filter(([key]) => !['timestamp', 'level', 'message'].includes(key))
        ),
        null,
        2
      )}` : ''
    }`
  )
);

// Define format for production (structured JSON)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Determine current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  levels,
  format: isProduction ? prodFormat : devFormat,
  defaultMeta: { 
    service: process.env.SERVICE_NAME || 'microservice',
    version: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport (always enabled)
    new winston.transports.Console({
      stderrLevels: ['error']
    }),
    
    // File transports for production
    ...(isProduction ? [
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
        tailable: true
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
        tailable: true
      })
    ] : [])
  ],
  
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.Console(),
    ...(isProduction ? [
      new winston.transports.File({ filename: 'logs/exceptions.log' })
    ] : [])
  ],
  
  rejectionHandlers: [
    new winston.transports.Console(),
    ...(isProduction ? [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ] : [])
  ]
});

// Add request correlation ID to logs when available
export const addRequestContext = (requestId: string) => {
  return logger.child({ requestId });
};

// Structured logging helpers
export const loggers = {
  // Security events
  security: {
    authFailure: (userId: string, reason: string, metadata?: any) => {
      logger.warn('Authentication failure', {
        userId,
        reason,
        ...metadata,
        category: 'security',
        event: 'auth_failure'
      });
    },
    
    authSuccess: (userId: string, metadata?: any) => {
      logger.info('Authentication success', {
        userId,
        ...metadata,
        category: 'security',
        event: 'auth_success'
      });
    },
    
    accessDenied: (userId: string, resource: string, action: string, metadata?: any) => {
      logger.warn('Access denied', {
        userId,
        resource,
        action,
        ...metadata,
        category: 'security',
        event: 'access_denied'
      });
    }
  },

  // Business events
  business: {
    userAction: (userId: string, action: string, metadata?: any) => {
      logger.info('User action', {
        userId,
        action,
        ...metadata,
        category: 'business',
        event: 'user_action'
      });
    },
    
    transactionStarted: (transactionId: string, userId: string, type: string, metadata?: any) => {
      logger.info('Transaction started', {
        transactionId,
        userId,
        type,
        ...metadata,
        category: 'business',
        event: 'transaction_start'
      });
    },
    
    transactionCompleted: (transactionId: string, userId: string, status: string, metadata?: any) => {
      logger.info('Transaction completed', {
        transactionId,
        userId,
        status,
        ...metadata,
        category: 'business',
        event: 'transaction_complete'
      });
    }
  },

  // Performance monitoring
  performance: {
    slowQuery: (query: string, duration: number, metadata?: any) => {
      logger.warn('Slow database query', {
        query,
        duration,
        ...metadata,
        category: 'performance',
        event: 'slow_query'
      });
    },
    
    apiResponse: (endpoint: string, method: string, statusCode: number, duration: number, metadata?: any) => {
      logger.info('API response', {
        endpoint,
        method,
        statusCode,
        duration,
        ...metadata,
        category: 'performance',
        event: 'api_response'
      });
    }
  },

  // System monitoring
  system: {
    serviceStarted: (serviceName: string, version: string, metadata?: any) => {
      logger.info('Service started', {
        serviceName,
        version,
        ...metadata,
        category: 'system',
        event: 'service_start'
      });
    },
    
    serviceStopped: (serviceName: string, metadata?: any) => {
      logger.info('Service stopped', {
        serviceName,
        ...metadata,
        category: 'system',
        event: 'service_stop'
      });
    },
    
    healthCheckFailed: (serviceName: string, component: string, error: string, metadata?: any) => {
      logger.error('Health check failed', {
        serviceName,
        component,
        error,
        ...metadata,
        category: 'system',
        event: 'health_check_failed'
      });
    }
  }
};

// Export default logger
export default logger;
