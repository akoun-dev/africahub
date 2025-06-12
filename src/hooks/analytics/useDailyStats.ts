
import { useQuery } from '@tanstack/react-query';
import type { DailyStats } from './types';

export const useDailyStats = (days = 30) => {
  return useQuery({
    queryKey: ['daily-stats', days],
    queryFn: async (): Promise<DailyStats[]> => {
      // Generate mock data for the requested number of days
      const stats: DailyStats[] = [];
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        stats.push({
          date: date.toISOString().split('T')[0],
          total_requests: Math.floor(Math.random() * 100) + 20,
          unique_users: Math.floor(Math.random() * 50) + 10,
          countries_served: Math.floor(Math.random() * 8) + 3,
          avg_quote_amount: Math.floor(Math.random() * 5000) + 1000
        });
      }
      
      return stats.reverse(); // Return in chronological order
    },
  });
};
