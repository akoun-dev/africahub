
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/core/Product';

interface RelatedProductsProps {
  currentProductId: string;
  productTypeId?: string;
  limit?: number;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  productTypeId,
  limit = 4
}) => {
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ['related-products', currentProductId, productTypeId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          companies (
            name,
            logo_url
          ),
          product_types (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .neq('id', currentProductId)
        .limit(limit);

      if (productTypeId) {
        query = query.eq('product_type_id', productTypeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!currentProductId
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Produits similaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, index) => (
            <ProductCard
              key={index}
              product={{} as Product}
              isLoading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produits similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aucun produit similaire trouvé pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Produits similaires
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};
