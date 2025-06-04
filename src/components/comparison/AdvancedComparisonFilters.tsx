
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, RotateCcw } from 'lucide-react';

interface FilterState {
  priceRange: [number, number];
  coverage: string[];
  company: string[];
  rating: number;
  features: string[];
  sortBy: string;
  onlyRecommended: boolean;
}

interface AdvancedComparisonFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const AdvancedComparisonFilters: React.FC<AdvancedComparisonFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isVisible,
  onToggleVisibility
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const coverageOptions = [
    'Responsabilité civile',
    'Tous risques',
    'Vol et incendie',
    'Dommages collision',
    'Protection juridique',
    'Assistance 24h/24'
  ];

  const companyOptions = [
    'AssurAfrique',
    'PanAfriInsure',
    'AgriAssur',
    'SafeGuard Africa',
    'Continental Insurance'
  ];

  const featureOptions = [
    'Application mobile',
    'Service client 24/7',
    'Franchise flexible',
    'Paiement mobile money',
    'Réseau étendu',
    'Télémédecine'
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayToggle = (key: keyof FilterState, item: string) => {
    const currentArray = localFilters[key] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    handleFilterChange(key, newArray);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.coverage.length > 0) count++;
    if (filters.company.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.onlyRecommended) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggleVisibility}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres avancés
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
        
        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {isVisible && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres de comparaison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prix */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Fourchette de prix (€/mois)</Label>
              <Slider
                value={localFilters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{localFilters.priceRange[0]}€</span>
                <span>{localFilters.priceRange[1]}€</span>
              </div>
            </div>

            {/* Note minimale */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Note minimale</Label>
              <Slider
                value={[localFilters.rating]}
                onValueChange={(value) => handleFilterChange('rating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                {localFilters.rating > 0 ? `${localFilters.rating}/5 étoiles` : 'Toutes les notes'}
              </div>
            </div>

            {/* Couvertures */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Types de couverture</Label>
              <div className="grid grid-cols-2 gap-2">
                {coverageOptions.map((coverage) => (
                  <div key={coverage} className="flex items-center space-x-2">
                    <Switch
                      id={`coverage-${coverage}`}
                      checked={localFilters.coverage.includes(coverage)}
                      onCheckedChange={() => handleArrayToggle('coverage', coverage)}
                    />
                    <Label htmlFor={`coverage-${coverage}`} className="text-sm">
                      {coverage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Compagnies */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Compagnies d'assurance</Label>
              <div className="grid grid-cols-1 gap-2">
                {companyOptions.map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Switch
                      id={`company-${company}`}
                      checked={localFilters.company.includes(company)}
                      onCheckedChange={() => handleArrayToggle('company', company)}
                    />
                    <Label htmlFor={`company-${company}`} className="text-sm">
                      {company}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Fonctionnalités requises</Label>
              <div className="grid grid-cols-2 gap-2">
                {featureOptions.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Switch
                      id={`feature-${feature}`}
                      checked={localFilters.features.includes(feature)}
                      onCheckedChange={() => handleArrayToggle('features', feature)}
                    />
                    <Label htmlFor={`feature-${feature}`} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tri */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Trier par</Label>
              <Select
                value={localFilters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score global</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Note client</SelectItem>
                  <SelectItem value="coverage">Couverture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recommandations uniquement */}
            <div className="flex items-center space-x-2">
              <Switch
                id="only-recommended"
                checked={localFilters.onlyRecommended}
                onCheckedChange={(checked) => handleFilterChange('onlyRecommended', checked)}
              />
              <Label htmlFor="only-recommended" className="text-sm">
                Afficher uniquement les recommandations IA
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
