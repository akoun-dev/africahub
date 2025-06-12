
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SectorProduct {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  currency: string;
  image_url?: string;
  purchase_link?: string;
  country_availability: string[];
  company?: {
    name: string;
    slug: string;
  };
  criteria_values: Array<{
    criteria_id: string;
    value: string;
    comparison_criteria: {
      name: string;
      data_type: string;
      unit?: string;
    };
  }>;
}

export const useSectorProducts = (sectorSlug: string, countryCode?: string) => {
  return useQuery({
    queryKey: ['sector-products', sectorSlug, countryCode],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          companies!inner(name, slug),
          product_types!inner(
            sectors!inner(slug)
          ),
          product_criteria_values(
            criteria_id,
            value,
            comparison_criteria(name, data_type, unit)
          )
        `)
        .eq('is_active', true)
        .eq('product_types.sectors.slug', sectorSlug);

      if (countryCode) {
        query = query.contains('country_availability', [countryCode]);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(product => ({
        ...product,
        company: product.companies,
        criteria_values: product.product_criteria_values || []
      })) as SectorProduct[];
    },
    enabled: !!sectorSlug,
  });
};
