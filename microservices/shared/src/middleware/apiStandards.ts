
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Standard API Response Format
export interface StandardAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Request ID middleware for tracing
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || 
                   req.headers['x-correlation-id'] || 
                   `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  req.requestId = requestId as string;
  res.setHeader('x-request-id', requestId);
  next();
};

// Standard response wrapper
export const standardResponse = {
  success: <T>(data: T, meta?: any): StandardAPIResponse<T> => ({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  }),

  error: (code: string, message: string, details?: any): StandardAPIResponse => ({
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: 'current-request-id'
    }
  })
};

// API versioning middleware
export const apiVersionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['api-version'] || req.query.version || 'v1';
  req.apiVersion = version as string;
  res.setHeader('api-version', version);
  next();
};

// Content-Type validation
export const contentTypeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      return res.status(400).json(
        standardResponse.error(
          'INVALID_CONTENT_TYPE',
          'Content-Type must be application/json'
        )
      );
    }
  }
  next();
};

// Request logging middleware
export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('API Request', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      apiVersion: string;
    }
  }
}
