
import { Request, Response, NextFunction } from 'express';
import { standardResponse } from './apiStandards';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

// Custom error classes
export class ValidationError extends Error implements AppError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  isOperational = true;
  
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  code = 'NOT_FOUND';
  isOperational = true;
  
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements AppError {
  statusCode = 409;
  code = 'CONFLICT';
  isOperational = true;
  
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends Error implements AppError {
  statusCode = 401;
  code = 'UNAUTHORIZED';
  isOperational = true;
  
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error implements AppError {
  statusCode = 403;
  code = 'FORBIDDEN';
  isOperational = true;
  
  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class RateLimitError extends Error implements AppError {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  isOperational = true;
  
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ServiceUnavailableError extends Error implements AppError {
  statusCode = 503;
  code = 'SERVICE_UNAVAILABLE';
  isOperational = true;
  
  constructor(service: string) {
    super(`${service} service is currently unavailable`);
    this.name = 'ServiceUnavailableError';
  }
}

// Main error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error values
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = error.message || 'An unexpected error occurred';
  const isOperational = error.isOperational || false;

  // Log error details
  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  const logData = {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    statusCode,
    code,
    message,
    stack: error.stack,
    isOperational,
    userId: (req as any).user?.sub,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  };

  if (logLevel === 'error') {
    logger.error('Unhandled error occurred', logData);
  } else {
    logger.warn('Handled error occurred', logData);
  }

  // Prepare error response
  const errorResponse = {
    code,
    message: isOperational ? message : 'An internal server error occurred'
  };

  // Add error details in development
  if (process.env.NODE_ENV === 'development' && !isOperational) {
    (errorResponse as any).stack = error.stack;
    (errorResponse as any).details = error;
  }

  // Send error response
  res.status(statusCode).json(
    standardResponse.error(code, errorResponse.message, errorResponse)
  );
};

// Async error wrapper to catch async function errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.method} ${req.path}`);
  next(error);
};

// Validation error helper
export const validateRequest = (schema: any, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      const validationError = new ValidationError(
        'Request validation failed',
        error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
      );
      return next(validationError);
    }
    
    next();
  };
};

// Database error handler
export const handleDatabaseError = (error: any): AppError => {
  // PostgreSQL specific errors
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        return new ConflictError('Resource already exists');
      case '23503': // Foreign key violation
        return new ValidationError('Referenced resource does not exist');
      case '23502': // Not null violation
        return new ValidationError('Required field is missing');
      case '22001': // String data right truncation
        return new ValidationError('Data too long for field');
      default:
        break;
    }
  }

  // Return generic database error
  const dbError = new Error('Database operation failed') as AppError;
  dbError.statusCode = 500;
  dbError.code = 'DATABASE_ERROR';
  dbError.isOperational = false;
  
  return dbError;
};

// External service error handler
export const handleExternalServiceError = (serviceName: string, error: any): AppError => {
  if (error.response) {
    // HTTP error response
    const statusCode = error.response.status;
    const message = `${serviceName} service error: ${error.response.statusText}`;
    
    const serviceError = new Error(message) as AppError;
    serviceError.statusCode = statusCode >= 500 ? 503 : statusCode;
    serviceError.code = 'EXTERNAL_SERVICE_ERROR';
    serviceError.isOperational = true;
    
    return serviceError;
  }
  
  // Network or timeout error
  return new ServiceUnavailableError(serviceName);
};

// Process uncaught exceptions and rejections
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
    category: 'system',
    event: 'uncaught_exception'
  });
  
  // Give time for logs to flush, then exit
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled promise rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    category: 'system',
    event: 'unhandled_rejection'
  });
  
  // Convert to uncaught exception
  throw new Error(reason);
});
