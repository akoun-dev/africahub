
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Types from Supabase
type SupabaseProduct = Database['public']['Tables']['products']['Row'];
type SupabaseProductInsert = Database['public']['Tables']['products']['Insert'];
type SupabaseProductUpdate = Database['public']['Tables']['products']['Update'];

// Extended Product interface for the UI
export interface Product extends SupabaseProduct {
  companies?: {
    name: string;
    logo_url?: string;
  };
  product_types?: {
    name: string;
    slug: string;
  };
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          companies (
            name,
            logo_url
          ),
          product_types (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: SupabaseProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error('Erreur lors de la création du produit');
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & SupabaseProductUpdate) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  });
};
