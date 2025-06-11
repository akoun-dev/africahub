
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ContentSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    sector: string;
    status: string;
  };
  onFiltersChange: (filters: { sector: string; status: string }) => void;
}

export const ContentSearchFilters: React.FC<ContentSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange
}) => {
  return (
    <Card className="bg-white border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-gray-900">Recherche et filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans le contenu..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-brandBlue"
              />
            </div>
          </div>
          <Select 
            value={filters.sector || "all"} 
            onValueChange={(value) => onFiltersChange({...filters, sector: value === "all" ? "" : value})}
          >
            <SelectTrigger className="w-48 bg-white border-gray-300">
              <SelectValue placeholder="Secteur" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg">
              <SelectItem value="all">Tous les secteurs</SelectItem>
              <SelectItem value="banque">Banque</SelectItem>
              <SelectItem value="assurance">Assurance</SelectItem>
              <SelectItem value="sante">Santé</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={filters.status || "all"} 
            onValueChange={(value) => onFiltersChange({...filters, status: value === "all" ? "" : value})}
          >
            <SelectTrigger className="w-48 bg-white border-gray-300">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
