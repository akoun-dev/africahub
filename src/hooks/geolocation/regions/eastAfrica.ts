
import { AfricaCountryInfo } from '../types';

export const EAST_AFRICA_COUNTRIES: Record<string, AfricaCountryInfo> = {
  'KE': {
    country: 'Kenya',
    country_code: 'KE',
    region: 'east',
    currency: 'KES',
    currency_symbol: 'KSh',
    primary_language: 'en',
    local_languages: ['swahili', 'kikuyu', 'luhya'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: true,
      microinsurance_focus: true,
      key_providers: ['Jubilee', 'UAP', 'CIC'],
      regulatory_framework: 'IRA'
    }
  },
  'ET': {
    country: 'Éthiopie',
    country_code: 'ET',
    region: 'east',
    currency: 'ETB',
    currency_symbol: 'Br',
    primary_language: 'am',
    local_languages: ['amharic', 'oromo', 'tigrinya'],
    insurance_context: {
      market_maturity: 'emerging',
      mobile_money_prevalent: false,
      microinsurance_focus: true,
      key_providers: ['Ethiopian Insurance', 'Awash Insurance', 'Nile Insurance'],
      regulatory_framework: 'NBE'
    }
  }
};
