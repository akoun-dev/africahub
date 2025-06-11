
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Company } from '@/types';

export const useCompanies = (sectorSlug?: string) => {
  return useQuery({
    queryKey: ['companies', sectorSlug],
    queryFn: async () => {
      let query = supabase
        .from('companies')
        .select('*')
        .eq('is_active', true);

      if (sectorSlug) {
        query = query.contains('sectors', [sectorSlug]);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      return data as Company[];
    }
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as Company;
    },
    enabled: !!id
  });
};
