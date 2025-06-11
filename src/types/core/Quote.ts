
import type { Database } from '@/integrations/supabase/types';

// Base Supabase types
export type SupabaseQuoteRequest = Database['public']['Tables']['quote_requests']['Row'];
export type SupabaseQuoteRequestInsert = Database['public']['Tables']['quote_requests']['Insert'];
export type SupabaseQuoteRequestUpdate = Database['public']['Tables']['quote_requests']['Update'];

// Extended UI types
export interface QuoteRequest extends SupabaseQuoteRequest {
  quote_amount?: number;
  quote_details?: any;
}

export interface QuoteRequestFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  insurance_type: string;
  sector_slug: string;
  specific_data?: Record<string, any>;
  company_preferences?: string[];
}
