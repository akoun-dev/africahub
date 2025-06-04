
import { CacheStats, CacheEntry } from '@/hooks/useLLMCache';

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheEntry>();
  private stats = {
    totalRequests: 0,
    hits: 0,
    totalSavings: 0
  };

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get(key: string): Promise<CacheEntry | null> {
    this.stats.totalRequests++;
    const entry = this.cache.get(key);
    
    if (entry) {
      this.stats.hits++;
      this.stats.totalSavings += entry.cost_saved;
    }
    
    return entry || null;
  }

  async set(key: string, content: string, provider: string, cost: number): Promise<void> {
    this.cache.set(key, {
      response_content: content,
      provider_used: provider,
      cost_saved: cost
    });
  }

  getStats(): CacheStats {
    const hitRate = this.stats.totalRequests > 0 
      ? this.stats.hits / this.stats.totalRequests 
      : 0;

    return {
      totalEntries: this.cache.size,
      hitRate: parseFloat((hitRate * 100).toFixed(2)),
      totalSavings: parseFloat(this.stats.totalSavings.toFixed(2)),
      totalHits: this.stats.hits
    };
  }

  clear(): void {
    this.cache.clear();
    this.stats = { totalRequests: 0, hits: 0, totalSavings: 0 };
  }
}
