
import { useState, useEffect, useMemo } from 'react';

export interface ConfigurableContent {
  id: string;
  content_key: string;
  title: string;
  content: string;
  content_type: string;
  priority: number;
  is_active: boolean;
  metadata?: Record<string, any>;
  country_code?: string;
  language_code: string;
  created_at: string;
  updated_at: string;
}

// Contenu par défaut générique multi-sectoriel
const DEFAULT_CONTENT: Record<string, string> = {
  'platform.name': 'AfricaHub',
  'hero.main_title': 'Comparez et trouvez les meilleurs services en Afrique',
  'hero.subtitle': 'Notre plateforme intelligente vous aide à comparer les offres de services adaptées à votre profil et à votre pays dans tous les secteurs.',
  'hero.cta_primary': 'Comparer maintenant',
  'hero.cta_secondary': 'Recommandations IA',
  'hero.stat_companies_value': '500+',
  'hero.stat_companies_label': 'Entreprises partenaires',
  'hero.stat_countries_value': '25+',
  'hero.stat_countries_label': 'Pays couverts',
  'hero.stat_users_value': '250K+',
  'hero.stat_users_label': 'Utilisateurs actifs',
  'sectors.title': 'Explorez Nos Secteurs',
  'sectors.subtitle': 'Découvrez les meilleurs services dans chaque secteur à travers l\'Afrique',
  'features.service': 'Service',
  'features.description': 'Une solution complète adaptée à vos besoins spécifiques.',
  'features.price_from': 'À partir de ',
  'features.per_month': '/mois'
};

export const useConfigurableContent = (filters: {
  content_key?: string;
  country_code?: string;
  language_code?: string;
} = {}) => {
  const [data, setData] = useState<ConfigurableContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser useMemo pour stabiliser les filtres et éviter les re-rendus infinis
  const memoizedFilters = useMemo(() => filters, [
    filters.content_key,
    filters.country_code,
    filters.language_code
  ]);

  useEffect(() => {
    setIsLoading(false);
    setError(null);
    setData([]);
  }, [memoizedFilters]);

  const createContent = async (content: Partial<ConfigurableContent>) => {
    console.log('Creating content:', content);
    return null;
  };

  const updateContent = async (contentKey: string, content: string, options?: { title?: string }) => {
    console.log('Updating content:', contentKey, content, options);
    return true;
  };

  const deleteContent = async (id: string) => {
    console.log('Deleting content:', id);
    return null;
  };

  const getContent = (key: string, fallback?: string): string => {
    const item = data.find(item => item.content_key === key);
    if (item?.content) {
      return item.content;
    }
    
    // Utiliser le contenu par défaut générique au lieu du fallback
    if (DEFAULT_CONTENT[key]) {
      return DEFAULT_CONTENT[key];
    }
    
    return fallback || key;
  };

  return {
    data,
    contents: data,
    isLoading,
    loading: isLoading,
    error,
    createContent,
    updateContent,
    deleteContent,
    getContent,
    refetch: () => {}
  };
};
