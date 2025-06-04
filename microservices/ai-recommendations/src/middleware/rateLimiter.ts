
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

const RATE_LIMIT_WINDOW = 3600; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 1000; // Max requests per window

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `rate_limit:${clientIp}`;
    
    const current = await redisClient.incr(key);
    
    if (current === 1) {
      await redisClient.expire(key, RATE_LIMIT_WINDOW);
    }
    
    if (current > RATE_LIMIT_MAX_REQUESTS) {
      logger.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
      'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT_MAX_REQUESTS - current).toString(),
      'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW * 1000).toISOString()
    });
    
    next();
  } catch (error) {
    logger.error('Rate limiter error:', error);
    next(); // Continue on Redis errors
  }
}
