
import { SearchService, SearchCriteria, SearchResult, SearchResponse } from './SearchService';
import { SearchCacheService } from './SearchCacheService';
import { SearchAnalyticsService } from './SearchAnalyticsService';
import { GeoSearchService, LocationData } from './GeoSearchService';
import { IntelligentSuggestionsService } from './IntelligentSuggestionsService';
import { SimilaritySearchService } from './SimilaritySearchService';

export interface OptimizedSearchOptions {
  useCache: boolean;
  trackAnalytics: boolean;
  geoFiltering: boolean;
  intelligentSuggestions: boolean;
  similarityBoost: boolean;
  preloadSimilar: boolean;
  compressionLevel: 'none' | 'low' | 'high';
  cacheTTL?: number;
}

export interface SearchPerformanceMetrics {
  searchTime: number;
  cacheHit: boolean;
  resultsCount: number;
  optimizationsApplied: string[];
  performanceScore: 'excellent' | 'good' | 'average' | 'poor';
  suggestions: string[];
}

export class OptimizedSearchService {
  private static defaultOptions: OptimizedSearchOptions = {
    useCache: true,
    trackAnalytics: true,
    geoFiltering: true,
    intelligentSuggestions: true,
    similarityBoost: true,
    preloadSimilar: false,
    compressionLevel: 'low',
    cacheTTL: 300 // 5 minutes
  };

  // Recherche ultra-optimisée avec toutes les fonctionnalités
  static async search(
    criteria: SearchCriteria,
    page: number = 1,
    userLocation?: LocationData,
    userId?: string,
    options: Partial<OptimizedSearchOptions> = {}
  ): Promise<{
    response: SearchResponse;
    metrics: SearchPerformanceMetrics;
  }> {
    const startTime = Date.now();
    const opts = { ...this.defaultOptions, ...options };
    const optimizationsApplied: string[] = [];
    let cacheHit = false;

    try {
      // 1. Vérifier le cache en premier
      let response: SearchResponse | null = null;
      
      if (opts.useCache) {
        const cacheKey = SearchCacheService.generateCacheKey(criteria, page);
        response = await SearchCacheService.get<SearchResponse>(cacheKey);
        
        if (response) {
          cacheHit = true;
          optimizationsApplied.push('cache-hit');
          console.log('🎯 Résultats depuis le cache');
        }
      }

      // 2. Si pas de cache, effectuer la recherche
      if (!response) {
        response = await SearchService.search(criteria, page);
        
        // Mettre en cache pour les prochaines fois
        if (opts.useCache) {
          const cacheKey = SearchCacheService.generateCacheKey(criteria, page);
          await SearchCacheService.set(cacheKey, response, opts.cacheTTL);
          optimizationsApplied.push('cache-store');
        }
      }

      // 3. Appliquer les filtres géographiques
      if (opts.geoFiltering && userLocation) {
        const localizedResults = GeoSearchService.filterByProximity(
          response.results,
          userLocation
        );
        response.results = GeoSearchService.prioritizeLocalResults(
          localizedResults,
          userLocation
        );
        optimizationsApplied.push('geo-filtering');
      }

      // 4. Boost de similarité
      if (opts.similarityBoost && response.results.length > 0) {
        const enhancedResults = await this.applySimilarityBoost(
          response.results,
          criteria,
          userLocation?.country
        );
        response.results = enhancedResults;
        optimizationsApplied.push('similarity-boost');
      }

      // 5. Suggestions intelligentes
      let intelligentSuggestions: string[] = [];
      if (opts.intelligentSuggestions) {
        intelligentSuggestions = await IntelligentSuggestionsService.generateSmartSuggestions(
          criteria.query || '',
          userId,
          criteria.category,
          5
        ).then(suggestions => suggestions.map(s => s.text));
        optimizationsApplied.push('intelligent-suggestions');
      }

      // 6. Préchargement des produits similaires
      if (opts.preloadSimilar && response.results.length > 0) {
        // Précharger en arrière-plan les produits similaires au premier résultat
        this.preloadSimilarProducts(response.results[0].id, userLocation?.country);
        optimizationsApplied.push('preload-similar');
      }

      // 7. Analytics et tracking
      if (opts.trackAnalytics) {
        const searchTime = Date.now() - startTime;
        await SearchAnalyticsService.trackSearch(
          criteria,
          response.totalCount,
          searchTime,
          userId,
          userLocation?.country
        );
        optimizationsApplied.push('analytics-tracking');
      }

      // 8. Calculer les métriques de performance
      const searchTime = Date.now() - startTime;
      const performanceScore = this.calculatePerformanceScore(searchTime, cacheHit, response.totalCount);

      const metrics: SearchPerformanceMetrics = {
        searchTime,
        cacheHit,
        resultsCount: response.totalCount,
        optimizationsApplied,
        performanceScore,
        suggestions: intelligentSuggestions
      };

      console.log(`🚀 Recherche optimisée terminée en ${searchTime}ms`, {
        cacheHit,
        optimizations: optimizationsApplied,
        performance: performanceScore
      });

      return { response, metrics };

    } catch (error) {
      console.error('Optimized search error:', error);
      throw error;
    }
  }

