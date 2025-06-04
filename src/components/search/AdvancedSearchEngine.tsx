
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { 
  Search, 
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react';

export const AdvancedSearchEngine: React.FC = () => {
  const { country } = useCountry();
  const { t } = useTranslation();
  
  const {
    criteria,
    searchResults,
    loading,
    currentPage,
    totalPages,
    totalCount,
    searchTime,
    facets,
    updateCriteria,
    updateFilters,
    clearFilters,
    goToPage,
    activeFiltersCount
  } = useAdvancedSearch();

  const categories = [
    { id: 'smartphones', name: 'Smartphones', count: 156 },
    { id: 'laptops', name: 'Ordinateurs portables', count: 89 },
    { id: 'insurance', name: 'Assurances', count: 234 },
    { id: 'banking', name: 'Services bancaires', count: 67 },
    { id: 'internet', name: 'Forfaits Internet', count: 123 }
  ];

  const handleViewProduct = (productId: string) => {
    console.log('View product:', productId);
    // TODO: Navigate to product detail page
  };

  const handleCompareProduct = (productId: string) => {
    console.log('Compare product:', productId);
    // TODO: Add to comparison
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche principale - Plus solide */}
      <Card className="bg-white border-gray-200 shadow-md">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('search.placeholder', 'Rechercher un produit, service ou catégorie...')}
                value={criteria.query}
                onChange={(e) => updateCriteria({ query: e.target.value })}
                className="pl-10 bg-white border-gray-300 focus:border-brandBlue"
              />
            </div>
            <Select
              value={criteria.category || "all-categories"}
              onValueChange={(value) => updateCriteria({ category: value === "all-categories" ? "" : value })}
            >
              <SelectTrigger className="w-48 bg-white border-gray-300">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="all-categories">Toutes catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtres avancés */}
        <div className="lg:col-span-1">
          <SearchFilters
            filters={criteria.filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
            facets={facets}
          />
        </div>

        {/* Résultats de recherche */}
        <div className="lg:col-span-3 space-y-4">
          {/* Statistiques et options de tri - Plus contrasté */}
          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-semibold text-gray-900">{totalCount}</span> résultats trouvés
                    {searchTime > 0 && (
                      <span className="ml-2 text-xs text-gray-600">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {searchTime}ms
                      </span>
                    )}
                  </p>
                  
                  {activeFiltersCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-brandBlue bg-brandBlue/10 px-2 py-1 rounded-full">
                      <BarChart3 className="h-3 w-3" />
                      {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Trier par:</span>
                  <Select
                    value={`${criteria.sortBy}-${criteria.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split('-') as [typeof criteria.sortBy, typeof criteria.sortOrder];
                      updateCriteria({ sortBy, sortOrder });
                    }}
                  >
                    <SelectTrigger className="w-48 bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 shadow-lg">
                      <SelectItem value="popularity-desc">
                        <TrendingUp className="h-4 w-4 inline mr-2" />
                        Popularité
                      </SelectItem>
                      <SelectItem value="price-asc">💰 Prix croissant</SelectItem>
                      <SelectItem value="price-desc">💰 Prix décroissant</SelectItem>
                      <SelectItem value="rating-desc">⭐ Mieux notés</SelectItem>
                      <SelectItem value="newest-desc">🆕 Plus récents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          <SearchResults
            results={searchResults}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onViewProduct={handleViewProduct}
            onCompareProduct={handleCompareProduct}
          />
        </div>
      </div>
    </div>
  );
};
