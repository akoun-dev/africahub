
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivationStats {
  totalCompanies: number;
  activeCompanies: number;
  totalProducts: number;
  activeProducts: number;
  totalSectors: number;
  activeSectors: number;
  countryCoverage: Record<string, number>;
}

interface UseActivationStatsReturn {
  data: ActivationStats | null;
  isLoading: boolean;
  error: string | null;
}

export const useActivationStats = (): UseActivationStatsReturn => {
  const [data, setData] = useState<ActivationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        
        // Get company stats
        const [companiesResult, productsResult, sectorsResult] = await Promise.all([
          supabase.from('companies').select('is_active, country'),
          supabase.from('products').select('is_active'),
          supabase.from('sectors').select('is_active')
        ]);

        if (companiesResult.error) throw companiesResult.error;
        if (productsResult.error) throw productsResult.error;
        if (sectorsResult.error) throw sectorsResult.error;

        const companies = companiesResult.data || [];
        const products = productsResult.data || [];
        const sectors = sectorsResult.data || [];

        // Calculate stats
        const totalCompanies = companies.length;
        const activeCompanies = companies.filter(c => c.is_active).length;
        
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.is_active).length;
        
        const totalSectors = sectors.length;
        const activeSectors = sectors.filter(s => s.is_active).length;

        // Calculate country coverage
        const countryCoverage: Record<string, number> = {};
        companies.forEach(company => {
          if (company.country) {
            countryCoverage[company.country] = (countryCoverage[company.country] || 0) + 1;
          }
        });

        setData({
          totalCompanies,
          activeCompanies,
          totalProducts,
          activeProducts,
          totalSectors,
          activeSectors,
          countryCoverage
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching activation stats:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    data,
    isLoading,
    error
  };
};
