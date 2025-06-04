
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductWithSectorCriteria {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  currency: string;
  company_id: string;
  product_type_id: string;
  country_availability: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  purchase_link?: string;
  sector_slug: string;
  sector_name: string;
  sector_color: string;
  sector_criteria_values: Array<{
    criteria_id: string;
    criteria_name: string;
    criteria_type: string;
    criteria_unit?: string;
    value: string;
  }>;
}

export const useProductsWithSectorCriteria = (sectorSlug?: string) => {
  return useQuery({
    queryKey: ['products-with-sector-criteria', sectorSlug],
    queryFn: async () => {
      // Get products with their sector information
      let productsQuery = supabase
        .from('products')
        .select(`
          *,
          product_types!inner(
            id,
            name,
            slug,
            sectors!inner(
              id,
              name,
              slug,
              color
            )
          ),
          product_sector_criteria_values(
            value,
            sector_criteria(
              id,
              name,
              data_type,
              unit
            )
          )
        `)
        .eq('is_active', true);

      // Filter by sector if provided
      if (sectorSlug) {
        productsQuery = productsQuery.eq('product_types.sectors.slug', sectorSlug);
      }

      const { data: products, error } = await productsQuery;
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: ProductWithSectorCriteria[] = (products || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        description: product.description || '',
        price: product.price || 0,
        currency: product.currency || 'USD',
        company_id: product.company_id,
        product_type_id: product.product_type_id,
        country_availability: product.country_availability || [],
        is_active: product.is_active,
        created_at: product.created_at,
        updated_at: product.updated_at,
        image_url: product.image_url,
        purchase_link: product.purchase_link,
        sector_slug: product.product_types?.sectors?.slug || '',
        sector_name: product.product_types?.sectors?.name || '',
        sector_color: product.product_types?.sectors?.color || '#3B82F6',
        sector_criteria_values: (product.product_sector_criteria_values || []).map((cv: any) => ({
          criteria_id: cv.sector_criteria?.id || '',
          criteria_name: cv.sector_criteria?.name || '',
          criteria_type: cv.sector_criteria?.data_type || 'text',
          criteria_unit: cv.sector_criteria?.unit,
          value: cv.value || ''
        }))
      }));
      
      return transformedData;
    },
    enabled: !!sectorSlug,
  });
};
