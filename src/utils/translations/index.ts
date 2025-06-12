
import { AvailableLanguage } from '@/contexts/CountryContext';
import { navigationTranslations } from './navigation';
import { recommendationsTranslations } from './recommendations';
import { analyticsTranslations } from './analytics';
import { commonTranslations } from './common';
import { platformTranslations } from './platform';
import { sectorsTranslations } from './sectors';
import { featuresTranslations } from './features';
import { buttonsTranslations } from './buttons';
import { countryTranslations } from './country';
import { footerTranslations } from './footer';
import { insightsTranslations } from './insights';
import { comparisonTranslations } from './comparison';
import { mapTranslations } from './map';
import { statsTranslations } from './stats';
import { searchTranslations } from './search';
import { languageTranslations } from './language';
import { purchaseTranslations } from './purchase';
import { currencyTranslations } from './currency';
import { universalTranslations } from './universal';
import { adminTranslations } from './admin';
import { validationTranslations } from './validation';
import { formsTranslations } from './forms';
import { messagesTranslations } from './messages';
import { performanceTranslations } from './performance';

interface Translations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

// Merge all translation categories with universal translations taking precedence
const translations: Translations = {
  ...navigationTranslations,
  ...recommendationsTranslations,
  ...analyticsTranslations,
  ...commonTranslations,
  ...platformTranslations,
  ...sectorsTranslations,
  ...featuresTranslations,
  ...buttonsTranslations,
  ...countryTranslations,
  ...footerTranslations,
  ...insightsTranslations,
  ...comparisonTranslations,
  ...mapTranslations,
  ...statsTranslations,
  ...searchTranslations,
  ...languageTranslations,
  ...purchaseTranslations,
  ...currencyTranslations,
  ...adminTranslations,
  ...validationTranslations,
  ...formsTranslations,
  ...messagesTranslations,
  ...performanceTranslations,
  ...universalTranslations // Universal translations override others
};

// Function to get translation with intelligent fallback and missing key logging
export const getTranslation = (key: string, language: AvailableLanguage): string => {
  if (!translations[key]) {
    // Log missing translations in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Translation] Missing key: ${key}`);
    }
    return key;
  }
  
  // Try requested language first
  if (translations[key][language]) {
    return translations[key][language];
  }
  
  // Fallback hierarchy: French -> English -> original key
  const fallbackOrder: AvailableLanguage[] = ['fr', 'en'];
  
  for (const fallbackLang of fallbackOrder) {
    if (translations[key][fallbackLang]) {
      // Log fallback usage in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Translation] Using fallback ${fallbackLang} for key: ${key} (requested: ${language})`);
      }
      return translations[key][fallbackLang];
    }
  }
  
  return key;
};

// Custom hook for translation
export const useTranslationUtil = (language: AvailableLanguage) => {
  return (key: string) => getTranslation(key, language);
};

// Utility function to get all missing translations for a language
export const getMissingTranslations = (language: AvailableLanguage): string[] => {
  const missing: string[] = [];
  
  Object.keys(translations).forEach(key => {
    if (!translations[key][language]) {
      missing.push(key);
    }
  });
  
  return missing;
};

// Utility function to validate all translations
export const validateTranslations = (): { [key in AvailableLanguage]: string[] } => {
  const results: { [key in AvailableLanguage]: string[] } = {
    fr: [],
    en: [],
    ar: [],
    pt: [],
    sw: [],
    am: []
  };
  
  Object.keys(results).forEach(lang => {
    results[lang as AvailableLanguage] = getMissingTranslations(lang as AvailableLanguage);
  });
  
  return results;
};

// Generate translation completion statistics
export const getTranslationStats = () => {
  const totalKeys = Object.keys(translations).length;
  const languages: AvailableLanguage[] = ['fr', 'en', 'ar', 'pt', 'sw', 'am'];
  
  const stats = languages.map(lang => {
    const translatedKeys = Object.keys(translations).filter(key => translations[key][lang]);
    const completionRate = (translatedKeys.length / totalKeys) * 100;
    
    return {
      language: lang,
      translated: translatedKeys.length,
      total: totalKeys,
      completionRate: Math.round(completionRate * 100) / 100,
      missing: getMissingTranslations(lang)
    };
  });
  
  return stats;
};

// Export translation checker for development
export const logTranslationStats = () => {
  if (process.env.NODE_ENV === 'development') {
    const stats = getTranslationStats();
    console.group('🌍 Translation Statistics');
    stats.forEach(stat => {
      console.log(`${stat.language.toUpperCase()}: ${stat.completionRate}% (${stat.translated}/${stat.total})`);
      if (stat.missing.length > 0) {
        console.warn(`Missing in ${stat.language}:`, stat.missing.slice(0, 5));
      }
    });
    console.groupEnd();
  }
};
