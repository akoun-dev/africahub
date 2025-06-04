
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { UserPreference } from '@/types';

interface LLMPreferencesData {
  preferred_strategy: string;
  preferred_provider: string;
  cost_threshold: number;
  max_latency_ms: number;
}

export const useUserLLMPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const preferences = useQuery({
    queryKey: ['user-llm-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .eq('insurance_type', 'general')
        .maybeSingle();

      if (error) throw error;
      return data as UserPreference | null;
    },
    enabled: !!user
  });

  const updatePreferences = useMutation({
    mutationFn: async (data: LLMPreferencesData) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          insurance_type: 'general',
          ...data
        }, {
          onConflict: 'user_id,insurance_type'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-llm-preferences'] });
    }
  });

  return {
    preferences: preferences.data,
    updatePreferences
  };
};

export const useLLMProviderStatus = () => {
  return useQuery({
    queryKey: ['llm-provider-status'],
    queryFn: async () => {
      // Mock data for provider status
      return {
        openai: { available: true, latency: 150 },
        anthropic: { available: true, latency: 200 },
        deepseek: { available: true, latency: 300 },
        qwen: { available: true, latency: 250 }
      };
    }
  });
};
