
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/services/SearchService';
import { SimilaritySearchService } from '@/services/SimilaritySearchService';
import { Star, Eye, TrendingUp, Loader2 } from 'lucide-react';

interface SimilarProductsWidgetProps {
  productId: string;
  sector?: string;
  onProductClick: (productId: string) => void;
  onCompareClick: (productId: string) => void;
}

export const SimilarProductsWidget: React.FC<SimilarProductsWidgetProps> = ({
  productId,
  sector,
  onProductClick,
  onCompareClick
}) => {
  const [similarProducts, setSimilarProducts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const similar = await SimilaritySearchService.findSimilarProducts(
          productId,
          5,
          sector
        );
        setSimilarProducts(similar);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId, sector]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Produits similaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Recherche de produits similaires...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Produits similaires
          <Badge variant="secondary" className="ml-2">
            {similarProducts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Image du produit */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Eye className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Informations du produit */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{product.brand}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-brandBlue">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.provider.name}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => onProductClick(product.id)}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Voir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCompareClick(product.id)}
                  className="text-xs"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Comparer
                </Button>
              </div>
            </div>
          ))}
        </div>

        {similarProducts.length >= 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              Voir plus de produits similaires
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
