import { Request, Response, NextFunction } from 'express';
import { logger } from '../../shared/src/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log incoming request
  logger.info('Incoming request', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: (req as any).user?.sub
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]('Request completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: (req as any).user?.sub
    });
  });
  
  next();
};
