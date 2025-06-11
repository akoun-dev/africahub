
export interface SearchIntent {
  type: 'product' | 'brand' | 'comparison' | 'price' | 'feature';
  confidence: number;
  keywords: string[];
  suggestions: string[];
}

export interface SearchMetrics {
  query: string;
  timestamp: number;
  responseTime: number;
  resultCount: number;
  clicked: boolean;
  position?: number;
}

// Explicit type alias to avoid TypeScript inference issues
type IntentType = 'product' | 'brand' | 'comparison' | 'price' | 'feature';

export class SearchAnalytics {
  private static storageKey = 'search_analytics';
  
  // Use explicit Record type instead of as const
  private static intentPatterns: Record<IntentType, string[]> = {
    product: ['acheter', 'commander', 'prix', 'coût', 'disponible'],
    brand: ['marque', 'fabricant', 'constructeur', 'entreprise'],
    comparison: ['comparer', 'différence', 'versus', 'vs', 'meilleur'],
    price: ['pas cher', 'économique', 'abordable', 'budget', 'promotion'],
    feature: ['caractéristique', 'spécification', 'détail', 'performance']
  };

  static analyzeSearchIntent(query: string): SearchIntent {
    const normalizedQuery = query.toLowerCase();
    const results: Array<{ type: IntentType; score: number }> = [];
    
    // Use explicit array of intent types instead of keyof typeof
    const intentTypes: IntentType[] = ['product', 'brand', 'comparison', 'price', 'feature'];
    
    // Use forEach with explicit typing
    intentTypes.forEach(intentType => {
      const patterns = this.intentPatterns[intentType];
      const matches = patterns.filter(pattern => 
        normalizedQuery.includes(pattern)
      ).length;
      
      if (matches > 0) {
        results.push({ 
          type: intentType, 
          score: matches / patterns.length 
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    
    const topIntent = results[0] || { type: 'product' as IntentType, score: 0.5 };
    
    return {
      type: topIntent.type,
      confidence: topIntent.score,
      keywords: this.extractKeywords(normalizedQuery),
      suggestions: this.generateSuggestions(normalizedQuery, topIntent.type)
    };
  }

  static trackSearch(metrics: SearchMetrics): void {
    try {
      const existing = this.getSearchHistory();
      existing.push(metrics);
      
      const limited = existing.slice(-100);
      localStorage.setItem(this.storageKey, JSON.stringify(limited));
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }

  static getSearchHistory(): SearchMetrics[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  static getRecentSearches(limit: number = 10): string[] {
    const history = this.getSearchHistory();
    const recentQueries = history
      .slice(-limit)
      .map(h => h.query)
      .filter((query, index, arr) => arr.indexOf(query) === index);
    
    return recentQueries.reverse();
  }

  static getPopularSearches(limit: number = 5): Array<{ query: string; count: number }> {
    const history = this.getSearchHistory();
    const queryCount = new Map<string, number>();

    history.forEach(h => {
      queryCount.set(h.query, (queryCount.get(h.query) || 0) + 1);
    });

    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private static extractKeywords(query: string): string[] {
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc', 'car', 'pour', 'avec', 'sans'];
    
    return query
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5);
  }

  private static generateSuggestions(query: string, intentType: IntentType): string[] {
    const baseSuggestions: Record<IntentType, string[]> = {
      product: [`${query} prix`, `${query} avis`, `${query} comparaison`],
      brand: [`marques ${query}`, `${query} fabricant`, `${query} entreprise`],
      comparison: [`comparer ${query}`, `${query} vs`, `meilleur ${query}`],
      price: [`${query} pas cher`, `${query} promotion`, `${query} économique`],
      feature: [`${query} caractéristiques`, `${query} spécifications`, `${query} détails`]
    };

    return baseSuggestions[intentType] || [];
  }
}
