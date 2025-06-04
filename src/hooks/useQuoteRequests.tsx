
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

// Types from Supabase
type SupabaseQuoteRequest = Database['public']['Tables']['quote_requests']['Row'];
type SupabaseQuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert'];
type SupabaseQuoteRequestUpdate = Database['public']['Tables']['quote_requests']['Update'];

export interface QuoteRequest extends SupabaseQuoteRequest {
  quote_amount?: number;
  quote_details?: any;
}

export const useQuoteRequests = (status?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['quote-requests', user?.id, status],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('quote_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as QuoteRequest[];
    },
    enabled: !!user,
  });
};

export const useAllQuoteRequests = () => {
  return useQuery({
    queryKey: ['all-quote-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuoteRequest[];
    },
  });
};

export const useCreateQuoteRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (quoteData: Omit<SupabaseQuoteRequestInsert, 'user_id'>) => {
      // Map insurance_type to sector_slug if not provided
      const requestData: SupabaseQuoteRequestInsert = {
        ...quoteData,
        user_id: user?.id,
        sector_slug: quoteData.sector_slug || quoteData.insurance_type, // Fallback mapping
      };

      const { data, error } = await supabase
        .from('quote_requests')
        .insert([requestData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Automatically trigger notification system
      try {
        await supabase.functions.invoke('send-quote-notification', {
          body: { quoteRequest: data },
        });
        console.log("Notification email sent successfully");
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Don't throw error here to avoid blocking quote creation
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-requests'] });
      queryClient.invalidateQueries({ queryKey: ['all-quote-requests'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUpdateQuoteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SupabaseQuoteRequestUpdate }) => {
      const { data, error } = await supabase
        .from('quote_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-requests'] });
      queryClient.invalidateQueries({ queryKey: ['all-quote-requests'] });
    },
  });
};