  // Recherche avec auto-complétion en temps réel
  static async searchWithAutoComplete(
    query: string,
    userLocation?: LocationData,
    userId?: string
  ): Promise<{
    results: SearchResult[];
    suggestions: string[];
    autoCompleted: boolean;
  }> {
    try {
      // Générer des suggestions intelligentes
      const suggestions = await IntelligentSuggestionsService.generateSmartSuggestions(
        query,
        userId,
        undefined,
        8
      );

      // Si la requête est courte, utiliser la première suggestion
      let finalQuery = query;
      let autoCompleted = false;

      if (query.length >= 2 && query.length <= 4 && suggestions.length > 0) {
        const bestSuggestion = suggestions.find(s => s.confidence > 0.8);
        if (bestSuggestion) {
          finalQuery = bestSuggestion.text;
          autoCompleted = true;
        }
      }

      // Effectuer la recherche optimisée
      const criteria: SearchCriteria = {
        query: finalQuery,
        category: '',
        sortBy: 'popularity',
        sortOrder: 'desc',
        filters: {
          priceRange: [0, 2000000],
          rating: 0,
          location: '',
          availability: '',
          brands: [],
          features: [],
          warranty: '',
          deliveryTime: '',
          sectors: [],
          countries: userLocation ? [userLocation.country] : []
        }
      };

      const { response } = await this.search(criteria, 1, userLocation, userId, {
        useCache: true,
        trackAnalytics: autoCompleted, // Ne tracker que si auto-complété
        geoFiltering: true,
        intelligentSuggestions: false // Déjà fait
      });

      return {
        results: response.results,
        suggestions: suggestions.map(s => s.text),
        autoCompleted
      };

    } catch (error) {
      console.error('Auto-complete search error:', error);
      return {
        results: [],
        suggestions: [],
        autoCompleted: false
      };
    }
  }

  // Recherche contextuelle basée sur l'historique
  static async searchWithContext(
    criteria: SearchCriteria,
    userLocation?: LocationData,
    userId?: string,
    userHistory?: string[]
  ): Promise<SearchResponse> {
    try {
      // Analyser l'historique pour adapter les résultats
      if (userHistory && userHistory.length > 0) {
        const contextualBoosts = this.analyzeUserContext(userHistory);
        
        // Adapter les critères selon le contexte
        criteria = this.applyCriteriaBoosts(criteria, contextualBoosts);
      }

      // Effectuer la recherche optimisée
      const { response } = await this.search(criteria, 1, userLocation, userId, {
        useCache: true,
        trackAnalytics: true,
        geoFiltering: true,
        intelligentSuggestions: true,
        similarityBoost: true
      });

      return response;

    } catch (error) {
      console.error('Contextual search error:', error);
      throw error;
    }
  }

