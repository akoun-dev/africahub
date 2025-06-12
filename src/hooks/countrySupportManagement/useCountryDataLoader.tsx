
import { useState, useCallback } from 'react';

// Mock interfaces for country management
export interface CountrySupport {
  id: string;
  country_code: string;
  country_name: string;
  is_active: boolean;
  currency_code: string;
  language_code: string;
  created_at: string;
  updated_at: string;
}

export interface CountryGroup {
  id: string;
  name: string;
  countries: string[];
  created_at: string;
}

export const useCountryDataLoader = () => {
  const [countries, setCountries] = useState<CountrySupport[]>([]);
  const [groups, setGroups] = useState<CountryGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCountriesSupport = useCallback(async () => {
    setLoading(true);
    
    try {
      // Mock data for countries
      const mockCountries: CountrySupport[] = [
        {
          id: '1',
          country_code: 'SN',
          country_name: 'Sénégal',
          is_active: true,
          currency_code: 'XOF',
          language_code: 'fr',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          country_code: 'CI',
          country_name: 'Côte d\'Ivoire',
          is_active: true,
          currency_code: 'XOF',
          language_code: 'fr',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          country_code: 'NG',
          country_name: 'Nigeria',
          is_active: true,
          currency_code: 'NGN',
          language_code: 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // Mock data for groups
      const mockGroups: CountryGroup[] = [
        {
          id: '1',
          name: 'West Africa CFA',
          countries: ['SN', 'CI'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'English Speaking',
          countries: ['NG', 'GH'],
          created_at: new Date().toISOString()
        }
      ];

      setCountries(mockCountries);
      setGroups(mockGroups);
    } catch (error) {
      console.error('Error loading countries support:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    countries,
    groups,
    loading,
    loadCountriesSupport
  };
};
