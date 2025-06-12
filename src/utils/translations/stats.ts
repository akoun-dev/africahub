
import { AvailableLanguage } from '@/contexts/CountryContext';

interface StatsTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const statsTranslations: StatsTranslations = {
  'stats.companies': {
    en: '500+',
    fr: '500+',
    ar: '500+',
    pt: '500+',
    sw: '500+',
    am: '500+'
  },
  'stats.companies_label': {
    en: 'Partner Companies',
    fr: 'Entreprises Partenaires',
    ar: 'شركات شريكة',
    pt: 'Empresas Parceiras',
    sw: 'Makampuni Washirika',
    am: 'አጋር ኩባንያዎች'
  },
  'stats.countries': {
    en: '54',
    fr: '54',
    ar: '54',
    pt: '54',
    sw: '54',
    am: '54'
  },
  'stats.countries_label': {
    en: 'African Countries',
    fr: 'Pays Africains',
    ar: 'دول أفريقية',
    pt: 'Países Africanos',
    sw: 'Nchi za Afrika',
    am: 'የአፍሪካ ሀገራት'
  },
  'stats.users': {
    en: '1M+',
    fr: '1M+',
    ar: '1M+',
    pt: '1M+',
    sw: '1M+',
    am: '1M+'
  },
  'stats.users_label': {
    en: 'Active Users',
    fr: 'Utilisateurs Actifs',
    ar: 'مستخدمون نشطون',
    pt: 'Usuários Ativos',
    sw: 'Watumiaji Hai',
    am: 'ንቁ ተጠቃሚዎች'
  },
  'hero.stat_companies_value': {
    en: '500+',
    fr: '500+',
    ar: '500+',
    pt: '500+',
    sw: '500+',
    am: '500+'
  },
  'hero.stat_companies_label': {
    en: 'Partner Companies',
    fr: 'Entreprises Partenaires',
    ar: 'شركات شريكة',
    pt: 'Empresas Parceiras',
    sw: 'Makampuni Washirika',
    am: 'አጋር ኩባንያዎች'
  },
  'hero.stat_countries_value': {
    en: '54',
    fr: '54',
    ar: '54',
    pt: '54',
    sw: '54',
    am: '54'
  },
  'hero.stat_countries_label': {
    en: 'African Countries',
    fr: 'Pays Africains',
    ar: 'دول أفريقية',
    pt: 'Países Africanos',
    sw: 'Nchi za Afrika',
    am: 'የአፍሪካ ሀገራት'
  },
  'hero.stat_users_value': {
    en: '1M+',
    fr: '1M+',
    ar: '1M+',
    pt: '1M+',
    sw: '1M+',
    am: '1M+'
  },
  'hero.stat_users_label': {
    en: 'Active Users',
    fr: 'Utilisateurs Actifs',
    ar: 'مستخدمون نشطون',
    pt: 'Usuários Ativos',
    sw: 'Watumiaji Hai',
    am: 'ንቁ ተጠቃሚዎች'
  }
};
