
import { useState, useEffect } from 'react';
import { AfricaCountryInfo } from './geolocation/types';
import { AFRICA_COUNTRIES } from './geolocation/countryData';
import { detectCountryFromIP, getCountryFromBrowser } from './geolocation/detectionServices';
import { getOptimalLLMProvider } from './geolocation/llmOptimization';

export { type AfricaCountryInfo } from './geolocation/types';

export const useAfricaGeolocation = () => {
  const [countryInfo, setCountryInfo] = useState<AfricaCountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateCountryInfo = (countryCode: string | null) => {
    if (countryCode && AFRICA_COUNTRIES[countryCode]) {
      setCountryInfo(AFRICA_COUNTRIES[countryCode]);
    } else {
      // Default to Senegal if no match or detection fails
      setCountryInfo(AFRICA_COUNTRIES['SN']);
    }
  };

  useEffect(() => {
    const detectLocation = async () => {
      setIsLoading(true);
      try {
        // Try IP detection first
        let countryCode = await detectCountryFromIP();
        
        // Fallback to browser locale
        if (!countryCode || !AFRICA_COUNTRIES[countryCode]) {
          countryCode = getCountryFromBrowser();
        }
        
        updateCountryInfo(countryCode);
        setError(null);
      } catch (err) {
        setError('Failed to detect location');
        updateCountryInfo('SN'); // Default to Senegal
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  const setManualCountry = (countryCode: string) => {
    if (AFRICA_COUNTRIES[countryCode]) {
      setCountryInfo(AFRICA_COUNTRIES[countryCode]);
      // Store in localStorage for persistence
      localStorage.setItem('selected_africa_country', countryCode);
    }
  };

  const getAllCountries = () => Object.values(AFRICA_COUNTRIES);

  return {
    countryInfo,
    isLoading,
    error,
    setManualCountry,
    getAllCountries,
    getOptimalLLMProvider
  };
};
