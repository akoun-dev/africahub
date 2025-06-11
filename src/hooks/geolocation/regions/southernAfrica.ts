
import { AfricaCountryInfo } from '../types';

export const SOUTHERN_AFRICA_COUNTRIES: Record<string, AfricaCountryInfo> = {
  'ZA': {
    country: 'Afrique du Sud',
    country_code: 'ZA',
    region: 'south',
    currency: 'ZAR',
    currency_symbol: 'R',
    primary_language: 'en',
    local_languages: ['afrikaans', 'zulu', 'xhosa'],
    insurance_context: {
      market_maturity: 'mature',
      mobile_money_prevalent: false,
      microinsurance_focus: false,
      key_providers: ['Old Mutual', 'Discovery', 'Santam'],
      regulatory_framework: 'FSB'
    }
  }
};
