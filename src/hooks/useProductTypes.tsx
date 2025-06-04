
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sector_id?: string;
  created_at: string;
  updated_at: string;
}

interface UseProductTypesReturn {
  data: ProductType[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductTypes = (): UseProductTypesReturn => {
  const [data, setData] = useState<ProductType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductTypes = async () => {
    try {
      setError(null);
      const { data: productTypesData, error: fetchError } = await supabase
        .from('product_types')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      
      setData(productTypesData || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching product types:', err);
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de produits",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProductTypes
  };
};
