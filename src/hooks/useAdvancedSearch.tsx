
import { useState, useEffect, useCallback } from 'react';
import { useCountry } from '@/contexts/CountryContext';
import { useSearchService } from '@/hooks/useSearchService';
import { SearchCriteria, SearchFilters } from '@/services/SearchService';
import { toast } from 'sonner';

export const useAdvancedSearch = () => {
  const { country } = useCountry();
  const {
    loading,
    searchResults,
    totalCount,
    totalPages,
    currentPage,
    searchTime,
    suggestions,
    facets,
    performSearch,
    saveSearch,
    getSavedSearches
  } = useSearchService();

  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: '',
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
      countries: []
    }
  });

  const updateCriteria = useCallback((newCriteria: Partial<SearchCriteria>) => {
    const updatedCriteria = { ...criteria, ...newCriteria };
    setCriteria(updatedCriteria);
    performSearch(updatedCriteria, 1);
  }, [criteria, performSearch]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...criteria.filters, ...newFilters };
    updateCriteria({ filters: updatedFilters });
  }, [criteria.filters, updateCriteria]);

  const clearFilters = useCallback(() => {
    const defaultFilters: SearchFilters = {
      priceRange: [0, 2000000],
      rating: 0,
      location: '',
      availability: '',
      brands: [],
      features: [],
      warranty: '',
      deliveryTime: '',
      sectors: [],
      countries: []
    };
    updateCriteria({ filters: defaultFilters });
  }, [updateCriteria]);

  const goToPage = useCallback((page: number) => {
    performSearch(criteria, page);
  }, [criteria, performSearch]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    const { filters } = criteria;
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) count++;
    if (filters.rating > 0) count++;
    if (filters.location) count++;
    if (filters.availability) count++;
    if (filters.brands.length > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.warranty) count++;
    if (filters.deliveryTime) count++;
    if (filters.sectors.length > 0) count++;
    if (filters.countries.length > 0) count++;
    
    return count;
  }, [criteria]);

  const handleSaveSearch = useCallback(async (name: string) => {
    const result = await saveSearch(criteria, name);
    if (result) {
      toast.success('Recherche sauvegardée avec succès');
    }
  }, [criteria, saveSearch]);

  // Recherche initiale
  useEffect(() => {
    performSearch(criteria);
  }, []);

  return {
    criteria,
    searchResults,
    loading,
    currentPage,
    totalPages,
    totalCount,
    searchTime,
    suggestions,
    facets,
    updateCriteria,
    updateFilters,
    clearFilters,
    goToPage,
    activeFiltersCount: getActiveFiltersCount(),
    saveSearch: handleSaveSearch,
    getSavedSearches
  };
};
