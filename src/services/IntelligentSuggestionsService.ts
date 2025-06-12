
import { supabase } from '@/integrations/supabase/client';

export interface SmartSuggestion {
  text: string;
  type: 'product' | 'brand' | 'category' | 'recent' | 'trending';
  confidence: number;
  metadata?: Record<string, any>;
}

export interface SearchAnalytics {
  query: string;
  frequency: number;
  conversion_rate: number;
  avg_result_count: number;
  last_searched: string;
}

export class IntelligentSuggestionsService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static suggestionCache = new Map<string, { suggestions: SmartSuggestion[], timestamp: number }>();

  // Générer des suggestions intelligentes basées sur la saisie
  static async generateSmartSuggestions(
    query: string,
    userId?: string,
    sector?: string,
    limit: number = 8
  ): Promise<SmartSuggestion[]> {
    if (!query || query.length < 2) {
      return this.getDefaultSuggestions(userId, sector, limit);
    }

    const cacheKey = `${query}-${userId}-${sector}`;
    const cached = this.suggestionCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.suggestions;
    }

    try {
      const suggestions: SmartSuggestion[] = [];

      // 1. Suggestions de produits
      const productSuggestions = await this.getProductSuggestions(query, sector, 3);
      suggestions.push(...productSuggestions);

      // 2. Suggestions de marques
      const brandSuggestions = await this.getBrandSuggestions(query, sector, 2);
      suggestions.push(...brandSuggestions);

      // 3. Suggestions de catégories
      const categorySuggestions = await this.getCategorySuggestions(query, 2);
      suggestions.push(...categorySuggestions);

      // 4. Recherches récentes de l'utilisateur
      if (userId) {
        const recentSuggestions = await this.getRecentSearches(userId, query, 2);
        suggestions.push(...recentSuggestions);
      }

      // 5. Recherches tendances
      const trendingSuggestions = await this.getTrendingSuggestions(query, 2);
      suggestions.push(...trendingSuggestions);

      // Trier par confiance et limiter
      const sortedSuggestions = suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit);

      // Mettre en cache
      this.suggestionCache.set(cacheKey, {
        suggestions: sortedSuggestions,
        timestamp: Date.now()
      });

      return sortedSuggestions;

    } catch (error) {
      console.error('Error generating smart suggestions:', error);
      return this.getDefaultSuggestions(userId, sector, limit);
    }
  }

  // Suggestions de produits basées sur le nom
  private static async getProductSuggestions(
    query: string,
    sector?: string,
    limit: number = 3
  ): Promise<SmartSuggestion[]> {
    try {
      let queryBuilder = supabase
        .from('products')
        .select('name, brand, product_types(sectors(name, slug))')
        .ilike('name', `%${query}%`)
        .eq('is_active', true);

      if (sector) {
        queryBuilder = queryBuilder.eq('product_types.sectors.slug', sector);
      }

      const { data: products } = await queryBuilder.limit(limit);

      return (products || []).map(product => ({
        text: product.name,
        type: 'product' as const,
        confidence: this.calculateMatchConfidence(query, product.name),
        metadata: { brand: product.brand, sector: product.product_types?.sectors?.name }
      }));

    } catch (error) {
      console.error('Error getting product suggestions:', error);
      return [];
    }
  }

  // Suggestions de marques
  private static async getBrandSuggestions(
    query: string,
    sector?: string,
    limit: number = 2
  ): Promise<SmartSuggestion[]> {
    try {
      let queryBuilder = supabase
        .from('products')
        .select('brand, product_types(sectors(slug))')
        .ilike('brand', `%${query}%`)
        .eq('is_active', true)
        .not('brand', 'is', null);

      if (sector) {
        queryBuilder = queryBuilder.eq('product_types.sectors.slug', sector);
      }

      const { data: products } = await queryBuilder.limit(limit * 2);

      const brands = [...new Set((products || []).map(p => p.brand).filter(Boolean))];

      return brands.slice(0, limit).map(brand => ({
        text: brand!,
        type: 'brand' as const,
        confidence: this.calculateMatchConfidence(query, brand!),
        metadata: { type: 'brand' }
      }));

    } catch (error) {
      console.error('Error getting brand suggestions:', error);
      return [];
    }
  }

  // Suggestions de catégories
  private static async getCategorySuggestions(
    query: string,
    limit: number = 2
  ): Promise<SmartSuggestion[]> {
    try {
      const { data: sectors } = await supabase
        .from('sectors')
        .select('name, slug')
        .ilike('name', `%${query}%`)
        .eq('is_active', true)
        .limit(limit);

      return (sectors || []).map(sector => ({
        text: sector.name,
        type: 'category' as const,
        confidence: this.calculateMatchConfidence(query, sector.name),
        metadata: { slug: sector.slug }
      }));

    } catch (error) {
      console.error('Error getting category suggestions:', error);
      return [];
    }
  }

  // Recherches récentes de l'utilisateur
  private static async getRecentSearches(
    userId: string,
    query: string,
    limit: number = 2
  ): Promise<SmartSuggestion[]> {
    try {
      const { data: searches } = await supabase
        .from('saved_searches')
        .select('name, criteria')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!searches) return [];

      return searches
        .filter(search => search.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit)
        .map(search => ({
          text: search.name,
          type: 'recent' as const,
          confidence: this.calculateMatchConfidence(query, search.name),
          metadata: { criteria: search.criteria }
        }));

    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  // Recherches tendances (simulé pour l'instant)
  private static async getTrendingSuggestions(
    query: string,
    limit: number = 2
  ): Promise<SmartSuggestion[]> {
    const trendingTerms = [
      'assurance auto',
      'assurance santé',
      'smartphone',
      'ordinateur portable',
      'forfait internet',
      'banque en ligne'
    ];

    return trendingTerms
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)
      .map(term => ({
        text: term,
        type: 'trending' as const,
        confidence: this.calculateMatchConfidence(query, term),
        metadata: { trending: true }
      }));
  }

  // Suggestions par défaut
  private static async getDefaultSuggestions(
    userId?: string,
    sector?: string,
    limit: number = 6
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Recherches récentes si utilisateur connecté
    if (userId) {
      const recent = await this.getRecentSearches(userId, '', 3);
      suggestions.push(...recent);
    }

    // Recherches populaires
    const popular = [
      'assurance auto',
      'assurance santé',
      'smartphone',
      'ordinateur portable'
    ].map(term => ({
      text: term,
      type: 'trending' as const,
      confidence: 0.8,
      metadata: { popular: true }
    }));

    suggestions.push(...popular);

    return suggestions.slice(0, limit);
  }

  // Calculer la confiance de correspondance
  private static calculateMatchConfidence(query: string, target: string): number {
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedTarget = target.toLowerCase().trim();

    if (normalizedTarget.startsWith(normalizedQuery)) {
      return 0.9;
    }

    if (normalizedTarget.includes(normalizedQuery)) {
      return 0.7;
    }

    // Distance de Levenshtein simplifiée
    const distance = this.levenshteinDistance(normalizedQuery, normalizedTarget);
    const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length);
    
    return Math.max(0, 1 - (distance / maxLength));
  }

  // Distance de Levenshtein
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Nettoyer le cache périodiquement
  static clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.suggestionCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.suggestionCache.delete(key);
      }
    }
  }
}

// Nettoyer le cache toutes les 10 minutes
setInterval(() => {
  IntelligentSuggestionsService.clearExpiredCache();
}, 10 * 60 * 1000);
