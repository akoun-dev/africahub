
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCountry } from '@/contexts/CountryContext';

export interface LocalizedContent {
  id: string;
  content_key: string;
  language_code: string;
  country_code?: string;
  title?: string;
  content?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const useLocalizedContent = (contentKey?: string, category?: string) => {
  const { language, country } = useCountry();

  return useQuery({
    queryKey: ['localized-content', contentKey, language, country?.code, category],
    queryFn: async () => {
      let query = supabase
        .from('localized_content')
        .select('*');

      if (contentKey) {
        query = query.eq('content_key', contentKey);
      }

      if (category) {
        query = query.contains('metadata', { category });
      }

      // Prioritize content for specific country, then language, then general
      query = query.or(`country_code.eq.${country?.code},country_code.is.null`)
        .eq('language_code', language)
        .order('country_code', { ascending: false, nullsFirst: false });

      const { data, error } = await query;
      
      if (error) throw error;
      return data as LocalizedContent[];
    },
    enabled: !!language,
  });
};

export const useInsuranceGuide = (sector: string) => {
  const { language, country } = useCountry();
  
  return useQuery({
    queryKey: ['insurance-guide', sector, language, country?.code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('localized_content')
        .select('*')
        .eq('content_key', `insurance_guide_${sector}`)
        .or(`country_code.eq.${country?.code},country_code.is.null`)
        .eq('language_code', language)
        .order('country_code', { ascending: false, nullsFirst: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as LocalizedContent | null;
    },
    enabled: !!sector && !!language,
  });
};
