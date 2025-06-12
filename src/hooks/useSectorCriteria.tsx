
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SectorCriterion {
  id: string;
  sector_id: string;
  name: string;
  data_type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  unit?: string;
  options?: string[];
  is_required: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

interface UseSectorCriteriaReturn extends LoadingState {
  data: SectorCriterion[] | null;
  refetch: () => Promise<void>;
}

export const useSectorCriteria = (sectorId: string | undefined): UseSectorCriteriaReturn => {
  const [data, setData] = useState<SectorCriterion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSectorCriteria = async () => {
    if (!sectorId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data: criteriaData, error: fetchError } = await supabase
        .from('sector_criteria')
        .select('*')
        .eq('sector_id', sectorId)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      
      // Transform data to ensure proper types
      const transformedData: SectorCriterion[] = (criteriaData || []).map(item => ({
        ...item,
        data_type: item.data_type as SectorCriterion['data_type'],
        options: item.options || [],
        is_required: item.is_required || false,
        display_order: item.display_order || 0
      }));
      
      setData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching sector criteria:', err);
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: "Impossible de charger les critères du secteur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectorCriteria();
  }, [sectorId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSectorCriteria
  };
};
