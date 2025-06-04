
export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  languages: string[];
  region: string;
}

export interface CountryConfiguration {
  id: string;
  country_code: string;
  country_name: string;
  language_code: string;
  currency_code: string;
  timezone?: string;
  date_format?: string;
  number_format?: string;
  pricing_zone?: string;
  is_active: boolean;
  regulatory_requirements?: Record<string, any>;
  commission_rates?: Record<string, any>;
  email_templates?: Record<string, any>;
  form_configurations?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
