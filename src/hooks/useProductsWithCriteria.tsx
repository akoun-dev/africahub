
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ProductWithCriteria } from '@/types/core/Product';

export { type ProductWithCriteria };

export const useProductsWithCriteria = (sector?: string) => {
  return useQuery({
    queryKey: ['products-with-criteria', sector],
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
          ),
          product_criteria_values (
            value,
            comparison_criteria (
              name,
              data_type,
              unit
            )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sector) {
        query = query.eq('product_types.sectors.slug', sector);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match ProductWithCriteria interface
      const transformedData: ProductWithCriteria[] = (data || []).map(product => ({
        ...product,
        // Ensure all required fields are present with defaults
        benefits: product.benefits || [],
        exclusions: product.exclusions || [],
        pricing_type: (product.pricing_type as 'fixed' | 'calculated') || 'fixed',
        calculation_config: (product.calculation_config as Record<string, any>) || {},
        criteria_values: product.product_criteria_values?.map((pcv: any) => ({
          comparison_criteria: pcv.comparison_criteria,
          value: pcv.value
        })) || []
      }));

      return transformedData;
    }
  });
};
