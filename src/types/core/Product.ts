
import type { Database } from '@/integrations/supabase/types';

// Base Supabase types
export type SupabaseProduct = Database['public']['Tables']['products']['Row'];
export type SupabaseProductInsert = Database['public']['Tables']['products']['Insert'];
export type SupabaseProductUpdate = Database['public']['Tables']['products']['Update'];

// Extended UI types
export interface Product extends SupabaseProduct {
  companies?: {
    name: string;
    logo_url?: string;
  };
  product_types?: {
    name: string;
    slug: string;
  };
  // Ces champs sont maintenant alignés avec la base de données
  pricing_type: 'fixed' | 'calculated';
  calculation_config: Record<string, any>;
  api_endpoint: string | null;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sector_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCriteria {
  id: string;
  name: string;
  data_type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  unit?: string;
  options?: Record<string, any>;
  product_type_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCriteriaValue {
  id: string;
  product_id?: string;
  criteria_id?: string;
  value: string;
  created_at: string;
}

// Interface unifiée pour ProductWithCriteria
export interface ProductWithCriteria extends Product {
  criteria_values?: Array<{
    comparison_criteria: {
      name: string;
      data_type: string;
      unit?: string;
    };
    value: string;
  }>;
}
