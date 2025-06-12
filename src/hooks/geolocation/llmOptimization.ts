
import { AfricaCountryInfo } from './types';

export const getOptimalLLMProvider = (countryInfo: AfricaCountryInfo) => {
  // Choose provider based on country characteristics
  if (countryInfo.primary_language === 'fr') {
    return 'qwen'; // Better multilingual support
  }
  if (countryInfo.insurance_context.market_maturity === 'emerging') {
    return 'deepseek'; // More cost-effective
  }
  return 'balanced'; // Default strategy
};
