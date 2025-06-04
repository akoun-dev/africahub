
import { SearchEngine } from '../search/SearchEngine';
import { SearchCacheService } from '../SearchCacheService';
import { SearchAnalytics } from '../search/SearchAnalytics';
import { SearchCriteria, SearchResponse, AnalyticsData, CacheMetrics } from '@/types/search';

export interface SearchOptions {
  useCache: boolean;
  trackAnalytics: boolean;
  userId?: string;
  country?: string;
}

export interface SearchResult {
  response: SearchResponse;
  cacheHit: boolean;
  analytics: AnalyticsData;
}

export class SearchManager {
  static async performSearch(
    criteria: SearchCriteria,
    page: number = 1,
    options: SearchOptions
  ): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      // 1. Vérifier le cache si activé
      let response: SearchResponse | null = null;
      let cacheHit = false;

      if (options.useCache) {
        const cacheKey = this.generateCacheKey(criteria, page);
        response = await SearchCacheService.get<SearchResponse>(cacheKey);
        
        if (response) {
          cacheHit = true;
          console.log('🎯 Cache hit for search:', criteria.query);
        }
      }

      // 2. Exécuter la recherche si pas en cache
      if (!response) {
        response = await SearchEngine.executeSearch(criteria, page);
        
        // Mettre en cache si activé
        if (options.useCache) {
          const cacheKey = this.generateCacheKey(criteria, page);
          await SearchCacheService.set(cacheKey, response, 300); // 5 minutes
        }
      }

      // 3. Analytics si activé
      const searchTime = Date.now() - startTime;
      let analytics: AnalyticsData | null = null;

      if (options.trackAnalytics) {
        const intent = SearchAnalytics.analyzeSearchIntent(criteria.query || '');
        const cacheMetrics = this.getCacheStats();
        
        analytics = {
          searchIntent: intent,
          cacheMetrics,
          performanceScore: this.calculatePerformanceScore(searchTime, cacheHit)
        };

        // Tracker la recherche
        SearchAnalytics.trackSearch({
          query: criteria.query || '',
          timestamp: Date.now(),
          responseTime: searchTime,
          resultCount: response.totalCount,
          clicked: false
        });
      }

      return {
        response,
        cacheHit,
        analytics: analytics || {
          searchIntent: SearchAnalytics.analyzeSearchIntent(criteria.query || ''),
          cacheMetrics: this.getCacheStats(),
          performanceScore: this.calculatePerformanceScore(searchTime, cacheHit)
        }
      };

    } catch (error) {
      console.error('Search Manager error:', error);
      throw error;
    }
  }

  static async trackResultClick(
    productId: string,
    query: string,
    position: number,
    userId?: string
  ): Promise<void> {
    try {
      // Mettre à jour les analytics locales
      const history = SearchAnalytics.getSearchHistory();
      const lastSearch = history.find(h => h.query === query);
      
      if (lastSearch) {
        lastSearch.clicked = true;
        lastSearch.position = position;
      }

      console.log('📊 Click tracked:', { productId, query, position, userId });
    } catch (error) {
      console.error('Click tracking error:', error);
    }
  }

  static clearCache(): void {
    SearchCacheService.clear();
    console.log('🧹 Search cache cleared');
  }

  static getCacheStats(): CacheMetrics {
    return SearchCacheService.getStats().metrics;
  }

  private static generateCacheKey(criteria: SearchCriteria, page: number): string {
    return SearchCacheService.generateCacheKey(criteria, page);
  }

  private static calculatePerformanceScore(
    searchTime: number,
    cacheHit: boolean
  ): 'excellent' | 'good' | 'average' | 'poor' {
    let score = 0;

    // Bonus pour cache hit
    if (cacheHit) score += 40;

    // Score basé sur le temps
    if (searchTime < 100) score += 40;
    else if (searchTime < 300) score += 30;
    else if (searchTime < 500) score += 20;
    else if (searchTime < 1000) score += 10;

    // Classification
    if (score >= 70) return 'excellent';
    if (score >= 50) return 'good';
    if (score >= 30) return 'average';
    return 'poor';
  }
}
