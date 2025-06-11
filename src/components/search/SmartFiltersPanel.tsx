
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  Filter, 
  MapPin, 
  DollarSign, 
  Star, 
  Clock, 
  Truck,
  Shield,
  Sparkles
} from 'lucide-react';
import { SearchCriteria, SearchFilters } from '@/types/search';
import { LocationData } from '@/hooks/search/useSearchGeo';

interface SmartFiltersPanelProps {
  criteria: SearchCriteria;
  onUpdateFilters: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  onClose: () => void;
  userLocation?: LocationData | null;
}

export const SmartFiltersPanel: React.FC<SmartFiltersPanelProps> = ({
  criteria,
  onUpdateFilters,
  onClearFilters,
  onClose,
  userLocation
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'location'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
    return price.toString();
  };

  // Marques populaires (simulées)
  const popularBrands = [
    'Samsung', 'Apple', 'Toyota', 'Orange', 'AXA', 'SONATEL', 'CBAO', 'Ecobank'
  ];

  // Pays disponibles
  const availableCountries = [
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' }
  ];

  // Secteurs dynamiques
  const availableSectors = [
    'assurance', 'banque', 'telecoms', 'automobile', 'electronique', 'immobilier'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-lg border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-brandBlue" />
              Filtres Intelligents
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Prix */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('price')}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold">Gamme de prix</h3>
                </div>
                <Badge variant="outline">
                  {formatPrice(criteria.filters.priceRange[0])} - {formatPrice(criteria.filters.priceRange[1])}
                </Badge>
              </div>

              {expandedSections.has('price') && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(criteria.filters.priceRange[0])} XOF</span>
                      <span>{formatPrice(criteria.filters.priceRange[1])} XOF</span>
                    </div>
                    <Slider
                      value={criteria.filters.priceRange}
                      onValueChange={(value) => onUpdateFilters({ priceRange: value as [number, number] })}
                      max={2000000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                  </div>

                  {/* Gammes prédéfinies */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Budget', range: [0, 50000] },
                      { label: 'Moyen', range: [50000, 200000] },
                      { label: 'Premium', range: [200000, 500000] },
                      { label: 'Luxe', range: [500000, 2000000] }
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateFilters({ priceRange: preset.range as [number, number] })}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Localisation */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('location')}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold">Localisation</h3>
                </div>
                {userLocation && (
                  <Badge variant="outline">
                    {userLocation.city}, {userLocation.country}
                  </Badge>
                )}
              </div>

              {expandedSections.has('location') && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-2 gap-2">
                    {availableCountries.map((country) => (
                      <div key={country.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={country.code}
                          checked={criteria.filters.countries.includes(country.code)}
                          onCheckedChange={(checked) => {
                            const newCountries = checked
                              ? [...criteria.filters.countries, country.code]
                              : criteria.filters.countries.filter(c => c !== country.code);
                            onUpdateFilters({ countries: newCountries });
                          }}
                        />
                        <label htmlFor={country.code} className="text-sm cursor-pointer">
                          {country.flag} {country.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note et avis */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('rating')}
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-semibold">Note minimale</h3>
                </div>
                {criteria.filters.rating > 0 && (
                  <Badge variant="outline">
                    {criteria.filters.rating}+ ⭐
                  </Badge>
                )}
              </div>

              {expandedSections.has('rating') && (
                <div className="space-y-4 pl-6">
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={criteria.filters.rating === rating ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onUpdateFilters({ rating })}
                        className="flex items-center gap-1"
                      >
                        {rating > 0 ? `${rating}+` : 'Toutes'} 
                        {rating > 0 && <Star className="h-3 w-3 fill-current" />}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Marques */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('brands')}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <h3 className="font-semibold">Marques</h3>
                </div>
                {criteria.filters.brands.length > 0 && (
                  <Badge variant="outline">
                    {criteria.filters.brands.length} sélectionnée(s)
                  </Badge>
                )}
              </div>

              {expandedSections.has('brands') && (
                <div className="space-y-4 pl-6">
                  <div className="grid grid-cols-2 gap-2">
                    {popularBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={criteria.filters.brands.includes(brand)}
                          onCheckedChange={(checked) => {
                            const newBrands = checked
                              ? [...criteria.filters.brands, brand]
                              : criteria.filters.brands.filter(b => b !== brand);
                            onUpdateFilters({ brands: newBrands });
                          }}
                        />
                        <label htmlFor={brand} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Disponibilité et livraison */}
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('availability')}
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold">Disponibilité</h3>
                </div>
              </div>

              {expandedSections.has('availability') && (
                <div className="space-y-4 pl-6">
                  <Select
                    value={criteria.filters.availability}
                    onValueChange={(value) => onUpdateFilters({ availability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les disponibilités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes</SelectItem>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="limited">Stock limité</SelectItem>
                      <SelectItem value="pre-order">Pré-commande</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={criteria.filters.deliveryTime}
                    onValueChange={(value) => onUpdateFilters({ deliveryTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Délai de livraison" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous délais</SelectItem>
                      <SelectItem value="24h">Livraison 24h</SelectItem>
                      <SelectItem value="2-3j">2-3 jours</SelectItem>
                      <SelectItem value="1w">1 semaine</SelectItem>
                      <SelectItem value="2w+">Plus de 2 semaines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={onClearFilters} variant="outline" className="flex-1">
                Effacer tout
              </Button>
              <Button onClick={onClose} className="flex-1 bg-brandBlue hover:bg-brandBlue/90">
                Appliquer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
