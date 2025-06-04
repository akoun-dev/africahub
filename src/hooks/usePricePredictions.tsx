
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PricePrediction {
  id: string;
  product_id: string;
  country_code: string;
  current_price: number;
  predicted_price: number;
  prediction_period: '1_month' | '3_months' | '6_months' | '1_year';
  confidence_level: number;
  factors: any;
  model_version: string;
  valid_until: string;
}

export interface PriceAlert {
  id: string;
  product_id: string;
  alert_type: 'price_drop' | 'price_increase' | 'best_time_to_buy';
  threshold_value?: number;
  is_active: boolean;
  is_triggered: boolean;
  triggered_at?: string;
}

export const usePricePredictions = (productId?: string, countryCode?: string) => {
  return useQuery({
    queryKey: ['price-predictions', productId, countryCode],
    queryFn: async () => {
      // For now, return mock data since the RPC functions don't exist yet
      console.log('Generating mock price predictions for:', { productId, countryCode });
      
      return [{
        id: '1',
        product_id: productId || '',
        country_code: countryCode || 'FR',
        current_price: 150,
        predicted_price: 140,
        prediction_period: '3_months' as const,
        confidence_level: 0.75,
        factors: { market_trend: 'declining', competition: 'increasing' },
        model_version: 'v1.0',
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }] as PricePrediction[];
    },
  });
};

export const usePriceAlerts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['price-alerts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // For now, return empty array since the RPC functions don't exist yet
      console.log('Loading price alerts for user:', user.id);
      return [] as PriceAlert[];
    },
    enabled: !!user,
  });
};

export const useCreatePriceAlert = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (alert: Omit<PriceAlert, 'id' | 'is_active' | 'is_triggered'>) => {
      if (!user) throw new Error('No user logged in');
      
      // For now, simulate the creation
      console.log('Creating price alert:', alert);
      
      // This would be the actual implementation once tables are recognized
      // const { data, error } = await supabase
      //   .from('price_alerts')
      //   .insert({
      //     user_id: user.id,
      //     ...alert,
      //   });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts', user?.id] });
    },
  });
};
