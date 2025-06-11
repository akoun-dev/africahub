
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../config/redis';
import { standardResponse } from '../../shared/src/middleware/apiStandards';
import { RateLimitError } from '../../shared/src/middleware/errorHandler';

// Create Redis store for distributed rate limiting
const store = new RedisStore({
  sendCommand: (...args: string[]) => redisClient.call(...args),
});

// General API rate limiter
export const rateLimiter = rateLimit({
  store: store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: standardResponse.error(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests from this IP, please try again later'
  ),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const error = new RateLimitError();
    res.status(429).json(
      standardResponse.error(error.code!, error.message)
    );
  }
});

// Stricter rate limiter for computation-heavy endpoints
export const strictRateLimiter = rateLimit({
  store: store,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: standardResponse.error(
    'RATE_LIMIT_EXCEEDED',
    'Too many comparison requests, please try again later'
  ),
  standardHeaders: true,
  legacyHeaders: false
});

// User-specific rate limiter (requires authentication)
export const userRateLimiter = rateLimit({
  store: store,
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per user
  keyGenerator: (req) => {
    return (req as any).user?.sub || req.ip;
  },
  message: standardResponse.error(
    'USER_RATE_LIMIT_EXCEEDED',
    'Too many requests from this user'
  ),
  standardHeaders: true,
  legacyHeaders: false
});
