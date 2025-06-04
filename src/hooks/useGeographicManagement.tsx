
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CountryConfiguration {
  id: string;
  country_code: string;
  country_name: string;
  region: string;
  is_active: boolean;
  currency_code: string;
  timezone: string;
  language_code: string;
  pricing_zone: string;
  date_format: string;
  number_format: string;
  regulatory_requirements: Record<string, any>;
  commission_rates: Record<string, any>;
  email_templates: Record<string, any>;
  form_configurations: Record<string, any>;
  supported_languages: string[];
  created_at: string;
  updated_at: string;
}

export interface GeographicPerformanceData {
  country_code: string;
  total_requests: number;
  completed_requests: number;
  average_quote_amount: number;
  conversion_rate: number;
  user_satisfaction_score: number;
  period_start: string;
  period_end: string;
}

export interface GeographicAlert {
  id: string;
  country_code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  alert_type: string;
  threshold_value?: string;
  current_value?: string;
  created_at: string;
  resolved_at?: string;
}

export interface PricingZone {
  id: string;
  zone_name: string;
  zone_code: string;
  description?: string;
  base_multiplier: number;
  countries: string[];
  currency_adjustments: Record<string, number>;
  is_active: boolean;
}

export const useCountryConfigurations = () => {
  return useQuery({
    queryKey: ['country-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geographic_configurations')
        .select('*')
        .order('country_name');

      if (error) throw error;
      return data as CountryConfiguration[];
    }
  });
};

export const useCreateCountryConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Omit<CountryConfiguration, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('geographic_configurations')
        .insert([config])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-configurations'] });
      toast.success('Configuration créée avec succès');
    },
    onError: (error) => {
      console.error('Error creating country configuration:', error);
      toast.error('Erreur lors de la création de la configuration');
    }
  });
};

export const useUpdateCountryConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CountryConfiguration> }) => {
      const { data, error } = await supabase
        .from('geographic_configurations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-configurations'] });
      toast.success('Configuration mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating country configuration:', error);
      toast.error('Erreur lors de la mise à jour de la configuration');
    }
  });
};

export const useGeographicPerformance = (timeRange: string) => {
  return useQuery({
    queryKey: ['geographic-performance', timeRange],
    queryFn: async () => {
      // Simulation de données pour la démo
      const mockData: GeographicPerformanceData[] = [
        {
          country_code: 'CI',
          total_requests: 150,
          completed_requests: 120,
          average_quote_amount: 250000,
          conversion_rate: 80,
          user_satisfaction_score: 4.2,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        },
        {
          country_code: 'SN',
          total_requests: 89,
          completed_requests: 67,
          average_quote_amount: 180000,
          conversion_rate: 75,
          user_satisfaction_score: 4.0,
          period_start: '2024-01-01',
          period_end: '2024-01-31'
        }
      ];
      return mockData;
    }
  });
};

export const useGeographicAlerts = () => {
  return useQuery({
    queryKey: ['geographic-alerts'],
    queryFn: async () => {
      // Simulation de données pour la démo
      const mockAlerts: GeographicAlert[] = [
        {
          id: '1',
          country_code: 'CI',
          severity: 'medium',
          title: 'Taux de conversion en baisse',
          message: 'Le taux de conversion a diminué de 5% ce mois-ci',
          alert_type: 'conversion_low',
          threshold_value: '75%',
          current_value: '70%',
          created_at: new Date().toISOString()
        }
      ];
      return mockAlerts;
    }
  });
};

export const usePricingZones = () => {
  return useQuery({
    queryKey: ['pricing-zones'],
    queryFn: async () => {
      // Simulation de données pour la démo
      const mockZones: PricingZone[] = [
        {
          id: '1',
          zone_name: 'Zone UEMOA',
          zone_code: 'UEMOA',
          description: 'Zone économique et monétaire ouest-africaine',
          countries: ['CI', 'SN', 'BF', 'ML', 'TG'],
          base_multiplier: 1.0,
          currency_adjustments: { XOF: 1.0 },
          is_active: true
        }
      ];
      return mockZones;
    }
  });
};

export const useUpdatePricingZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<PricingZone>) => {
      console.log('Updating pricing zone:', id, updates);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-zones'] });
      toast.success('Zone de tarification mise à jour');
    }
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      console.log('Resolving alert:', alertId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geographic-alerts'] });
      toast.success('Alerte résolue');
    }
  });
};
