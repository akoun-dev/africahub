
import { SearchResult, SearchCriteria, SearchResponse } from './SearchService';

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalQueries: number;
  averageResponseTime: number;
}

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum cache entries
  compressionEnabled: boolean;
  preloadPopularQueries: boolean;
}

export class SearchCacheService {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalQueries: 0,
    averageResponseTime: 0
  };
  
  private static config: CacheConfig = {
    ttl: 300, // 5 minutes
    maxSize: 1000,
    compressionEnabled: true,
    preloadPopularQueries: true
  };

  // Génération de clés de cache intelligentes
  static generateCacheKey(criteria: SearchCriteria, page: number = 1): string {
    const normalizedCriteria = {
      query: criteria.query?.toLowerCase().trim() || '',
      category: criteria.category || '',
      sortBy: criteria.sortBy || 'popularity',
      sortOrder: criteria.sortOrder || 'desc',
      filters: {
        priceRange: criteria.filters.priceRange || [0, 2000000],
        rating: criteria.filters.rating || 0,
        location: criteria.filters.location || '',
        brands: [...(criteria.filters.brands || [])].sort(),
        sectors: [...(criteria.filters.sectors || [])].sort(),
        countries: [...(criteria.filters.countries || [])].sort()
      },
      page
    };

    return btoa(JSON.stringify(normalizedCriteria)).replace(/[/+=]/g, '');
  }

  // Récupération depuis le cache
  static async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    this.metrics.totalQueries++;

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      this.metrics.hits++;
      this.updateMetrics(Date.now() - startTime);
      
      console.log(`Cache HIT for key: ${key.substring(0, 20)}...`);
      return this.decompress(cached.data);
    }

    this.metrics.misses++;
    this.updateMetrics(Date.now() - startTime);
    console.log(`Cache MISS for key: ${key.substring(0, 20)}...`);
    return null;
  }

  // Mise en cache
  static async set<T>(key: string, data: T, customTtl?: number): Promise<void> {
    const ttl = customTtl || this.config.ttl;
    
    // Éviction LRU si le cache est plein
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const compressedData = this.config.compressionEnabled ? this.compress(data) : data;
    
    this.cache.set(key, {
      data: compressedData,
      timestamp: Date.now(),
      ttl
    });

    console.log(`Cached data for key: ${key.substring(0, 20)}... (TTL: ${ttl}s)`);
  }

  // Invalidation intelligente du cache
  static invalidatePattern(pattern: string): number {
    let invalidated = 0;
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      invalidated++;
    });

    console.log(`Invalidated ${invalidated} cache entries matching pattern: ${pattern}`);
    return invalidated;
  }

  // Invalidation par secteur/catégorie
  static invalidateByCategory(category: string): number {
    return this.invalidatePattern(btoa(JSON.stringify({ category })));
  }

  // Invalidation par pays
  static invalidateByCountry(country: string): number {
    return this.invalidatePattern(country);
  }

  // Préchargement des requêtes populaires
  static async preloadPopularQueries(popularQueries: SearchCriteria[]): Promise<void> {
    if (!this.config.preloadPopularQueries) return;

    console.log(`Preloading ${popularQueries.length} popular queries...`);
    
    // Simuler le préchargement (en production, ceci ferait des vraies requêtes)
    for (const criteria of popularQueries.slice(0, 10)) {
      const key = this.generateCacheKey(criteria);
      if (!this.cache.has(key)) {
        // En production, on ferait une vraie requête vers SearchService
        const mockResponse: SearchResponse = {
          results: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          searchTime: 50,
          suggestions: [],
          facets: { brands: [], sectors: [], priceRanges: [], locations: [] }
        };
        
        await this.set(key, mockResponse, this.config.ttl * 2); // TTL double pour les populaires
      }
    }
  }

  // Compression simple (en production, utiliser une vraie lib de compression)
  private static compress(data: any): string {
    return JSON.stringify(data);
  }

  private static decompress(compressedData: string): any {
    return JSON.parse(compressedData);
  }

  // Mise à jour des métriques
  private static updateMetrics(responseTime: number): void {
    const totalResponseTime = this.metrics.averageResponseTime * (this.metrics.totalQueries - 1) + responseTime;
    this.metrics.averageResponseTime = totalResponseTime / this.metrics.totalQueries;
    this.metrics.hitRate = this.metrics.hits / this.metrics.totalQueries;
  }

  // Obtenir les métriques
  static getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  // Nettoyer le cache expiré
  static cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl * 1000) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    console.log(`Cleaned ${cleaned} expired cache entries`);
    return cleaned;
  }

  // Vider tout le cache
  static clear(): void {
    this.cache.clear();
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalQueries: 0,
      averageResponseTime: 0
    };
    console.log('Cache cleared');
  }

  // Configuration du cache
  static configure(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Cache configured:', this.config);
  }

  // Obtenir les statistiques du cache
  static getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      metrics: this.metrics,
      config: this.config
    };
  }
}

// Nettoyage automatique toutes les 5 minutes
setInterval(() => {
  SearchCacheService.cleanup();
}, 5 * 60 * 1000);
