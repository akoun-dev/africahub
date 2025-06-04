
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProductComparisons = (productTypeSlug: string, selectedCountry: string) => {
  return useQuery({
    queryKey: ['product-comparisons', productTypeSlug, selectedCountry],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          companies(name),
          product_criteria_values(
            value,
            comparison_criteria(name, data_type, unit)
          ),
          product_types!inner(
            slug,
            sectors!inner(slug)
          )
        `)
        .eq('is_active', true)
        .eq('product_types.sectors.slug', productTypeSlug)
        .contains('country_availability', [selectedCountry]);

      if (error) throw error;

      return data?.map(product => ({
        id: product.id,
        name: product.name,
        provider: product.companies?.name || 'Unknown Provider',
        price: product.price ? `${product.price} ${product.currency}` : 'N/A',
        criteria: product.product_criteria_values?.reduce((acc, cv) => ({
          ...acc,
          [cv.comparison_criteria.name]: cv.value
        }), {}) || {}
      })) || [];
    },
    enabled: !!productTypeSlug && !!selectedCountry
  });
};
