
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Filter,
  X,
  DollarSign,
  Star,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ModernSearchFiltersProps {
  filters: {
    priceRange: [number, number];
    rating: number;
    location: string;
    brands: string[];
    features: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const ModernSearchFilters: React.FC<ModernSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount
}) => {
  const { country } = useCountry();
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    location: true,
    brands: false,
    features: false
  });

  const availableBrands = [
    'Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OnePlus',
    'Orange', 'MTN', 'Moov', 'Airtel', 'Expresso'
  ];

  const availableFeatures = [
    'Garantie étendue', 'Livraison rapide', 'Paiement mobile',
    'Service client 24/7', 'Retour gratuit', 'Installation incluse'
  ];

  const locations = [
    'Dakar', 'Abidjan', 'Lagos', 'Accra', 'Bamako', 
    'Ouagadougou', 'Niamey', 'Conakry', 'Cotonou'
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(country?.languages?.[0] || 'fr', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    
    onFiltersChange({ ...filters, features: newFeatures });
  };

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    icon: any; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
      <CardHeader 
        className="pb-3 cursor-pointer" 
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-gray-900">
            <Icon className="h-4 w-4 text-brandBlue" />
            {title}
          </CardTitle>
          {expandedSections[sectionKey] ? 
            <ChevronUp className="h-4 w-4 text-gray-600" /> : 
            <ChevronDown className="h-4 w-4 text-gray-600" />
          }
        </div>
      </CardHeader>
      
      {expandedSections[sectionKey] && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header with clear filters */}
      <Card className="bg-brandBlue/5 border-brandBlue/30 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-brandBlue" />
              <span className="font-semibold text-brandBlue">
                {t('search.filters', 'Filtres')}
              </span>
              {activeFiltersCount > 0 && (
                <Badge className="bg-brandBlue text-white shadow-sm">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Effacer tout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Filter */}
      <FilterSection title="Prix" icon={DollarSign} sectionKey="price">
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
            max={2000000}
            min={0}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-700">
            <span className="bg-brandBlue/10 border border-brandBlue/20 px-3 py-1 rounded-md font-medium">
              {formatPrice(filters.priceRange[0])}
            </span>
            <span className="bg-brandBlue/10 border border-brandBlue/20 px-3 py-1 rounded-md font-medium">
              {formatPrice(filters.priceRange[1])}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Note minimale" icon={Star} sectionKey="rating">
        <div className="space-y-2">
          {[3, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, rating: filters.rating === rating ? 0 : rating })}
              className={`w-full justify-start shadow-sm ${
                filters.rating === rating 
                  ? 'bg-brandBlue text-white border-brandBlue' 
                  : 'hover:bg-brandBlue/10 border-gray-300 bg-white'
              }`}
            >
              <Star className="h-4 w-4 mr-2 fill-current" />
              {rating}+ étoiles
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Location Filter */}
      <FilterSection title="Localisation" icon={MapPin} sectionKey="location">
        <div className="space-y-2">
          {locations.slice(0, 5).map((location) => (
            <Button
              key={location}
              variant={filters.location === location ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ 
                ...filters, 
                location: filters.location === location ? "" : location 
              })}
              className={`w-full justify-start shadow-sm ${
                filters.location === location 
                  ? 'bg-brandBlue text-white border-brandBlue' 
                  : 'hover:bg-brandBlue/10 border-gray-300 bg-white'
              }`}
            >
              {location}
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Brands Filter */}
      <FilterSection title="Marques" icon={Tag} sectionKey="brands">
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
              <Checkbox
                id={brand}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
                className="data-[state=checked]:bg-brandBlue data-[state=checked]:border-brandBlue"
              />
              <label htmlFor={brand} className="text-sm cursor-pointer hover:text-brandBlue transition-colors font-medium text-gray-700">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Features Filter */}
      <FilterSection title="Services" icon={Tag} sectionKey="features">
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {availableFeatures.map((feature) => (
            <div key={feature} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
              <Checkbox
                id={feature}
                checked={filters.features.includes(feature)}
                onCheckedChange={() => handleFeatureToggle(feature)}
                className="data-[state=checked]:bg-brandBlue data-[state=checked]:border-brandBlue"
              />
              <label htmlFor={feature} className="text-sm cursor-pointer hover:text-brandBlue transition-colors font-medium text-gray-700">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};
