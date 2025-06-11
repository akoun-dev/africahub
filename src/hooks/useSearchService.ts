import { useState, useCallback, useEffect } from 'react';
import { SearchService, SearchCriteria, SearchResult, SearchResponse } from '@/services/SearchService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useSearchService = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTime, setSearchTime] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [facets, setFacets] = useState<SearchResponse['facets']>({
    brands: [],
    sectors: [],
    priceRanges: [],
    locations: []
  });

  const performSearch = useCallback(async (
    criteria: SearchCriteria,
    page: number = 1
  ) => {
    setLoading(true);
    try {
      const response = await SearchService.search(criteria, page);
      
      setSearchResults(response.results);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setSearchTime(response.searchTime);
      setSuggestions(response.suggestions);
      setFacets(response.facets);

      console.log('Search completed:', {
        query: criteria.query,
        totalResults: response.totalCount,
        page,
        searchTime: `${response.searchTime}ms`
      });

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche');
      setSearchResults([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const findSimilarProducts = useCallback(async (productId: string) => {
    try {
      const results = await SearchService.findSimilarProducts(productId);
      return results;
    } catch (error) {
      console.error('Similar products error:', error);
      return [];
    }
  }, []);

  const saveSearch = useCallback(async (criteria: SearchCriteria, name: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder une recherche');
      return null;
    }

    try {
      const savedSearch = await SearchService.saveSearch(user.id, criteria, name);
      toast.success('Recherche sauvegardée avec succès');
      return savedSearch;
    } catch (error) {
      console.error('Save search error:', error);
      toast.error('Erreur lors de la sauvegarde');
      return null;
    }
  }, [user]);

  const getSavedSearches = useCallback(async () => {
    if (!user) return [];

    try {
      return await SearchService.getSavedSearches(user.id);
    } catch (error) {
      console.error('Get saved searches error:', error);
      return [];
    }
  }, [user]);

  return {
    // État
    loading,
    searchResults,
    totalCount,
    totalPages,
    currentPage,
    searchTime,
    suggestions,
    facets,

    // Actions
    performSearch,
    findSimilarProducts,
    saveSearch,
    getSavedSearches
  };
};
