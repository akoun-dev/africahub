
import { useState, useEffect } from 'react';

interface CountryInfo {
  country: string;
  country_code: string;
  region: 'west' | 'east' | 'north' | 'south' | 'central';
  currency: string;
  currency_symbol: string;
  primary_language: string;
  local_languages: string[];
  insurance_context: {
    market_maturity: string;
    mobile_money_prevalent: boolean;
    microinsurance_focus: boolean;
    key_providers: string[];
  };
}

export const useAfricaGeolocation = () => {
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock implementation - default to Côte d'Ivoire
    const mockCountryInfo: CountryInfo = {
      country: "Côte d'Ivoire",
      country_code: "CI",
      region: "west",
      currency: "CFA",
      currency_symbol: "CFA",
      primary_language: "fr",
      local_languages: ["Baoulé", "Dioula"],
      insurance_context: {
        market_maturity: "emerging",
        mobile_money_prevalent: true,
        microinsurance_focus: true,
        key_providers: ["NSIA", "Allianz", "AXA"]
      }
    };

    setTimeout(() => {
      setCountryInfo(mockCountryInfo);
      setIsLoading(false);
    }, 1000);
  }, []);

  const setManualCountry = (countryCode: string) => {
    // Mock implementation
    console.log('Manual country selection:', countryCode);
  };

  const getAllCountries = () => {
    return [
      { country: "Côte d'Ivoire", country_code: "CI" },
      { country: "Sénégal", country_code: "SN" },
      { country: "Ghana", country_code: "GH" },
      { country: "Nigeria", country_code: "NG" },
      { country: "Kenya", country_code: "KE" }
    ];
  };

  const getOptimalLLMProvider = (country: CountryInfo) => {
    return 'balanced';
  };

  return {
    countryInfo,
    isLoading,
    setManualCountry,
    getAllCountries,
    getOptimalLLMProvider
  };
};
