
import { AfricaCountryInfo } from '../types';

export const WEST_AFRICA_COUNTRIES: Record<string, AfricaCountryInfo> = {
  'SN': {
    country: 'Sénégal',
    country_code: 'SN',
    region: 'west',
    currency: 'CFA',
    currency_symbol: 'F CFA',
    primary_language: 'fr',
    local_languages: ['wolof', 'fulani', 'serer'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: true,
      microinsurance_focus: true,
      key_providers: ['SONAR', 'CNART', 'AMSA'],
      regulatory_framework: 'CIMA'
    }
  },
  'CI': {
    country: 'Côte d\'Ivoire',
    country_code: 'CI',
    region: 'west',
    currency: 'CFA',
    currency_symbol: 'F CFA',
    primary_language: 'fr',
    local_languages: ['baoulé', 'dioula', 'akan'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: true,
      microinsurance_focus: true,
      key_providers: ['NSIA', 'SAHAM', 'AXIANS'],
      regulatory_framework: 'CIMA'
    }
  },
  'NG': {
    country: 'Nigeria',
    country_code: 'NG',
    region: 'west',
    currency: 'NGN',
    currency_symbol: '₦',
    primary_language: 'en',
    local_languages: ['yoruba', 'igbo', 'hausa'],
    insurance_context: {
      market_maturity: 'developing',
      mobile_money_prevalent: true,
      microinsurance_focus: true,
      key_providers: ['Aiico', 'Custodian', 'Sovereign Trust'],
      regulatory_framework: 'NAICOM'
    }
  }
};
