
export interface AfricaCountryInfo {
  country: string;
  country_code: string;
  region: 'west' | 'east' | 'north' | 'south' | 'central';
  currency: string;
  currency_symbol: string;
  primary_language: string;
  local_languages: string[];
  insurance_context: {
    market_maturity: 'emerging' | 'developing' | 'mature';
    mobile_money_prevalent: boolean;
    microinsurance_focus: boolean;
    key_providers: string[];
    regulatory_framework: string;
  };
}
