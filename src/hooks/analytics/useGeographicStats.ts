
import { useQuery } from '@tanstack/react-query';
import type { GeographicStats } from './types';

export const useGeographicStats = () => {
  return useQuery({
    queryKey: ['geographic-stats'],
    queryFn: async (): Promise<GeographicStats[]> => {
      // Mock data for geographic statistics
      const countries = ['SN', 'CI', 'NG', 'GH', 'KE', 'ZA', 'MA', 'EG'];
      
      return countries.map(country => ({
        country,
        total_requests: Math.floor(Math.random() * 500) + 100,
        cities_served: Math.floor(Math.random() * 10) + 3,
        completed_requests: Math.floor(Math.random() * 400) + 80,
        avg_quote_amount: Math.floor(Math.random() * 3000) + 1500
      })).sort((a, b) => b.total_requests - a.total_requests);
    },
  });
};
