
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ComparisonFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  brands: string[];
  countries: string[];
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  country?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating_desc';
}

export const ComparisonFilters: React.FC<ComparisonFiltersProps> = ({
  onFiltersChange,
  brands,
  countries
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>({});
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterOptions] !== undefined && filters[key as keyof FilterOptions] !== ''
  );

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof FilterOptions] !== undefined && filters[key as keyof FilterOptions] !== ''
  ).length;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtres et tri
            {activeFiltersCount > 0 && (
              <span className="text-sm bg-afroGreen text-white px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Effacer
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-5'}`}>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prix minimum</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prix maximum</Label>
              <Input
                type="number"
                placeholder="1000"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Marque</Label>
              <Select value={filters.brand || 'all'} onValueChange={(value) => updateFilters({ brand: value === 'all' ? undefined : value })}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les marques</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pays</Label>
              <Select value={filters.country || 'all'} onValueChange={(value) => updateFilters({ country: value === 'all' ? undefined : value })}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Trier par</Label>
              <Select value={filters.sortBy || 'default'} onValueChange={(value) => updateFilters({ sortBy: value === 'default' ? undefined : value as FilterOptions['sortBy'] })}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Défaut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Ordre par défaut</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating_desc">Meilleure note</SelectItem>
                  <SelectItem value="name_asc">Nom A-Z</SelectItem>
                  <SelectItem value="name_desc">Nom Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isMobile && hasActiveFilters && (
            <div className="mt-4 pt-3 border-t">
              <div className="text-sm text-gray-600 mb-2">Filtres actifs:</div>
              <div className="flex flex-wrap gap-2">
                {filters.minPrice && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Min: {filters.minPrice}
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Max: {filters.maxPrice}
                  </span>
                )}
                {filters.brand && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {filters.brand}
                  </span>
                )}
                {filters.sortBy && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    Trié
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
