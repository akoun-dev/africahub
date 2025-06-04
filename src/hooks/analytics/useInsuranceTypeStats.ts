
import { useQuery } from '@tanstack/react-query';
import type { InsuranceTypeStats } from './types';

export const useInsuranceTypeStats = () => {
  return useQuery({
    queryKey: ['insurance-type-stats'],
    queryFn: async (): Promise<InsuranceTypeStats[]> => {
      // Mock data for insurance type statistics
      const insuranceTypes = ['auto', 'health', 'home', 'life', 'travel'];
      
      return insuranceTypes.map(insurance_type => {
        const total_requests = Math.floor(Math.random() * 300) + 50;
        const completed_requests = Math.floor(total_requests * 0.7);
        
        return {
          insurance_type,
          total_requests,
          completed_requests,
          completion_rate: (completed_requests / total_requests) * 100,
          avg_quote_amount: Math.floor(Math.random() * 4000) + 1000,
          total_value: completed_requests * (Math.floor(Math.random() * 4000) + 1000)
        };
      });
    },
  });
};
