
export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  is_active: boolean;
  created_at?: string;
  last_login?: string;
  permissions?: string[];
  country_code?: string;
}

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

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  default_language?: string;
  default_currency?: string;
  theme?: 'light' | 'dark';
  timezone?: string;
  privacy_settings?: Record<string, any>;
  accessibility_settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user' | 'super-admin' | 'developer';
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  insurance_type: string;
  budget_range?: string;
  coverage_priorities?: Record<string, any>;
  risk_tolerance?: string;
  created_at: string;
  updated_at: string;
}
