
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters as SearchFiltersType } from '@/services/SearchService';
import { X, Filter, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  facets: {
    brands: { name: string; count: number }[];
    sectors: { name: string; count: number }[];
    priceRanges: { range: string; count: number }[];
    locations: { name: string; count: number }[];
  };
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
  facets
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}k`;
    return price.toString();
  };

  return (
    <div className="space-y-4">
      {/* Header des filtres */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-brandBlue" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge className="bg-brandBlue text-white">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Effacer tout
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filtre par prix */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            💰 Fourchette de prix
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ priceRange: value as [number, number] })}
              max={2000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(filters.priceRange[0])} XOF</span>
              <span>{formatPrice(filters.priceRange[1])} XOF</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtre par note */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            ⭐ Note minimale
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select
            value={filters.rating.toString()}
            onValueChange={(value) => onFiltersChange({ rating: parseFloat(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les notes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Toutes les notes</SelectItem>
              <SelectItem value="4">4+ étoiles</SelectItem>
              <SelectItem value="3">3+ étoiles</SelectItem>
              <SelectItem value="2">2+ étoiles</SelectItem>
              <SelectItem value="1">1+ étoile</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filtre par marques */}
      {facets.brands.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              🏷️ Marques
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {facets.brands.slice(0, 10).map((brand) => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.name}`}
                      checked={filters.brands.includes(brand.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFiltersChange({
                            brands: [...filters.brands, brand.name]
                          });
                        } else {
                          onFiltersChange({
                            brands: filters.brands.filter(b => b !== brand.name)
                          });
                        }
                      }}
                    />
                    <label 
                      htmlFor={`brand-${brand.name}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {brand.name}
                    </label>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {brand.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtre par localisation */}
      {facets.locations.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              📍 Localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select
              value={filters.location || "all-locations"}
              onValueChange={(value) => onFiltersChange({ location: value === "all-locations" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">Tous les pays</SelectItem>
                {facets.locations.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{location.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {location.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Filtre par disponibilité */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            📦 Disponibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select
            value={filters.availability || "all-availability"}
            onValueChange={(value) => onFiltersChange({ availability: value === "all-availability" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes disponibilités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-availability">Toutes disponibilités</SelectItem>
              <SelectItem value="available">✅ Disponible</SelectItem>
              <SelectItem value="limited">⚠️ Stock limité</SelectItem>
              <SelectItem value="pre-order">🔄 Pré-commande</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
