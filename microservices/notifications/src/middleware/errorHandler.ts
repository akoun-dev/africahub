
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
  error: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  logger.error('Unhandled error:', error);

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(isDevelopment && { details: error.message, stack: error.stack })
  });
}
