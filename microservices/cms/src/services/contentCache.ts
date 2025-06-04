
import { setCache, getCache, deleteCache } from '../config/redis';
import { logger } from '../utils/logger';

export class ContentCache {
  generateCacheKey(contentKey: string, country?: string, sector?: string, language?: string): string {
    return `content:${contentKey}:${country || 'global'}:${sector || 'general'}:${language || 'en'}`;
  }

  async getFromCache(cacheKey: string): Promise<any> {
    try {
      return await getCache(cacheKey);
    } catch (error) {
      logger.error('Error getting from cache:', error);
      return null;
    }
  }

  async setToCache(cacheKey: string, content: any, ttl: number = 3600): Promise<void> {
    try {
      await setCache(cacheKey, content, ttl);
    } catch (error) {
      logger.error('Error setting cache:', error);
    }
  }

  async invalidateContentCache(contentKey: string): Promise<void> {
    try {
      await deleteCache(`content:${contentKey}:*`);
    } catch (error) {
      logger.error('Error invalidating cache:', error);
    }
  }
}
