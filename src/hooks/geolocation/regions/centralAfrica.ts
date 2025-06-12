
import { AfricaCountryInfo } from '../types';

export const CENTRAL_AFRICA_COUNTRIES: Record<string, AfricaCountryInfo> = {
  'CM': {
    country: 'Cameroun',
    country_code: 'CM',
    region: 'central',
    currency: 'XAF',
    currency_symbol: 'FCFA',
    primary_language: 'fr',
    local_languages: ['french', 'english', 'fulfulde'],
    insurance_context: {
      market_maturity: 'emerging',
      mobile_money_prevalent: true,
      microinsurance_focus: true,
      key_providers: ['ACTIVA', 'CHANAS', 'SUNU'],
      regulatory_framework: 'CIMA'
    }
  },
  'GA': {
    country: 'Gabon',
    country_code: 'GA',
    region: 'central',
    currency: 'XAF',
    currency_symbol: 'FCFA',
    primary_language: 'fr',
    local_languages: ['french', 'fang', 'myene'],
    insurance_context: {
      market_maturity: 'emerging',
      mobile_money_prevalent: false,
      microinsurance_focus: false,
      key_providers: ['OGAR', 'SAHAM', 'NSIA'],
      regulatory_framework: 'CIMA'
    }
  }
};
