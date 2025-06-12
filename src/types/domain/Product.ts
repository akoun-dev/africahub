
export interface Product {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  price?: number;
  currency?: string;
  image_url?: string;
  purchase_link?: string;
  company_id: string;
  product_type_id?: string;
  country: string;
  country_availability?: string[];
  category: 'auto' | 'health' | 'life' | 'property' | 'business' | 'travel';
  is_active?: boolean;
  coverage_amount?: number;
  benefits?: string[];
  created_at: string;
  updated_at: string;
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

export interface ProductWithCriteria extends Product {
  product_types?: {
    slug: string;
    name: string;
  };
  criteria_values?: Array<{
    comparison_criteria: {
      name: string;
      data_type: string;
      unit?: string;
    };
    value: string;
  }>;
}
