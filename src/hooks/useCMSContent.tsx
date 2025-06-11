
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsMicroservice, CMSContent } from '@/services/microservices/CMSMicroservice';
import { useCountry } from '@/contexts/CountryContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface UseCMSContentOptions {
  country?: string;
  sector?: string;
  language?: string;
  fallbackToSupabase?: boolean;
}

// Simple logger fallback if logger utility doesn't exist
const safeLogger = {
  error: (message: string, error?: any) => {
    console.error(message, error);
  }
};

export const useCMSContent = (contentKey: string, options: UseCMSContentOptions = {}) => {
  const { language, country } = useCountry();
  const queryClient = useQueryClient();

  const {
    country: optionCountry,
    sector,
    language: optionLanguage,
    fallbackToSupabase = true
  } = options;

  const finalCountry = optionCountry || country?.code;
  const finalLanguage = optionLanguage || language;

  return useQuery({
    queryKey: ['cms-content', contentKey, finalCountry, sector, finalLanguage],
    queryFn: async () => {
      // Try CMS microservice first
      let content = await cmsMicroservice.getContent(contentKey, {
        country: finalCountry,
        sector,
        language: finalLanguage
      });

      // Fallback to Supabase if CMS fails and fallback is enabled
      if (!content && fallbackToSupabase) {
        try {
          const { data: supabaseContent, error } = await supabase
            .from('localized_content')
            .select('*')
            .eq('content_key', contentKey)
            .or(`country_code.eq.${finalCountry},country_code.is.null`)
            .eq('language_code', finalLanguage)
            .order('country_code', { ascending: false, nullsFirst: false })
            .limit(1)
            .maybeSingle();

          if (error) {
            safeLogger.error('Supabase fallback failed:', error);
          } else if (supabaseContent) {
            // Transform Supabase data to CMS format with proper type handling
            content = {
              id: supabaseContent.id,
              content_key: supabaseContent.content_key,
              content_type: 'text',
              title: supabaseContent.title,
              content: supabaseContent.content || '',
              metadata: typeof supabaseContent.metadata === 'object' && supabaseContent.metadata !== null 
                ? supabaseContent.metadata as Record<string, any>
                : {},
              country_code: supabaseContent.country_code,
              sector_slug: sector,
              language_code: supabaseContent.language_code,
              status: 'published' as const,
              version: 1,
              created_at: supabaseContent.created_at,
              updated_at: supabaseContent.updated_at
            };
          }
        } catch (error) {
          safeLogger.error('Supabase fallback error:', error);
        }
      }

      return content;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors
      return failureCount < 2 && !error.message.includes('404');
    }
  });
};

export const useCMSContentList = (filters: {
  country?: string;
  sector?: string;
  language?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) => {
  const { language, country } = useCountry();

  const finalFilters = {
    ...filters,
    country: filters.country || country?.code,
    language: filters.language || language
  };

  return useQuery({
    queryKey: ['cms-content-list', finalFilters],
    queryFn: () => cmsMicroservice.getAllContent(finalFilters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateCMSContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentData: Partial<CMSContent>) => 
      cmsMicroservice.createContent(contentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
      queryClient.invalidateQueries({ queryKey: ['cms-content-list'] });
    }
  });
};

export const useUpdateCMSContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CMSContent> }) =>
      cmsMicroservice.updateContent(id, updates),
    onSuccess: (data, variables) => {
      if (data) {
        queryClient.setQueryData(
          ['cms-content', data.content_key, data.country_code, data.sector_slug, data.language_code],
          data
        );
      }
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
      queryClient.invalidateQueries({ queryKey: ['cms-content-list'] });
    }
  });
};

export const useDeleteCMSContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cmsMicroservice.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
      queryClient.invalidateQueries({ queryKey: ['cms-content-list'] });
    }
  });
};

export const usePublishCMSContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cmsMicroservice.publishContent(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(
          ['cms-content', data.content_key, data.country_code, data.sector_slug, data.language_code],
          data
        );
      }
      queryClient.invalidateQueries({ queryKey: ['cms-content'] });
      queryClient.invalidateQueries({ queryKey: ['cms-content-list'] });
    }
  });
};

export const useInvalidateCMSCache = () => {
  return useMutation({
    mutationFn: (pattern: string) => cmsMicroservice.invalidateCache(pattern)
  });
};
