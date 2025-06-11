
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, Calendar as CalendarIcon, Download, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface AdvancedFilters {
  searchTerm: string;
  contentType: string;
  status: string;
  sector: string;
  language: string;
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  itemsPerPage: number;
}

interface AdvancedContentFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onExport: (format: 'csv' | 'json') => void;
  totalItems: number;
  currentPage: number;
}

export const AdvancedContentFilters: React.FC<AdvancedContentFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  totalItems,
  currentPage
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      searchTerm: '',
      contentType: '',
      status: '',
      sector: '',
      language: 'fr',
      sortBy: 'updated_at',
      sortOrder: 'desc',
      itemsPerPage: 10
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.contentType) count++;
    if (filters.status) count++;
    if (filters.sector) count++;
    if (filters.createdAfter || filters.createdBefore) count++;
    if (filters.updatedAfter || filters.updatedBefore) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche et filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Masquer' : 'Avancé'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans le titre, contenu, clé..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2">
          <Select 
            value={filters.status} 
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.contentType} 
            onValueChange={(value) => updateFilter('contentType', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="text">Texte</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.sector} 
            onValueChange={(value) => updateFilter('sector', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les secteurs</SelectItem>
              <SelectItem value="banque">Banque</SelectItem>
              <SelectItem value="assurance">Assurance</SelectItem>
              <SelectItem value="sante">Santé</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.language} 
            onValueChange={(value) => updateFilter('language', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les langues</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium">Filtres avancés</h4>
            
            {/* Dates de création */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Créé après</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.createdAfter ? format(filters.createdAfter, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.createdAfter}
                      onSelect={(date) => updateFilter('createdAfter', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Créé avant</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.createdBefore ? format(filters.createdBefore, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.createdBefore}
                      onSelect={(date) => updateFilter('createdBefore', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Dates de modification */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Modifié après</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.updatedAfter ? format(filters.updatedAfter, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.updatedAfter}
                      onSelect={(date) => updateFilter('updatedAfter', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Modifié avant</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.updatedBefore ? format(filters.updatedBefore, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.updatedBefore}
                      onSelect={(date) => updateFilter('updatedBefore', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* Tri et pagination */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Trier par:</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => updateFilter('sortBy', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Date modif.</SelectItem>
                <SelectItem value="created_at">Date création</SelectItem>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="content_key">Clé</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.sortOrder} 
              onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Décroissant</SelectItem>
                <SelectItem value="asc">Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label>Par page:</Label>
            <Select 
              value={filters.itemsPerPage.toString()} 
              onValueChange={(value) => updateFilter('itemsPerPage', parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">
              {totalItems} résultat{totalItems > 1 ? 's' : ''}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('json')}
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {filters.searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Recherche: "{filters.searchTerm}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('searchTerm', '')}
                />
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Statut: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('status', '')}
                />
              </Badge>
            )}
            {filters.contentType && (
              <Badge variant="secondary" className="gap-1">
                Type: {filters.contentType}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('contentType', '')}
                />
              </Badge>
            )}
            {filters.sector && (
              <Badge variant="secondary" className="gap-1">
                Secteur: {filters.sector}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('sector', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
