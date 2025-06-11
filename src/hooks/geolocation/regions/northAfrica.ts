
import { AfricaCountryInfo } from '../types';

export const NORTH_AFRICA_COUNTRIES: Record<string, AfricaCountryInfo> = {
  'EG': {
    country: 'Égypte',
    country_code: 'EG',
    region: 'north',
    currency: 'EGP',
    currency_symbol: 'E£',
    primary_language: 'ar',
    local_languages: ['arabic', 'english'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: false,
      microinsurance_focus: false,
      key_providers: ['AXA Egypt', 'Allianz Egypt', 'MetLife'],
      regulatory_framework: 'EFSA'
    }
  },
  'MA': {
    country: 'Maroc',
    country_code: 'MA',
    region: 'north',
    currency: 'MAD',
    currency_symbol: 'DH',
    primary_language: 'ar',
    local_languages: ['arabic', 'french', 'berber'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: false,
      microinsurance_focus: false,
      key_providers: ['Wafa Assurance', 'AXA Maroc', 'Atlanta'],
      regulatory_framework: 'ACAPS'
    }
  },
  'DZ': {
    country: 'Algérie',
    country_code: 'DZ',
    region: 'north',
    currency: 'DZD',
    currency_symbol: 'DA',
    primary_language: 'ar',
    local_languages: ['arabic', 'french', 'berber'],
    insurance_context: {
      market_maturity: 'emerging',
      mobile_money_prevalent: false,
      microinsurance_focus: false,
      key_providers: ['SAA', 'CAAT', 'Alliance Assurances'],
      regulatory_framework: 'UAR'
    }
  },
  'TN': {
    country: 'Tunisie',
    country_code: 'TN',
    region: 'north',
    currency: 'TND',
    currency_symbol: 'DT',
    primary_language: 'ar',
    local_languages: ['arabic', 'french'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: false,
      microinsurance_focus: false,
      key_providers: ['STAR', 'GAT', 'AMI'],
      regulatory_framework: 'CGA'
    }
  }
};
