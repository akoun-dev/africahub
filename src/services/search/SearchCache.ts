
import { SearchCriteria, SearchResponse, CacheMetrics } from '@/types/search';

interface CacheEntry {
  data: SearchResponse;
  timestamp: number;
  ttl: number;
}

export class SearchCache {
  private static cache = new Map<string, CacheEntry>();
  private static metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalQueries: 0,
    averageResponseTime: 0
  };
  
  private static readonly DEFAULT_TTL = 300; // 5 minutes
  private static readonly MAX_SIZE = 1000;

  static generateKey(criteria: SearchCriteria, page: number = 1): string {
    const normalized = {
      query: criteria.query?.toLowerCase().trim() || '',
      category: criteria.category || '',
      sortBy: criteria.sortBy || 'popularity',
      sortOrder: criteria.sortOrder || 'desc',
      filters: {
        priceRange: criteria.filters.priceRange || [0, 2000000],
        brands: [...(criteria.filters.brands || [])].sort(),
        countries: [...(criteria.filters.countries || [])].sort()
      },
      page
    };
    return btoa(JSON.stringify(normalized)).replace(/[/+=]/g, '');
  }

  static async get(key: string): Promise<SearchResponse | null> {
    const startTime = Date.now();
    this.metrics.totalQueries++;

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      this.metrics.hits++;
      this.updateMetrics(Date.now() - startTime);
      return cached.data;
    }

    this.metrics.misses++;
    this.updateMetrics(Date.now() - startTime);
    return null;
  }

  static async set(key: string, data: SearchResponse, customTtl?: number): Promise<void> {
    const ttl = customTtl || this.DEFAULT_TTL;
    
    // Éviction LRU si le cache est plein
    if (this.cache.size >= this.MAX_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static clear(): void {
    this.cache.clear();
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalQueries: 0,
      averageResponseTime: 0
    };
  }

  static getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  static getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_SIZE,
      metrics: this.metrics
    };
  }

  private static updateMetrics(responseTime: number): void {
    const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.totalQueries - 1) + responseTime;
    this.metrics.averageResponseTime = totalResponseTime / this.metrics.totalQueries;
    this.metrics.hitRate = this.metrics.hits / this.metrics.totalQueries;
  }
}
