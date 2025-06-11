
import { useQuery } from '@tanstack/react-query';

export interface SectorConfiguration {
  id: string;
  sector_id: string;
  theme_colors: any;
  custom_fields: any;
  email_templates: any;
  page_content: any;
  created_at: string;
  updated_at: string;
}

export const useSectorConfiguration = (sectorId?: string) => {
  return useQuery({
    queryKey: ['sector-configuration', sectorId],
    queryFn: async (): Promise<SectorConfiguration | null> => {
      if (!sectorId) return null;
      
      // Mock data since sector_configurations table doesn't exist yet
      const mockConfig: SectorConfiguration = {
        id: `config-${sectorId}`,
        sector_id: sectorId,
        theme_colors: { primary: '#3B82F6', secondary: '#10B981' },
        custom_fields: {},
        email_templates: {},
        page_content: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockConfig;
    },
    enabled: !!sectorId,
  });
};
