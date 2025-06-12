
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserInteraction {
  product_id?: string;
  interaction_type: 'view' | 'click' | 'quote_request' | 'compare' | 'share' | 'save';
  session_id?: string;
  metadata?: any;
}

export const useTrackInteraction = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interaction: UserInteraction) => {
      const sessionId = interaction.session_id || sessionStorage.getItem('session_id') || crypto.randomUUID();
      
      // Store session ID for future use
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }

      const { data, error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: user?.id || crypto.randomUUID(),
          session_id: sessionId,
          product_id: interaction.product_id || null,
          interaction_type: interaction.interaction_type,
          metadata: interaction.metadata || {}
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-interactions'] });
    }
  });
};

export const useUserInteractions = () => {
  const trackInteraction = useTrackInteraction();
  
  return {
    trackInteraction: trackInteraction.mutate
  };
};

export const useBehavioralPatterns = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (patterns: {
      pattern_type: string;
      pattern_data: any;
      confidence_level: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Mock implementation since user_behavioral_patterns table doesn't exist
      console.log('Behavioral patterns would be saved:', patterns);
      return { success: true };
    }
  });
};
