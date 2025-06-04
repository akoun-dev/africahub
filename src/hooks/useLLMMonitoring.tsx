
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface LLMAlert {
  id: string;
  type: 'provider_down' | 'high_cost' | 'high_latency' | 'quality_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  provider?: string;
  threshold_value?: number;
  current_value?: number;
  created_at: string;
  is_resolved: boolean;
}

export const useLLMAlerts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['llm-alerts', user?.id],
    queryFn: async () => {
      // For now, simulate alerts since we don't have the alerts table yet
      const mockAlerts: LLMAlert[] = [
        {
          id: '1',
          type: 'provider_down',
          severity: 'high',
          message: 'Provider OpenAI: Latence élevée détectée (>3000ms)',
          provider: 'openai',
          threshold_value: 2000,
          current_value: 3200,
          created_at: new Date().toISOString(),
          is_resolved: false
        }
      ];

      // This would be the actual implementation
      // const { data, error } = await supabase
      //   .from('llm_alerts')
      //   .select('*')
      //   .eq('is_resolved', false)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      // return data as LLMAlert[];

      return mockAlerts;
    },
    refetchInterval: 30000, // Check every 30 seconds
    enabled: !!user
  });
};

export const useLLMOptimization = () => {
  const queryClient = useQueryClient();

  const optimizeRouting = useMutation({
    mutationFn: async () => {
      console.log('Optimizing LLM routing strategy...');
      
      // This would call an edge function to analyze usage patterns 
      // and adjust routing parameters automatically
      const { data, error } = await supabase.functions.invoke('optimize-llm-routing', {
        body: {
          action: 'auto_optimize',
          timeframe: '24h'
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Optimisation terminée",
        description: "Les paramètres de routage ont été optimisés automatiquement.",
      });
      queryClient.invalidateQueries({ queryKey: ['llm-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['user-llm-preferences'] });
    },
    onError: () => {
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser automatiquement les paramètres.",
        variant: "destructive",
      });
    }
  });

  const resetToDefaults = useMutation({
    mutationFn: async () => {
      console.log('Resetting LLM configuration to defaults...');
      
      const { data, error } = await supabase.functions.invoke('optimize-llm-routing', {
        body: {
          action: 'reset_defaults'
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Configuration réinitialisée",
        description: "Les paramètres ont été remis aux valeurs par défaut.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-llm-preferences'] });
    }
  });

  return {
    optimizeRouting,
    resetToDefaults
  };
};

export const useLLMHealthCheck = () => {
  return useQuery({
    queryKey: ['llm-health-check'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('multi-llm-router', {
        body: {
          message: 'Health check',
          sessionId: `health_${Date.now()}`,
          strategy: 'balanced',
          context: { type: 'health_check' }
        }
      });

      if (error) throw error;
      
      return {
        status: 'healthy',
        response_time: data.processing_time || 0,
        provider_used: data.provider,
        timestamp: new Date().toISOString()
      };
    },
    refetchInterval: 60000, // Health check every minute
    retry: 3
  });
};
