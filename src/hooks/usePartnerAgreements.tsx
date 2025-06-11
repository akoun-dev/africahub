
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AgreementType = 'premium' | 'standard' | 'exclusive';
export type AgreementStatus = 'draft' | 'pending' | 'active' | 'expired' | 'terminated';

export interface PartnerAgreement {
  id: string;
  company_id: string;
  agreement_type: AgreementType;
  status: AgreementStatus;
  signature_date: string;
  start_date: string;
  end_date?: string;
  commission_rate?: number;
  revenue_share?: number;
  minimum_volume?: number;
  auto_activate?: boolean;
  country_code: string;
  sector_ids?: string[];
  product_type_ids?: string[];
  signed_by?: string;
  contract_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  companies?: {
    name: string;
    logo_url?: string;
  };
}

export const usePartnerAgreements = () => {
  return useQuery({
    queryKey: ['partner-agreements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_agreements')
        .select(`
          *,
          companies (
            name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = data?.map(item => ({
        ...item,
        agreement_type: item.agreement_type as AgreementType,
        status: item.status as AgreementStatus
      })) || [];
      
      return transformedData;
    }
  });
};

export const useCreateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agreementData: Omit<PartnerAgreement, 'id' | 'created_at' | 'updated_at' | 'companies'>) => {
      const { data, error } = await supabase
        .from('partner_agreements')
        .insert([agreementData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-agreements'] });
      toast.success('Accord créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating agreement:', error);
      toast.error('Erreur lors de la création de l\'accord');
    }
  });
};

export const useUpdateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<PartnerAgreement>) => {
      const { data, error } = await supabase
        .from('partner_agreements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-agreements'] });
      toast.success('Accord mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating agreement:', error);
      toast.error('Erreur lors de la mise à jour de l\'accord');
    }
  });
};
