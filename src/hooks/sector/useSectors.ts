
import { useQuery } from '@tanstack/react-query';
import { SectorService } from '@/services/sector.service';
import { useToast } from '@/hooks/use-toast';
import type { SectorRow } from '@/repositories/sector.repository';

export interface UseSectorsReturn {
  data: SectorRow[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSectors = (): UseSectorsReturn => {
  const { toast } = useToast();

  const {
    data,
    isLoading,
    error,
    refetch: queryRefetch
  } = useQuery({
    queryKey: ['sectors'],
    queryFn: SectorService.getAllSectors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Erreur lors du chargement des secteurs:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les secteurs",
          variant: "destructive"
        });
      }
    }
  });

  const refetch = async () => {
    await queryRefetch();
  };

  return {
    data: data || null,
    isLoading,
    error: error?.message || null,
    refetch
  };
};
