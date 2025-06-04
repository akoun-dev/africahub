
export interface PricingCalculationRequest {
  productId: string;
  userCriteria: Record<string, any>;
  userId?: string;
}

export interface PricingCalculationResponse {
  success: boolean;
  price?: number;
  currency?: string;
  details?: Record<string, any>;
  error?: string;
  calculationId?: string;
}

export interface PricingAlgorithm {
  id: string;
  company_id: string;
  name: string;
  endpoint: string;
  auth_type: 'api_key' | 'bearer' | 'basic';
  auth_config: Record<string, any>;
  calculation_fields: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceCalculation {
  id: string;
  product_id: string;
  user_criteria: Record<string, any>;
  calculated_price?: number;
  currency?: string;
  calculation_details?: Record<string, any>;
  expires_at: string;
  created_at: string;
}

export type PricingType = 'fixed' | 'calculated';
