
import { supabase } from '@/integrations/supabase/client';
import { SearchCriteria } from './SearchService';

export interface SearchAnalytics {
  id: string;
  query: string;
  category: string;
  user_id?: string;
  session_id: string;
  country: string;
  results_count: number;
  search_time_ms: number;
  clicked_results: string[];
  conversion_event?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface PopularQuery {
  query: string;
  frequency: number;
  avg_results: number;
  avg_search_time: number;
  conversion_rate: number;
  trending_score: number;
}

export interface SearchTrends {
  period: 'daily' | 'weekly' | 'monthly';
  data: {
    date: string;
    searches: number;
    unique_users: number;
    avg_response_time: number;
    top_queries: PopularQuery[];
  }[];
}

export interface GeographicInsights {
  country: string;
  searches: number;
  top_categories: string[];
  avg_conversion_rate: number;
  popular_brands: string[];
}

export class SearchAnalyticsService {
  private static sessionId = this.generateSessionId();

  // Enregistrer une recherche
  static async trackSearch(
    criteria: SearchCriteria,
    resultsCount: number,
    searchTime: number,
    userId?: string,
    country: string = 'SN'
  ): Promise<void> {
    try {
      const analytics: Omit<SearchAnalytics, 'id' | 'created_at'> = {
        query: criteria.query || '',
        category: criteria.category || '',
        user_id: userId,
        session_id: this.sessionId,
        country,
        results_count: resultsCount,
        search_time_ms: searchTime,
        clicked_results: [],
        metadata: {
          sortBy: criteria.sortBy,
          sortOrder: criteria.sortOrder,
          filters: criteria.filters,
          timestamp: Date.now()
        }
      };

      // En production, envoyer vers Supabase
      console.log('Search tracked:', analytics);
      
      // Stocker localement pour la démo
      this.storeLocalAnalytics(analytics);

    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }

  // Enregistrer un clic sur un résultat
  static async trackResultClick(
    searchQuery: string,
    productId: string,
    position: number,
    userId?: string
  ): Promise<void> {
    try {
      const clickData = {
        search_query: searchQuery,
        product_id: productId,
        position,
        user_id: userId,
        session_id: this.sessionId,
        clicked_at: new Date().toISOString()
      };

      console.log('Result click tracked:', clickData);
      this.storeLocalClickEvent(clickData);

    } catch (error) {
      console.error('Error tracking result click:', error);
    }
  }

  // Enregistrer une conversion (achat, demande de devis, etc.)
  static async trackConversion(
    searchQuery: string,
    productId: string,
    conversionType: 'purchase' | 'quote_request' | 'favorite' | 'comparison',
    value?: number,
    userId?: string
  ): Promise<void> {
    try {
      const conversionData = {
        search_query: searchQuery,
        product_id: productId,
        conversion_type: conversionType,
        value,
        user_id: userId,
        session_id: this.sessionId,
        converted_at: new Date().toISOString()
      };

      console.log('Conversion tracked:', conversionData);
      this.storeLocalConversion(conversionData);

    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  // Obtenir les requêtes populaires
  static async getPopularQueries(
    limit: number = 10,
    period: 'day' | 'week' | 'month' = 'week',
    country?: string
  ): Promise<PopularQuery[]> {
    try {
      // Simuler des données populaires pour la démo
      const mockPopularQueries: PopularQuery[] = [
        {
          query: 'assurance auto',
          frequency: 234,
          avg_results: 12,
          avg_search_time: 150,
          conversion_rate: 0.23,
          trending_score: 8.5
        },
        {
          query: 'smartphone',
          frequency: 189,
          avg_results: 24,
          avg_search_time: 120,
          conversion_rate: 0.31,
          trending_score: 7.8
        },
        {
          query: 'assurance santé',
          frequency: 156,
          avg_results: 8,
          avg_search_time: 180,
          conversion_rate: 0.18,
          trending_score: 7.2
        },
        {
          query: 'ordinateur portable',
          frequency: 134,
          avg_results: 18,
          avg_search_time: 140,
          conversion_rate: 0.25,
          trending_score: 6.9
        },
        {
          query: 'forfait internet',
          frequency: 98,
          avg_results: 6,
          avg_search_time: 110,
          conversion_rate: 0.42,
          trending_score: 6.1
        }
      ];

      return mockPopularQueries.slice(0, limit);

    } catch (error) {
      console.error('Error getting popular queries:', error);
      return [];
    }
  }

  // Obtenir les tendances de recherche
  static async getSearchTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'weekly',
    country?: string
  ): Promise<SearchTrends> {
    try {
      // Simuler des données de tendances
      const mockTrends: SearchTrends = {
        period,
        data: [
          {
            date: '2024-01-22',
            searches: 1234,
            unique_users: 456,
            avg_response_time: 145,
            top_queries: await this.getPopularQueries(5, 'day', country)
          },
          {
            date: '2024-01-23',
            searches: 1456,
            unique_users: 523,
            avg_response_time: 138,
            top_queries: await this.getPopularQueries(5, 'day', country)
          },
          {
            date: '2024-01-24',
            searches: 1678,
            unique_users: 612,
            avg_response_time: 142,
            top_queries: await this.getPopularQueries(5, 'day', country)
          }
        ]
      };

      return mockTrends;

    } catch (error) {
      console.error('Error getting search trends:', error);
      return { period, data: [] };
    }
  }

  // Obtenir les insights géographiques
  static async getGeographicInsights(): Promise<GeographicInsights[]> {
    try {
      const mockInsights: GeographicInsights[] = [
        {
          country: 'SN',
          searches: 2456,
          top_categories: ['assurance-auto', 'smartphones', 'assurance-sante'],
          avg_conversion_rate: 0.28,
          popular_brands: ['Orange', 'Sonatel', 'Samsung']
        },
        {
          country: 'CI',
          searches: 1923,
          top_categories: ['smartphones', 'forfait-internet', 'assurance-auto'],
          avg_conversion_rate: 0.31,
          popular_brands: ['MTN', 'Orange', 'Apple']
        },
        {
          country: 'MA',
          searches: 1654,
          top_categories: ['assurance-sante', 'ordinateurs', 'smartphones'],
          avg_conversion_rate: 0.25,
          popular_brands: ['Maroc Telecom', 'BMCE', 'iPhone']
        }
      ];

      return mockInsights;

    } catch (error) {
      console.error('Error getting geographic insights:', error);
      return [];
    }
  }

  // Obtenir les métriques de performance
  static async getPerformanceMetrics(timeframe: '1h' | '24h' | '7d' | '30d' = '24h') {
    try {
      return {
        avg_search_time: 142,
        total_searches: 12456,
        unique_users: 3456,
        cache_hit_rate: 0.73,
        error_rate: 0.02,
        conversion_rate: 0.27,
        popular_filters: ['price', 'brand', 'location'],
        peak_hours: ['10:00', '14:00', '19:00'],
        device_breakdown: {
          mobile: 0.68,
          desktop: 0.28,
          tablet: 0.04
        }
      };

    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return null;
    }
  }

  // Analyser l'intent de recherche
  static analyzeSearchIntent(query: string): {
    intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
    confidence: number;
    suggested_actions: string[];
  } {
    const lowerQuery = query.toLowerCase();
    
    // Mots-clés transactionnels
    if (lowerQuery.includes('acheter') || lowerQuery.includes('prix') || lowerQuery.includes('devis')) {
      return {
        intent: 'transactional',
        confidence: 0.85,
        suggested_actions: ['Afficher les prix', 'Bouton achat rapide', 'Formulaire de devis']
      };
    }
    
    // Mots-clés commerciaux
    if (lowerQuery.includes('comparer') || lowerQuery.includes('meilleur') || lowerQuery.includes('vs')) {
      return {
        intent: 'commercial',
        confidence: 0.78,
        suggested_actions: ['Tableau de comparaison', 'Top produits', 'Filtres avancés']
      };
    }
    
    // Mots-clés informatifs
    if (lowerQuery.includes('comment') || lowerQuery.includes('pourquoi') || lowerQuery.includes('guide')) {
      return {
        intent: 'informational',
        confidence: 0.82,
        suggested_actions: ['Articles explicatifs', 'Guides', 'FAQ']
      };
    }
    
    return {
      intent: 'navigational',
      confidence: 0.60,
      suggested_actions: ['Résultats de recherche standard', 'Suggestions']
    };
  }

  // Stockage local des analytics (pour la démo)
  private static storeLocalAnalytics(analytics: any): void {
    const stored = JSON.parse(localStorage.getItem('search_analytics') || '[]');
    stored.push({ ...analytics, id: this.generateId(), created_at: new Date().toISOString() });
    
    // Garder seulement les 1000 derniers
    if (stored.length > 1000) {
      stored.splice(0, stored.length - 1000);
    }
    
    localStorage.setItem('search_analytics', JSON.stringify(stored));
  }

  private static storeLocalClickEvent(clickData: any): void {
    const stored = JSON.parse(localStorage.getItem('click_events') || '[]');
    stored.push({ ...clickData, id: this.generateId() });
    
    if (stored.length > 500) {
      stored.splice(0, stored.length - 500);
    }
    
    localStorage.setItem('click_events', JSON.stringify(stored));
  }

  private static storeLocalConversion(conversionData: any): void {
    const stored = JSON.parse(localStorage.getItem('conversions') || '[]');
    stored.push({ ...conversionData, id: this.generateId() });
    
    if (stored.length > 200) {
      stored.splice(0, stored.length - 200);
    }
    
    localStorage.setItem('conversions', JSON.stringify(stored));
  }

  private static generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
