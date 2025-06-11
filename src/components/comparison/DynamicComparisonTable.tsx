
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductWithCriteria } from '@/types/core/Product';

export interface DynamicComparisonTableProps {
  products: ProductWithCriteria[];
  selectedCountry: string;
}

export const DynamicComparisonTable: React.FC<DynamicComparisonTableProps> = ({
  products,
  selectedCountry
}) => {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Aucun produit sélectionné pour la comparaison</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison des produits - {selectedCountry}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b">Critère</th>
                {products.map((product) => (
                  <th key={product.id} className="text-left p-4 border-b">
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.brand}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b font-medium">Prix</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border-b">
                    <Badge variant="secondary">
                      {product.price} {product.currency}
                    </Badge>
                  </td>
                ))}
              </tr>
              {/* Add more comparison criteria here */}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
