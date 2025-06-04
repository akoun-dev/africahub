
// Re-export core types
export * from './core';

// Legacy types that need to be maintained for compatibility
export interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'admin' | 'moderator';
  country_code?: string;
  is_active: boolean;
  permissions: string[];
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  is_active: boolean;
  permissions?: string[];
  last_login?: string;
  created_at?: string;
  country_code?: string;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  country: string;
  country_availability: string[]; // Made required to match usage
  sectors?: string[];
  is_active?: boolean;
  is_partner: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  data_type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  unit?: string;
  product_type_id: string;
  created_at: string;
  updated_at: string;
}

export interface SectorCriterion {
  id: string;
  sector_id: string;
  name: string;
  data_type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  is_required: boolean;
  options?: string[];
  unit?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  insurance_type: string;
  budget_range: string;
  risk_tolerance: string;
  price_sensitivity: number;
  brand_preference: string;
  coverage_priorities: string[];
  ai_recommendations: boolean;
  real_time_updates: boolean;
  personalization_level: string;
  notification_frequency: string;
  preferred_strategy: string;
  preferred_provider: string;
  cost_threshold: number;
  max_latency_ms: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