  // Recherche bulk pour préchargement
  static async bulkSearch(
    queries: SearchCriteria[],
    userLocation?: LocationData,
    userId?: string
  ): Promise<Map<string, SearchResponse>> {
    const results = new Map<string, SearchResponse>();
    
    try {
      // Traiter les requêtes en parallèle par batches
      const batchSize = 5;
      const batches = this.chunkArray(queries, batchSize);

      for (const batch of batches) {
        const batchPromises = batch.map(async (criteria) => {
          const cacheKey = SearchCacheService.generateCacheKey(criteria);
          try {
            const { response } = await this.search(criteria, 1, userLocation, userId, {
              useCache: true,
              trackAnalytics: false, // Pas de tracking pour le préchargement
              geoFiltering: false,
              intelligentSuggestions: false,
              similarityBoost: false
            });
            return { key: cacheKey, response };
          } catch (error) {
            console.error(`Bulk search error for query:`, criteria, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(result => {
          if (result) {
            results.set(result.key, result.response);
          }
        });
      }

      console.log(`✅ Bulk search completed: ${results.size}/${queries.length} queries`);
      return results;

    } catch (error) {
      console.error('Bulk search error:', error);
      return results;
    }
  }

  // Méthodes privées utilitaires
  private static async applySimilarityBoost(
    results: SearchResult[],
    criteria: SearchCriteria,
    country?: string
  ): Promise<SearchResult[]> {
    if (results.length === 0) return results;

    try {
      // Utiliser le premier résultat comme référence pour trouver des similaires
      const similarProducts = await SimilaritySearchService.findSimilarProducts(
        results[0].id,
        3,
        criteria.category
      );

      // Injecter les produits similaires dans les résultats si pertinents
      const enhancedResults = [...results];
      
      similarProducts.forEach((similar, index) => {
        if (!results.find(r => r.id === similar.id)) {
          // Insérer à des positions stratégiques
          const insertPosition = Math.min(5 + index * 3, enhancedResults.length);
          enhancedResults.splice(insertPosition, 0, similar);
        }
      });

      return enhancedResults;

    } catch (error) {
      console.error('Similarity boost error:', error);
      return results;
    }
  }

  private static async preloadSimilarProducts(productId: string, country?: string): Promise<void> {
    try {
      // Précharger en arrière-plan
      setTimeout(async () => {
        const similarProducts = await SimilaritySearchService.findSimilarProducts(
          productId,
          5,
          undefined
        );
        console.log(`🔄 Préchargé ${similarProducts.length} produits similaires pour ${productId}`);
      }, 100);
    } catch (error) {
      console.error('Preload similar products error:', error);
    }
  }

  private static calculatePerformanceScore(
    searchTime: number,
    cacheHit: boolean,
    resultsCount: number
  ): 'excellent' | 'good' | 'average' | 'poor' {
    let score = 0;

    // Bonus pour cache hit
    if (cacheHit) score += 30;

    // Score basé sur le temps de réponse
    if (searchTime < 50) score += 40;
    else if (searchTime < 100) score += 30;
    else if (searchTime < 200) score += 20;
    else if (searchTime < 500) score += 10;

    // Score basé sur le nombre de résultats
    if (resultsCount > 10) score += 20;
    else if (resultsCount > 5) score += 15;
    else if (resultsCount > 0) score += 10;

    // Bonus pour vitesse absolue
    if (searchTime < 25) score += 10;

    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  }

  private static analyzeUserContext(history: string[]): Record<string, number> {
    const context: Record<string, number> = {};
    
    history.forEach(query => {
      const lowerQuery = query.toLowerCase();
      
      // Identifier les patterns
      if (lowerQuery.includes('assurance')) context.insurance = (context.insurance || 0) + 1;
      if (lowerQuery.includes('smartphone') || lowerQuery.includes('téléphone')) context.tech = (context.tech || 0) + 1;
      if (lowerQuery.includes('auto') || lowerQuery.includes('voiture')) context.automotive = (context.automotive || 0) + 1;
      if (lowerQuery.includes('santé') || lowerQuery.includes('médical')) context.health = (context.health || 0) + 1;
      if (lowerQuery.includes('banque') || lowerQuery.includes('crédit')) context.banking = (context.banking || 0) + 1;
    });

    return context;
  }

  private static applyCriteriaBoosts(
    criteria: SearchCriteria,
    context: Record<string, number>
  ): SearchCriteria {
    const enhanced = { ...criteria };

    // Appliquer des boosts basés sur le contexte
    const topContext = Object.entries(context).sort(([,a], [,b]) => b - a)[0];
    
    if (topContext) {
      const [category, strength] = topContext;
      
      // Adapter la catégorie si pas spécifiée
      if (!enhanced.category && strength > 2) {
        switch (category) {
          case 'insurance':
            enhanced.category = 'assurance-auto';
            break;
          case 'tech':
            enhanced.category = 'smartphones';
            break;
          case 'automotive':
            enhanced.category = 'assurance-auto';
            break;
          case 'health':
            enhanced.category = 'assurance-sante';
            break;
          case 'banking':
            enhanced.category = 'banque';
            break;
        }
      }
    }

    return enhanced;
  }

  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Méthodes publiques utilitaires
  static getCacheStats() {
    return SearchCacheService.getStats();
  }

  static clearCache() {
    SearchCacheService.clear();
  }

  static async getAnalytics(period: 'day' | 'week' | 'month' = 'week') {
    return {
      popularQueries: await SearchAnalyticsService.getPopularQueries(10, period),
      trends: await SearchAnalyticsService.getSearchTrends(period === 'day' ? 'daily' : period === 'week' ? 'weekly' : 'monthly'),
      geoInsights: await SearchAnalyticsService.getGeographicInsights(),
      performance: await SearchAnalyticsService.getPerformanceMetrics('24h'),
      cache: SearchCacheService.getMetrics()
    };
  }
}
