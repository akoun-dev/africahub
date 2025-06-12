
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PlatformConfig {
  id?: string;
  platform_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  default_language: string;
  default_currency: string;
  contact_email?: string;
  support_phone?: string;
  maintenance_mode: boolean;
  email_templates: Record<string, any>;
  social_media_links: Record<string, any>;
  seo_settings: Record<string, any>;
}

export const usePlatformConfig = () => {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfig = async () => {
    try {
      // Pour l'instant, utiliser une configuration par défaut
      // jusqu'à ce que la table platform_configuration soit créée
      const defaultConfig: PlatformConfig = {
        platform_name: 'AfricaHub',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        default_language: 'fr',
        default_currency: 'XOF',
        maintenance_mode: false,
        email_templates: {},
        social_media_links: {},
        seo_settings: {}
      };
      
      setConfig(defaultConfig);
    } catch (error) {
      console.error('Error fetching platform config:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la configuration de la plateforme",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<PlatformConfig>) => {
    try {
      setLoading(true);
      
      // Simuler la mise à jour pour l'instant
      setConfig(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Succès",
        description: "Configuration mise à jour avec succès"
      });

      return config;
    } catch (error) {
      console.error('Error updating platform config:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateConfig,
    refetch: fetchConfig
  };
};
