
import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

export interface CacheConfig {
  redis: {
    url: string;
    retryDelayOnFailover?: number;
    maxRetriesPerRequest?: number;
  };
  defaultTTL: number;
  keyPrefix: string;
  compression: boolean;
  serialization: 'json' | 'msgpack';
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  totalOperations: number;
  hitRate: number;
}

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

export class DistributedCache {
  private redis: RedisClientType;
  private config: CacheConfig;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
    totalOperations: 0,
    hitRate: 0
  };
  private localCache: Map<string, { value: any; expiry: number }> = new Map();
  private readonly localCacheSize = 1000; // Maximum local cache entries

  constructor(config: CacheConfig) {
    this.config = config;
    this.redis = createClient({
      url: config.redis.url,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    });

    this.setupRedisHandlers();
  }

  private setupRedisHandlers(): void {
    this.redis.on('error', (err) => {
      logger.error('Redis Cache Error:', err);
      this.metrics.errors++;
    });

    this.redis.on('connect', () => {
      logger.info('Redis Cache Connected');
    });

    this.redis.on('ready', () => {
      logger.info('Redis Cache Ready');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.redis.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.redis.disconnect();
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
    }
  }

  private buildKey(key: string): string {
    return `${this.config.keyPrefix}:${key}`;
  }

  private serialize(value: any): string {
    const entry: CacheEntry = {
      value,
      timestamp: Date.now(),
      ttl: this.config.defaultTTL
    };

    if (this.config.serialization === 'json') {
      return JSON.stringify(entry);
    }
    // For future msgpack implementation
    return JSON.stringify(entry);
  }

  private deserialize<T>(data: string): T | null {
    try {
      const entry: CacheEntry<T> = JSON.parse(data);
      
      // Check if entry has expired
      if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl * 1000) {
        return null;
      }
      
      return entry.value;
    } catch (error) {
      logger.error('Cache deserialization error:', error);
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    this.metrics.totalOperations++;
    const cacheKey = this.buildKey(key);

    try {
      // Try local cache first
      const localEntry = this.localCache.get(cacheKey);
      if (localEntry && localEntry.expiry > Date.now()) {
        this.metrics.hits++;
        this.updateHitRate();
        return localEntry.value;
      }

      // Try Redis cache
      const data = await this.redis.get(cacheKey);
      if (data) {
        const value = this.deserialize<T>(data);
        if (value !== null) {
          // Update local cache
          this.setLocalCache(cacheKey, value, this.config.defaultTTL);
          this.metrics.hits++;
          this.updateHitRate();
          return value;
        }
      }

      this.metrics.misses++;
      this.updateHitRate();
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      this.metrics.errors++;
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    this.metrics.totalOperations++;
    this.metrics.sets++;
    
    const cacheKey = this.buildKey(key);
    const actualTTL = ttl || this.config.defaultTTL;

    try {
      const serializedValue = this.serialize(value);
      
      // Set in Redis with TTL
      if (actualTTL > 0) {
        await this.redis.setEx(cacheKey, actualTTL, serializedValue);
      } else {
        await this.redis.set(cacheKey, serializedValue);
      }

      // Update local cache
      this.setLocalCache(cacheKey, value, actualTTL);
      
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      this.metrics.errors++;
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    this.metrics.totalOperations++;
    this.metrics.deletes++;
    
    const cacheKey = this.buildKey(key);

    try {
      // Delete from Redis
      await this.redis.del(cacheKey);
      
      // Delete from local cache
      this.localCache.delete(cacheKey);
      
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      this.metrics.errors++;
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    this.metrics.totalOperations++;
    
    try {
      const searchPattern = this.buildKey(pattern);
      const keys = await this.redis.keys(searchPattern);
      
      if (keys.length > 0) {
        await this.redis.del(keys);
        
        // Clear matching keys from local cache
        for (const key of keys) {
          this.localCache.delete(key);
        }
      }
      
      return keys.length;
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
      this.metrics.errors++;
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    this.metrics.totalOperations++;
    const cacheKey = this.buildKey(key);

    try {
      // Check local cache first
      if (this.localCache.has(cacheKey)) {
        const entry = this.localCache.get(cacheKey)!;
        if (entry.expiry > Date.now()) {
          return true;
        }
        this.localCache.delete(cacheKey);
      }

      // Check Redis
      const exists = await this.redis.exists(cacheKey);
      return exists === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      this.metrics.errors++;
      return false;
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    this.metrics.totalOperations += keys.length;
    const cacheKeys = keys.map(key => this.buildKey(key));

    try {
      const values = await this.redis.mGet(cacheKeys);
      const results: (T | null)[] = [];

      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          const value = this.deserialize<T>(values[i]!);
          results.push(value);
          if (value !== null) {
            this.metrics.hits++;
            // Update local cache
            this.setLocalCache(cacheKeys[i], value, this.config.defaultTTL);
          } else {
            this.metrics.misses++;
          }
        } else {
          results.push(null);
          this.metrics.misses++;
        }
      }

      this.updateHitRate();
      return results;
    } catch (error) {
      logger.error('Cache mget error:', error);
      this.metrics.errors++;
      return keys.map(() => null);
    }
  }

  private setLocalCache(key: string, value: any, ttl: number): void {
    // Evict oldest entries if cache is full
    if (this.localCache.size >= this.localCacheSize) {
      const firstKey = this.localCache.keys().next().value;
      this.localCache.delete(firstKey);
    }

    const expiry = ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + (3600 * 1000);
    this.localCache.set(key, { value, expiry });
  }

  private updateHitRate(): void {
    const totalHitsMisses = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = totalHitsMisses > 0 ? this.metrics.hits / totalHitsMisses : 0;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  async flush(): Promise<void> {
    try {
      await this.redis.flushDb();
      this.localCache.clear();
    } catch (error) {
      logger.error('Cache flush error:', error);
      this.metrics.errors++;
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; latency: number }> {
    const start = Date.now();
    try {
      await this.redis.ping();
      return {
        status: 'healthy',
        latency: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start
      };
    }
  }
}

// Cache decorator for methods
export function cached(ttl: number = 3600, keyGenerator?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new DistributedCache({
      redis: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
      defaultTTL: ttl,
      keyPrefix: `cache:${target.constructor.name}:${propertyName}`,
      compression: false,
      serialization: 'json'
    });

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      // Try to get from cache
      const cachedResult = await cache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);
      
      // Cache the result
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}
