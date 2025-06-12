
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientId = req.ip || 'unknown';
  const key = `rate_limit:${clientId}`;

  try {
    const current = await redisClient.incr(key);
    
    if (current === 1) {
      await redisClient.expire(key, RATE_LIMIT_WINDOW);
    }

    if (current > RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded'
      });
    }

    next();
  } catch (error) {
    // If Redis is down, allow the request
    next();
  }
}
