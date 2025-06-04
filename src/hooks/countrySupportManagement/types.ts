
export interface CountrySupport {
  id: string;
  country_code: string;
  country_name: string;
  is_active: boolean;
  currency_code: string;
  language_code: string;
  created_at: string;
  updated_at: string;
}

export interface CountryGroup {
  id: string;
  name: string;
  countries: string[];
  created_at: string;
}

export interface CountryConfiguration {
  id: string;
  country_code: string;
  country_name: string;
  is_active: boolean;
  currency_code: string;
  timezone?: string;
  date_format?: string;
  number_format?: string;
  language_code: string;
  regulatory_requirements?: Record<string, any>;
  pricing_zone?: string;
  commission_rates?: Record<string, any>;
  email_templates?: Record<string, any>;
  form_configurations?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
