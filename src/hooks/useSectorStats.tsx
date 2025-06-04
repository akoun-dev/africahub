
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SectorQuoteStats {
  sector_slug: string;
  total_quotes: number;
  pending_quotes: number;
  completed_quotes: number;
  total_revenue: number;
  avg_quote_amount: number;
}

export interface SectorProductStats {
  sector_slug: string;
  total_products: number;
  active_products: number;
  companies_count: number;
}

export interface SectorStats {
  totalCompanies: number;
  averagePrice: number;
  averageRating: number;
}

export const useSectorStats = (sectorSlug: string) => {
  return useQuery({
    queryKey: ['sector-stats', sectorSlug],
    queryFn: async (): Promise<SectorStats> => {
      // Mock data for now - replace with actual API calls
      return {
        totalCompanies: Math.floor(Math.random() * 50) + 10,
        averagePrice: Math.floor(Math.random() * 1000) + 500,
        averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10
      };
    },
  });
};

export const useSectorQuoteStats = (sectorSlug?: string) => {
  return useQuery({
    queryKey: ['sector-quote-stats', sectorSlug],
    queryFn: async () => {
      let query = supabase
        .from('quote_requests')
        .select('sector_slug, status');

      if (sectorSlug) {
        query = query.eq('sector_slug', sectorSlug);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Group by sector and calculate stats
      const stats = (data || []).reduce((acc, quote) => {
        const sector = quote.sector_slug || 'unknown';
        if (!acc[sector]) {
          acc[sector] = {
            sector_slug: sector,
            total_quotes: 0,
            pending_quotes: 0,
            completed_quotes: 0,
            total_revenue: 0,
            avg_quote_amount: 0,
          };
        }
        
        acc[sector].total_quotes++;
        if (quote.status === 'pending') acc[sector].pending_quotes++;
        if (quote.status === 'completed') acc[sector].completed_quotes++;
        
        return acc;
      }, {} as Record<string, SectorQuoteStats>);

      return sectorSlug ? stats[sectorSlug] : Object.values(stats);
    },
  });
};

export const useSectorProductStats = (sectorSlug?: string) => {
  return useQuery({
    queryKey: ['sector-product-stats', sectorSlug],
    queryFn: async () => {
      // Get products with their sector information through product_types
      let query = supabase
        .from('products')
        .select(`
          id,
          company_id,
          is_active,
          product_types!inner(
            sectors!inner(
              slug
            )
          )
        `);

      if (sectorSlug) {
        query = query.eq('product_types.sectors.slug', sectorSlug);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const stats = (data || []).reduce((acc, product: any) => {
        const sector = product.product_types?.sectors?.slug || 'unknown';
        if (!acc[sector]) {
          acc[sector] = {
            sector_slug: sector,
            total_products: 0,
            active_products: 0,
            companies_count: 0,
          };
        }
        
        acc[sector].total_products++;
        if (product.is_active) acc[sector].active_products++;
        
        return acc;
      }, {} as Record<string, SectorProductStats>);

      // Count unique companies per sector
      const companiesPerSector = (data || []).reduce((acc, product: any) => {
        const sector = product.product_types?.sectors?.slug || 'unknown';
        if (!acc[sector]) acc[sector] = new Set();
        if (product.company_id) acc[sector].add(product.company_id);
        return acc;
      }, {} as Record<string, Set<string>>);

      Object.keys(stats).forEach(sector => {
        stats[sector].companies_count = companiesPerSector[sector]?.size || 0;
      });

      return sectorSlug ? stats[sectorSlug] : Object.values(stats);
    },
  });
};
