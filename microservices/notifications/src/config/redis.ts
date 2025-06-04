
import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});
