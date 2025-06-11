
import { AfricaCountryInfo } from './types';
import { AvailableLanguage } from '@/contexts/CountryContext';

// Mapping des langues primaires vers les langues disponibles
const languageCodeMap: Record<string, AvailableLanguage> = {
  'fr': 'fr',
  'en': 'en',
  'ar': 'ar',
  'pt': 'pt',
  'sw': 'sw',
  'am': 'am',
  // Fallbacks pour les langues locales vers les langues officielles
  'amharic': 'am',
  'swahili': 'sw',
  'arabic': 'ar',
  'french': 'fr',
  'english': 'en',
  'portuguese': 'pt'
};

export const getCountryOfficialLanguage = (countryInfo: AfricaCountryInfo): AvailableLanguage => {
  const primaryLang = countryInfo.primary_language.toLowerCase();
  
  console.log('Language detection for:', countryInfo.country, 'Primary lang:', primaryLang);
  
  // Cas spécifiques par pays pour une meilleure précision
  switch (countryInfo.country_code) {
    case 'ET': // Éthiopie
      return 'am'; // Amharique
    case 'EG': // Égypte
    case 'DZ': // Algérie
    case 'MA': // Maroc
    case 'TN': // Tunisie
      return 'ar'; // Arabe
    case 'NG': // Nigeria
    case 'GH': // Ghana
    case 'ZA': // Afrique du Sud
    case 'KE': // Kenya
      return 'en'; // Anglais
    case 'TZ': // Tanzanie
      return 'sw'; // Swahili
  }
  
  // Chercher d'abord dans le mapping direct
  if (languageCodeMap[primaryLang]) {
    return languageCodeMap[primaryLang];
  }
  
  // Fallback par région
  switch (countryInfo.region) {
    case 'west':
      // La plupart des pays d'Afrique de l'Ouest sont francophones
      return countryInfo.country_code === 'NG' || countryInfo.country_code === 'GH' ? 'en' : 'fr';
    case 'east':
      // Afrique de l'Est: mélange anglais/swahili/amharique
      if (countryInfo.country_code === 'ET') return 'am';
      return 'en'; // Kenya, Tanzanie principalement anglophones
    case 'south':
      return 'en'; // Afrique du Sud principalement anglophone
    case 'north':
      return 'ar'; // Afrique du Nord principalement arabophone
    case 'central':
      return 'fr'; // Afrique centrale principalement francophone
    default:
      return 'en'; // Fallback vers l'anglais
  }
};

export const getLanguageDisplayName = (language: AvailableLanguage): string => {
  const names: Record<AvailableLanguage, string> = {
    'en': 'English',
    'fr': 'Français',
    'ar': 'العربية',
    'pt': 'Português',
    'sw': 'Kiswahili',
    'am': 'አማርኛ'
  };
  return names[language];
};
