
import { useQuery } from '@tanstack/react-query';
import { SectorService } from '@/services/sector.service';
import { useToast } from '@/hooks/use-toast';
import type { SectorRow } from '@/repositories/sector.repository';

export interface UseSectorReturn {
  data: SectorRow | null;
  isLoading: boolean;
  error: string | null;
  isFromCache: boolean;
  refreshData: () => Promise<void>;
}

export const useSector = (slug: string | undefined): UseSectorReturn => {
  const { toast } = useToast();

  const {
    data,
    isLoading,
    error,
    refetch,
    isStale
  } = useQuery({
    queryKey: ['sector', slug],
    queryFn: () => SectorService.getSectorBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error(`Erreur lors du chargement du secteur ${slug}:`, error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le secteur",
          variant: "destructive"
        });
      }
    }
  });

  const refreshData = async () => {
    await refetch();
  };

  return {
    data: data || null,
    isLoading,
    error: error?.message || null,
    isFromCache: !isStale,
    refreshData
  };
};
