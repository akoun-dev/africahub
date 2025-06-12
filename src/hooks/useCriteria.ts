
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCriteria = (productTypeSlug: string) => {
  return useQuery({
    queryKey: ['sector-criteria', productTypeSlug],
    queryFn: async () => {
      // For now, return mock criteria data since the criteria table doesn't exist in Supabase
      return [
        {
          key: 'coverage',
          name: 'Couverture',
          type: 'text'
        },
        {
          key: 'price',
          name: 'Prix',
          type: 'number'
        },
        {
          key: 'deductible',
          name: 'Franchise',
          type: 'number'
        }
      ];
    },
    enabled: !!productTypeSlug
  });
};
