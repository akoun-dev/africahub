
import { AvailableLanguage } from '@/contexts/CountryContext';

interface MapTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const mapTranslations: MapTranslations = {
  'map.interactive_badge': {
    en: 'Interactive Map',
    fr: 'Carte Interactive',
    ar: 'خريطة تفاعلية',
    pt: 'Mapa Interativo',
    sw: 'Ramani ya Ujamiiano',
    am: 'መስተጋብራዊ ካርታ'
  },
  'map.explore_sector_title': {
    en: 'Explore {sector} in Africa',
    fr: 'Explorez {sector} en Afrique',
    ar: 'استكشف {sector} في أفريقيا',
    pt: 'Explore {sector} na África',
    sw: 'Chunguza {sector} barani Afrika',
    am: '{sector} በአፍሪካ ያስሱ'
  },
  'map.explore_insurance_title': {
    en: 'Explore Insurance in Africa',
    fr: 'Explorez l\'Assurance en Afrique',
    ar: 'استكشف التأمين في أفريقيا',
    pt: 'Explore Seguros na África',
    sw: 'Chunguza Bima barani Afrika',
    am: 'በአፍሪካ መድን ያስሱ'
  },
  'map.explore_sector_description': {
    en: 'Discover {sector} markets across Africa with our interactive map. Click on a country to explore available opportunities.',
    fr: 'Découvrez les marchés {sector} africains avec notre carte interactive. Cliquez sur un pays pour explorer les opportunités disponibles.',
    ar: 'اكتشف أسواق {sector} الأفريقية باستخدام خريطتنا التفاعلية. انقر على بلد لاستكشاف الفرص المتاحة.',
    pt: 'Descubra os mercados {sector} africanos com nosso mapa interativo. Clique em um país para explorar as oportunidades disponíveis.',
    sw: 'Gundua masoko ya {sector} ya Kiafrika kwa kutumia ramani yetu ya ujamiiano. Bonyeza nchi ili kuchunguza fursa zinazopatikana.',
    am: 'በመስተጋብራዊ ካርታችን የአፍሪካ {sector} ገበያዎችን ያግኙ። የሚገኙ እድሎችን ለመመርመር በአንድ ሀገር ላይ ጠቅ ያድርጉ።'
  },
  'map.explore_insurance_description': {
    en: 'Discover African insurance markets with our interactive map. Click on a country to explore available opportunities.',
    fr: 'Découvrez les marchés d\'assurance africains avec notre carte interactive. Cliquez sur un pays pour explorer les opportunités disponibles.',
    ar: 'اكتشف أسواق التأمين الأفريقية باستخدام خريطتنا التفاعلية. انقر على بلد لاستكشاف الفرص المتاحة.',
    pt: 'Descubra os mercados de seguros africanos com nosso mapa interativo. Clique em um país para explorar as oportunidades disponíveis.',
    sw: 'Gundua masoko ya bima ya Kiafrika kwa kutumia ramani yetu ya ujamiiano. Bonyeza nchi ili kuchunguza fursa zinazopatikana.',
    am: 'በመስተጋብራዊ ካርታችን የአፍሪካ መድን ገበያዎችን ያግኙ። የሚገኙ እድሎችን ለመመርመር በአንድ ሀገር ላይ ጠቅ ያድርጉ።'
  },
  'map.sector_companies': {
    en: '{sector} companies',
    fr: 'Entreprises {sector}',
    ar: 'شركات {sector}',
    pt: 'Empresas {sector}',
    sw: 'Makampuni ya {sector}',
    am: '{sector} ኩባንያዎች'
  },
  'map.insurance_companies': {
    en: 'Insurance companies',
    fr: 'Compagnies d\'assurance',
    ar: 'شركات التأمين',
    pt: 'Companhias de seguros',
    sw: 'Makampuni ya bima',
    am: 'የመድን ኩባንያዎች'
  },
  'map.sector_enterprises': {
    en: 'Sector enterprises',
    fr: 'Entreprises du secteur',
    ar: 'مؤسسات القطاع',
    pt: 'Empresas do setor',
    sw: 'Makampuni ya sekta',
    am: 'የዘርፉ ድርጅቶች'
  },
  'map.market_view': {
    en: 'Market View',
    fr: 'Vue Marché',
    ar: 'عرض السوق',
    pt: 'Vista do Mercado',
    sw: 'Mwonekano wa Soko',
    am: 'የገበያ እይታ'
  },
  'map.statistics_view': {
    en: 'Statistics',
    fr: 'Statistiques',
    ar: 'الإحصائيات',
    pt: 'Estatísticas',
    sw: 'Takwimu',
    am: 'ስታቲስቲክስ'
  },
  'map.african_market_stats': {
    en: 'African market statistics',
    fr: 'Statistiques du marché africain',
    ar: 'إحصائيات السوق الأفريقية',
    pt: 'Estatísticas do mercado africano',
    sw: 'Takwimu za soko la Kiafrika',
    am: 'የአፍሪካ ገበያ ስታቲስቲክስ'
  },
  'map.total_companies': {
    en: 'Total companies',
    fr: 'Total entreprises',
    ar: 'إجمالي الشركات',
    pt: 'Total de empresas',
    sw: 'Jumla ya makampuni',
    am: 'አጠቃላይ ኩባንያዎች'
  },
  'map.countries_covered': {
    en: 'Countries covered',
    fr: 'Pays couverts',
    ar: 'البلدان المغطاة',
    pt: 'Países cobertos',
    sw: 'Nchi zilizofunikwa',
    am: 'የተሸፈኑ ሀገራት'
  },
  'map.total_population': {
    en: 'Total population',
    fr: 'Population totale',
    ar: 'إجمالي السكان',
    pt: 'População total',
    sw: 'Jumla ya watu',
    am: 'አጠቃላይ ህዝብ'
  },
  'map.top_markets': {
    en: 'Top markets',
    fr: 'Top des marchés',
    ar: 'أفضل الأسواق',
    pt: 'Principais mercados',
    sw: 'Masoko bora',
    am: 'ዋና ገበያዎች'
  },
  'map.companies_count': {
    en: 'companies',
    fr: 'entreprises',
    ar: 'شركات',
    pt: 'empresas',
    sw: 'makampuni',
    am: 'ኩባንያዎች'
  }
};
