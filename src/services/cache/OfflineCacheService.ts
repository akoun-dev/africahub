import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiry: number;
}

export interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size in bytes
  compressionEnabled: boolean;
}

export class OfflineCacheService {
  private static instance: OfflineCacheService;
  private config: CacheConfig;
  private memoryCache: Map<string, CacheEntry> = new Map();

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 50 * 1024 * 1024, // 50MB
      compressionEnabled: true,
      ...config,
    };
  }

  static getInstance(config?: Partial<CacheConfig>): OfflineCacheService {
    if (!this.instance) {
      this.instance = new OfflineCacheService(config);
    }
    return this.instance;
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (ttl || this.config.defaultTTL),
    };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in persistent storage
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: `cache_${key}`,
        value: JSON.stringify(entry),
      });
    } else {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    }

    // Clean up expired entries
    await this.cleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.expiry > Date.now()) {
      return memoryEntry.data;
    }

    // Check persistent storage
    let storedValue: string | null = null;

    if (Capacitor.isNativePlatform()) {
      const result = await Preferences.get({ key: `cache_${key}` });
      storedValue = result.value;
    } else {
      storedValue = localStorage.getItem(`cache_${key}`);
    }

    if (!storedValue) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(storedValue);

      // Check if expired
      if (entry.expiry <= Date.now()) {
        await this.remove(key);
        return null;
      }

      // Update memory cache
      this.memoryCache.set(key, entry);
      return entry.data;
    } catch (error) {
      console.error("Error parsing cached data:", error);
      await this.remove(key);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: `cache_${key}` });
    } else {
      localStorage.removeItem(`cache_${key}`);
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (Capacitor.isNativePlatform()) {
      await Preferences.clear();
    } else {
      // Clear only cache items from localStorage
      Object.keys(localStorage)
        .filter((key) => key.startsWith("cache_"))
        .forEach((key) => localStorage.removeItem(key));
    }
  }

  async cleanup(): Promise<void> {
    const now = Date.now();

    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiry <= now) {
        this.memoryCache.delete(key);
      }
    }

    // Clean persistent storage
    if (Capacitor.isNativePlatform()) {
      const { keys } = await Preferences.keys();
      for (const key of keys) {
        if (key.startsWith("cache_")) {
          const result = await Preferences.get({ key });
          if (result.value) {
            try {
              const entry: CacheEntry = JSON.parse(result.value);
              if (entry.expiry <= now) {
                await Preferences.remove({ key });
              }
            } catch (error) {
              await Preferences.remove({ key });
            }
          }
        }
      }
    }
  }

  async getCacheSize(): Promise<number> {
    let totalSize = 0;

    if (Capacitor.isNativePlatform()) {
      const { keys } = await Storage.keys();
      for (const key of keys) {
        if (key.startsWith("cache_")) {
          const result = await Storage.get({ key });
          if (result.value) {
            totalSize += new Blob([result.value]).size;
          }
        }
      }
    } else {
      Object.keys(localStorage)
        .filter((key) => key.startsWith("cache_"))
        .forEach((key) => {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += new Blob([value]).size;
          }
        });
    }

    return totalSize;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
