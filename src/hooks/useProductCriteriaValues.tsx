
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductCriteriaValue {
  id: string;
  product_id: string;
  criteria_id: string;
  value: string;
  created_at: string;
}

export const useProductCriteriaValues = (productIds?: string[]) => {
  return useQuery({
    queryKey: ['product-criteria-values', productIds],
    queryFn: async () => {
      let query = supabase
        .from('product_criteria_values')
        .select(`
          *,
          comparison_criteria(name, data_type, unit)
        `);
      
      if (productIds && productIds.length > 0) {
        query = query.in('product_id', productIds);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as (ProductCriteriaValue & { 
        comparison_criteria: { 
          name: string; 
          data_type: string; 
          unit?: string; 
        } 
      })[];
    },
    enabled: !!productIds && productIds.length > 0,
  });
};
