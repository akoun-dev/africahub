
import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
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

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error('Redis set error:', error);
  }
}

export async function getCache(key: string): Promise<any> {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Redis delete error:', error);
  }
}
