
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  TrendingUp, 
  Package, 
  Heart,
  Eye,
  ShoppingCart,
  Verified
} from 'lucide-react';
import { SearchResult } from '@/services/SearchService';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewProduct: (productId: string) => void;
  onCompareProduct: (productId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onViewProduct,
  onCompareProduct
}) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'pre-order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Disponible';
      case 'limited': return 'Stock limité';
      case 'out_of_stock': return 'Rupture de stock';
      case 'pre-order': return 'Pré-commande';
      default: return 'Non disponible';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Essayez de modifier vos critères de recherche ou d'élargir vos filtres.
          </p>
          <Button variant="outline">
            Effacer les filtres
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Résultats */}
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="flex">
              {/* Image du produit */}
              <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Contenu principal */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {result.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{result.brand}</span>
                      <span>•</span>
                      <span>{result.category}</span>
                      {result.provider.verified && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Verified className="h-3 w-3" />
                            <span>Vérifié</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(result.price, result.currency)}
                    </div>
                    {result.originalPrice && result.originalPrice > result.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(result.originalPrice, result.currency)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Évaluation et localisation */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(result.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{result.rating}</span>
                    <span className="text-sm text-gray-600">
                      ({result.reviewCount} avis)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{result.location}</span>
                  </div>

                  <Badge className={getAvailabilityColor(result.availability)}>
                    {getAvailabilityText(result.availability)}
                  </Badge>
                </div>

                {/* Caractéristiques */}
                {result.features && result.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {result.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{result.features.length - 3} autres
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => onViewProduct(result.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => onCompareProduct(result.id)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Comparer
                  </Button>

                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>

                  {result.availability === 'available' && (
                    <Button variant="outline" size="icon">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Informations supplémentaires */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-gray-500">
                  <span>Fournisseur: {result.provider.name}</span>
                  {result.deliveryTime && (
                    <span>Livraison: {result.deliveryTime}</span>
                  )}
                  {result.warranty && (
                    <span>Garantie: {result.warranty}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Précédent
          </Button>
          
          <div className="flex gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = Math.max(1, currentPage - 2) + index;
              if (page > totalPages) return null;
              
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};
