
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MapboxTokenData {
  token: string | null;
  configured: boolean;
  message?: string;
}

export const useMapboxToken = () => {
  const [tokenData, setTokenData] = useState<MapboxTokenData>({ token: null, configured: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 useMapboxToken: Fetching token...');
      
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) {
        console.error('❌ useMapboxToken: Error fetching token:', error);
        throw error;
      }
      
      console.log('📊 useMapboxToken: Response received:', { 
        hasToken: !!data?.token, 
        configured: data?.configured,
        message: data?.message 
      });
      
      setTokenData({
        token: data?.token || null,
        configured: data?.configured || false,
        message: data?.message
      });
      
    } catch (err) {
      console.error('💥 useMapboxToken: Unexpected error:', err);
      setError('Erreur lors de la récupération du token Mapbox');
      setTokenData({ token: null, configured: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return {
    token: tokenData.token,
    configured: tokenData.configured,
    message: tokenData.message,
    isLoading,
    error,
    refetch: fetchToken
  };
};
