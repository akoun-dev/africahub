
import React from 'react';
import { useProductComparisons } from '@/hooks/useProductComparisons';
import { useCriteria } from '@/hooks/useCriteria';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';

interface SectorComparisonTableProps {
  productTypeSlug: string;
  selectedCountry: string;
}

export const SectorComparisonTable: React.FC<SectorComparisonTableProps> = ({
  productTypeSlug,
  selectedCountry
}) => {
  const { data: products, isLoading: productsLoading } = useProductComparisons(
    productTypeSlug,
    selectedCountry
  );
  const { data: criteria, isLoading: criteriaLoading } = useCriteria(productTypeSlug);

  if (productsLoading || criteriaLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h3 className="text-lg font-semibold mb-2">Aucun produit disponible</h3>
          <p className="text-gray-600">
            Aucun produit n'est actuellement disponible pour ce secteur dans votre pays.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.provider}</p>
                </div>
                <Badge variant="outline">Disponible</Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Product criteria */}
              <div className="space-y-2">
                {criteria?.map((criterion) => {
                  const value = product.criteria?.[criterion.key];
                  if (!value) return null;
                  
                  return (
                    <div key={criterion.key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{criterion.name}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action button */}
              <div className="pt-4 border-t">
                <Button className="w-full" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir les détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectorComparisonTable;
