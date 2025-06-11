
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Country, getAfricanCountryByCode } from '@/components/CountrySelector';
import { AFRICA_COUNTRIES } from '@/hooks/geolocation/countryData';
import { getCountryOfficialLanguage, getLanguageDisplayName } from '@/hooks/geolocation/languageMapping';
import { toast } from 'sonner';

// Define the available languages
export type AvailableLanguage = 'en' | 'fr' | 'ar' | 'pt' | 'sw' | 'am';

// Interface for the context state
interface CountryContextType {
  country: Country;
  language: AvailableLanguage;
  setCountry: (country: Country) => void;
  setLanguage: (language: AvailableLanguage) => void;
  formatCurrency: (amount: number) => string;
  autoLanguageEnabled: boolean;
  setAutoLanguageEnabled: (enabled: boolean) => void;
}

// Create the context with default values
const CountryContext = createContext<CountryContextType | undefined>(undefined);

// Provider component
export function CountryProvider({ children }: { children: ReactNode }) {
  // Default country (Côte d'Ivoire)
  const defaultCountry = getAfricanCountryByCode('CI');
  
  const [country, setCountryState] = useState<Country>(defaultCountry);
  const [language, setLanguageState] = useState<AvailableLanguage>('fr'); // French as default for Côte d'Ivoire
  const [autoLanguageEnabled, setAutoLanguageEnabled] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedAutoLanguage = localStorage.getItem('autoLanguageEnabled');
    const savedLanguage = localStorage.getItem('preferredLanguage') as AvailableLanguage;
    const savedCountry = localStorage.getItem('selectedCountry');
    
    if (savedAutoLanguage !== null) {
      setAutoLanguageEnabled(JSON.parse(savedAutoLanguage));
    }
    
    if (savedLanguage && !JSON.parse(savedAutoLanguage || 'true')) {
      setLanguageState(savedLanguage);
    }

    if (savedCountry) {
      try {
        const parsedCountry = JSON.parse(savedCountry) as Country;
        setCountryState(parsedCountry);
      } catch (error) {
        console.error('Error parsing saved country:', error);
      }
    }
  }, []);

  // Update language when country changes (if auto language is enabled)
  const setCountry = (newCountry: Country) => {
    const previousCountryCode = country.code;
    console.log('Country change:', { from: previousCountryCode, to: newCountry.code, autoEnabled: autoLanguageEnabled });
    
    setCountryState(newCountry);
    localStorage.setItem('selectedCountry', JSON.stringify(newCountry));
    
    if (autoLanguageEnabled && previousCountryCode !== newCountry.code) {
      // Find the corresponding Africa country info using the country code
      const africaCountryInfo = AFRICA_COUNTRIES[newCountry.code];
      
      if (africaCountryInfo) {
        const newLanguage = getCountryOfficialLanguage(africaCountryInfo);
        const previousLanguage = language;
        
        console.log('Language detection:', { 
          country: newCountry.name, 
          code: newCountry.code, 
          detectedLang: newLanguage, 
          currentLang: previousLanguage 
        });
        
        if (newLanguage !== previousLanguage) {
          setLanguageState(newLanguage);
          localStorage.setItem('preferredLanguage', newLanguage);
          
          // Show notification about language change
          toast.success(
            `Langue changée automatiquement vers ${getLanguageDisplayName(newLanguage)}`, 
            {
              action: {
                label: 'Annuler',
                onClick: () => {
                  setLanguageState(previousLanguage);
                  localStorage.setItem('preferredLanguage', previousLanguage);
                  toast.info('Langue restaurée');
                }
              },
              duration: 4000
            }
          );
        }
      } else {
        console.warn('No Africa country info found for:', newCountry.code);
      }
    }
  };

  // Custom setLanguage that saves preference and disables auto if manually changed
  const setLanguage = (newLanguage: AvailableLanguage) => {
    console.log('Manual language change:', { from: language, to: newLanguage });
    setLanguageState(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    
    // If user manually changes language, disable auto language temporarily
    if (autoLanguageEnabled) {
      setAutoLanguageEnabled(false);
      localStorage.setItem('autoLanguageEnabled', 'false');
      toast.info('Changement automatique de langue désactivé. Réactivez-le dans les préférences.');
    }
  };

  // Save auto language preference
  useEffect(() => {
    localStorage.setItem('autoLanguageEnabled', JSON.stringify(autoLanguageEnabled));
  }, [autoLanguageEnabled]);

  // Format currency based on the current country
  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(language, { 
        style: 'currency', 
        currency: country.currency 
      }).format(amount);
    } catch (error) {
      // Fallback if currency is not supported
      return `${amount} ${country.currency}`;
    }
  };

  return (
    <CountryContext.Provider value={{ 
      country, 
      language, 
      setCountry, 
      setLanguage,
      formatCurrency,
      autoLanguageEnabled,
      setAutoLanguageEnabled
    }}>
      {children}
    </CountryContext.Provider>
  );
}

// Custom hook to use the CountryContext
export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
