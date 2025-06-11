
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  MapPin, 
  Clock, 
  Zap, 
  Heart, 
  ExternalLink, 
  Filter,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react';
import { SearchResult } from '@/types/search';
import { useState } from 'react';

interface ModernSearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTime: number;
  query: string;
}

export const ModernSearchResults: React.FC<ModernSearchResultsProps> = ({
  results,
  loading,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  searchTime,
  query
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating'>('relevance');

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const ResultCard: React.FC<{ result: SearchResult; index: number }> = ({ result, index }) => (
    <Card className="group overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <CardContent className="p-6">
        <div className={`${viewMode === 'grid' ? 'space-y-4' : 'flex gap-6'}`}>
          {/* Image */}
          <div className={`${viewMode === 'grid' ? 'aspect-video' : 'w-32 h-32'} relative overflow-hidden rounded-lg bg-gray-100`}>
            {result.image ? (
              <img
                src={result.image}
                alt={result.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brandBlue/20 to-purple-600/20">
                <span className="text-2xl">📦</span>
              </div>
            )}
            
            {/* Badge nouveau/populaire */}
            {index < 3 && (
              <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Populaire
              </Badge>
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1 space-y-3">
            {/* Titre et marque */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-brandBlue transition-colors line-clamp-2">
                {result.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{result.brand}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{result.category}</span>
              </div>
            </div>

            {/* Prix et rating */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-brandBlue">
                  {formatPrice(result.price, result.currency)}
                </div>
                {result.originalPrice && result.originalPrice > result.price && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(result.originalPrice, result.currency)}
                  </div>
                )}
              </div>

              <div className="text-right space-y-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{result.rating}</span>
                  <span className="text-sm text-gray-600">({result.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  {result.location}
                </div>
              </div>
            </div>

            {/* Badges et fonctionnalités */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {result.availability === 'available' ? '✅ Disponible' : '⏳ Stock limité'}
              </Badge>
              {result.deliveryTime && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {result.deliveryTime}
                </Badge>
              )}
              {result.provider.verified && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  ✓ Partenaire vérifié
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 bg-brandBlue hover:bg-brandBlue/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir détails
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Results skeleton */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête des résultats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {totalCount.toLocaleString()} résultats
            {query && (
              <span className="text-gray-600"> pour "{query}"</span>
            )}
          </h2>
          <p className="text-gray-600">
            Recherche effectuée en {searchTime}ms
          </p>
        </div>

        {/* Contrôles d'affichage */}
        <div className="flex items-center gap-4">
          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm"
          >
            <option value="relevance">Pertinence</option>
            <option value="price">Prix</option>
            <option value="rating">Note</option>
          </select>

          {/* Mode d'affichage */}
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {results.length === 0 ? (
        <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-white/20">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Essayez de modifier vos critères de recherche ou vos filtres pour obtenir plus de résultats.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {results.map((result, index) => (
            <ResultCard key={result.id} result={result} index={index} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="bg-white/80 backdrop-blur-sm border-white/20"
          >
            Précédent
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (page > totalPages) return null;
            
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => onPageChange(page)}
                className={currentPage === page ? 'bg-brandBlue' : 'bg-white/80 backdrop-blur-sm border-white/20'}
              >
                {page}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="bg-white/80 backdrop-blur-sm border-white/20"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};
