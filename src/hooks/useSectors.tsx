
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Sector, LoadingState } from '@/types';

interface UseSectorsReturn extends LoadingState {
  data: Sector[] | null;
  refetch: () => Promise<void>;
}

interface UseSectorReturn extends LoadingState {
  data: Sector | null;
  refetch: () => Promise<void>;
}

export const useSectors = (): UseSectorsReturn => {
  const [data, setData] = useState<Sector[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSectors = async () => {
    try {
      setError(null);
      const { data: sectorsData, error: fetchError } = await supabase
        .from('sectors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      
      setData(sectorsData || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching sectors:', err);
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "Impossible de charger les secteurs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSectors
  };
};

export const useSector = (slug: string | undefined): UseSectorReturn => {
  const [data, setData] = useState<Sector | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSector = async () => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data: sectorData, error: fetchError } = await supabase
        .from('sectors')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (fetchError) throw fetchError;
      
      setData(sectorData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching sector:', err);
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "Impossible de charger le secteur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSector();
  }, [slug]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSector
  };
};

// Export explicite du type pour les autres composants
export type { Sector } from '@/types';
