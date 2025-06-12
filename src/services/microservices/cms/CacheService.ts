
import { logger } from '@/utils/logger';

export class CacheService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async invalidateCache(pattern: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/cache/invalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pattern }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      logger.error('Failed to invalidate cache in CMS:', error);
      return false;
    }
  }
}
