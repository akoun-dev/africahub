
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComparisonCriteria {
  id: string;
  name: string;
  data_type: 'text' | 'number' | 'boolean' | 'select';
  unit?: string;
  options?: any;
  product_type_id: string;
  created_at: string;
  updated_at: string;
}

export const useComparisonCriteria = (productTypeId?: string) => {
  return useQuery({
    queryKey: ['comparison-criteria', productTypeId],
    queryFn: async () => {
      let query = supabase.from('comparison_criteria').select('*');
      
      if (productTypeId) {
        query = query.eq('product_type_id', productTypeId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as ComparisonCriteria[];
    },
    enabled: !!productTypeId,
  });
};
