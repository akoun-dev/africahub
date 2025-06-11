
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { PricingAlgorithm } from '@/types/pricing';

export const usePricingAlgorithms = () => {
  return useQuery({
    queryKey: ['pricing-algorithms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_algorithms')
        .select(`
          *,
          companies (
            name,
            logo_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (PricingAlgorithm & { companies?: { name: string; logo_url?: string } })[];
    }
  });
};

export const useCreatePricingAlgorithm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (algorithmData: Omit<PricingAlgorithm, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pricing_algorithms')
        .insert([algorithmData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-algorithms'] });
      toast.success('Algorithme de pricing créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating pricing algorithm:', error);
      toast.error('Erreur lors de la création de l\'algorithme');
    }
  });
};

export const useUpdatePricingAlgorithm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<PricingAlgorithm>) => {
      const { data, error } = await supabase
        .from('pricing_algorithms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-algorithms'] });
      toast.success('Algorithme mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating pricing algorithm:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  });
};
