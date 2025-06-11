
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';

interface DynamicComparisonTableProps {
  productIds: string[];
}

export const DynamicComparisonTable: React.FC<DynamicComparisonTableProps> = ({ productIds }) => {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const selectedProducts = products?.filter(product => productIds.includes(product.id)) || [];

  if (selectedProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Aucun produit sélectionné pour la comparaison</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison des produits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b">Caractéristique</th>
                {selectedProducts.map(product => (
                  <th key={product.id} className="text-left p-4 border-b">
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b font-medium">Prix</td>
                {selectedProducts.map(product => (
                  <td key={product.id} className="p-4 border-b">
                    {product.price ? `${product.price} ${product.currency || 'XOF'}` : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Marque</td>
                {selectedProducts.map(product => (
                  <td key={product.id} className="p-4 border-b">
                    <Badge variant="outline">{product.brand || 'N/A'}</Badge>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Catégorie</td>
                {selectedProducts.map(product => (
                  <td key={product.id} className="p-4 border-b">
                    <Badge>{product.category}</Badge>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
