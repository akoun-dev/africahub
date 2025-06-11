
import { SearchCriteria, SearchResponse } from '@/types/search';
import { SearchService } from '@/services/SearchService';

export class SearchEngine {
  static async executeSearch(
    criteria: SearchCriteria,
    page: number = 1
  ): Promise<SearchResponse> {
    try {
      const response = await SearchService.search(criteria, page);
      
      // Adapter la réponse pour le bon type avec propriétés par défaut
      return {
        ...response,
        results: response.results.map(result => ({
          ...result,
          originalPrice: result.price * 1.2, // Simulation d'un prix original
          deliveryTime: result.deliveryTime || '2-3 jours',
          warranty: result.warranty || '1 an'
        })),
        facets: {
          brands: response.facets?.brands || [],
          sectors: response.facets?.sectors || [],
          priceRanges: [
            { min: 0, max: 500, count: 15 },
            { min: 500, max: 1000, count: 23 },
            { min: 1000, max: 5000, count: 18 },
            { min: 5000, max: 10000, count: 8 }
          ],
          locations: response.facets?.locations || []
        }
      };
    } catch (error) {
      console.error('SearchEngine error:', error);
      
      // Retourner une réponse vide en cas d'erreur
      return {
        results: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        searchTime: 0,
        suggestions: [],
        facets: {
          brands: [],
          sectors: [],
          priceRanges: [],
          locations: []
        }
      };
    }
  }
}
