
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SectorService } from '@/services/sector.service';
import { useToast } from '@/hooks/use-toast';
import type { SectorRow } from '@/repositories/sector.repository';

export const useSectorMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSector = useMutation({
    mutationFn: SectorService.createSector,
    onSuccess: (newSector: SectorRow) => {
      // Invalider et refetch les secteurs
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      
      // Ajouter le nouveau secteur au cache
      queryClient.setQueryData(['sector', newSector.slug], newSector);
      
      toast({
        title: "Succès",
        description: "Secteur créé avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateSector = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: unknown }) => 
      SectorService.updateSector(id, updates),
    onSuccess: (updatedSector: SectorRow) => {
      // Invalider et refetch les secteurs
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      
      // Mettre à jour le secteur dans le cache
      queryClient.setQueryData(['sector', updatedSector.slug], updatedSector);
      
      toast({
        title: "Succès",
        description: "Secteur mis à jour avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteSector = useMutation({
    mutationFn: SectorService.deleteSector,
    onSuccess: () => {
      // Invalider tous les caches liés aux secteurs
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
      queryClient.invalidateQueries({ queryKey: ['sector'] });
      
      toast({
        title: "Succès",
        description: "Secteur supprimé avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    createSector,
    updateSector,
    deleteSector
  };
};
