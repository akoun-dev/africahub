
import { useQuery } from '@tanstack/react-query';
import type { QuoteAnalytics } from './types';

export const useQuoteAnalytics = (days = 30) => {
  return useQuery({
    queryKey: ['quote-analytics', days],
    queryFn: async (): Promise<QuoteAnalytics[]> => {
      // Generate mock data
      const analytics: QuoteAnalytics[] = [];
      const today = new Date();
      const insuranceTypes = ['auto', 'health', 'home', 'life'];
      const countries = ['SN', 'CI', 'NG', 'GH'];
      const statuses = ['completed', 'pending', 'in_progress', 'cancelled'];
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        insuranceTypes.forEach(insurance_type => {
          countries.forEach(country => {
            statuses.forEach(status => {
              const total_requests = Math.floor(Math.random() * 20) + 5;
              const completed_requests = status === 'completed' ? total_requests : 0;
              const pending_requests = status === 'pending' ? total_requests : 0;
              const in_progress_requests = status === 'in_progress' ? total_requests : 0;
              const cancelled_requests = status === 'cancelled' ? total_requests : 0;
              
              analytics.push({
                date: date.toISOString().split('T')[0],
                insurance_type,
                country,
                status,
                total_requests,
                completed_requests,
                pending_requests,
                in_progress_requests,
                cancelled_requests,
                avg_quote_amount: Math.floor(Math.random() * 3000) + 1000,
                total_quote_value: total_requests * (Math.floor(Math.random() * 3000) + 1000)
              });
            });
          });
        });
      }
      
      return analytics.sort((a, b) => a.date.localeCompare(b.date));
    },
  });
};
