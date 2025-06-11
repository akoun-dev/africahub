
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DynamicPriceDisplay } from '@/components/pricing/DynamicPriceDisplay';
import { ExternalLink, BarChart3 } from 'lucide-react';
import type { ProductWithCriteria } from '@/types/core/Product';

interface EnhancedComparisonTableProps {
  products: ProductWithCriteria[];
  userCriteria?: Record<string, any>;
  onProductSelect?: (productId: string) => void;
}

export const EnhancedComparisonTable: React.FC<EnhancedComparisonTableProps> = ({
  products,
  userCriteria = {},
  onProductSelect
}) => {
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, { price: number; currency: string }>>({});

  const handlePriceCalculated = (productId: string, price: number, currency: string) => {
    setCalculatedPrices(prev => ({
      ...prev,
      [productId]: { price, currency }
    }));
  };

  const getDisplayPrice = (product: ProductWithCriteria) => {
    if (product.pricing_type === 'fixed') {
      return product.price ? `${product.price} ${product.currency || 'XOF'}` : 'N/A';
    }
    
    const calculated = calculatedPrices[product.id];
    return calculated ? `${calculated.price} ${calculated.currency}` : 'À calculer';
  };

  const formatCriteriaValue = (product: ProductWithCriteria, criteriaName: string) => {
    const criteriaValue = product.criteria_values?.find(
      cv => cv.comparison_criteria.name === criteriaName
    );
    
    if (!criteriaValue) return 'N/A';
    
    const { value } = criteriaValue;
    const { data_type, unit } = criteriaValue.comparison_criteria;
    
    if (data_type === 'boolean') {
      return value === 'true' ? '✅ Oui' : '❌ Non';
    }
    
    if (data_type === 'number' && unit) {
      return `${value} ${unit}`;
    }
    
    return value;
  };

  // Obtenir tous les critères uniques
  const allCriteria = products.reduce((acc, product) => {
    product.criteria_values?.forEach(cv => {
      const criteriaName = cv.comparison_criteria.name;
      if (!acc.find(c => c.name === criteriaName)) {
        acc.push(cv.comparison_criteria);
      }
    });
    return acc;
  }, [] as Array<{ name: string; data_type: string; unit?: string }>);

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Aucun produit à comparer</h3>
          <p className="text-gray-600">Sélectionnez des produits pour commencer la comparaison</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Comparaison détaillée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold min-w-[150px]">Caractéristiques</th>
                {products.map(product => (
                  <th key={product.id} className="text-center p-4 font-semibold min-w-[200px]">
                    <div className="space-y-2">
                      <div className="font-bold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.brand}</div>
                      <Badge variant="outline" className="text-xs">
                        {product.companies?.name}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Ligne du prix */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">Prix</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center">
                    <DynamicPriceDisplay
                      product={product}
                      userCriteria={userCriteria}
                      autoCalculate={true}
                      onPriceCalculated={(price, currency) => 
                        handlePriceCalculated(product.id, price, currency)
                      }
                    />
                  </td>
                ))}
              </tr>

              {/* Lignes des critères */}
              {allCriteria.map(criteria => (
                <tr key={criteria.name} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{criteria.name}</td>
                  {products.map(product => (
                    <td key={product.id} className="p-4 text-center">
                      {formatCriteriaValue(product, criteria.name)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Ligne des actions */}
              <tr className="bg-gray-50">
                <td className="p-4 font-medium">Actions</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center space-y-2">
                    {product.purchase_link ? (
                      <Button size="sm" asChild className="w-full">
                        <a href={product.purchase_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir l'offre
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => onProductSelect?.(product.id)}
                      >
                        Demander un devis
                      </Button>
                    )}
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
