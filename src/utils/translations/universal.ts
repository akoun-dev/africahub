
import { AvailableLanguage } from '@/contexts/CountryContext';

interface UniversalTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const universalTranslations: UniversalTranslations = {
  'platform.universal.title': {
    fr: 'Plateforme de Comparaison Multi-Sectorielle',
    en: 'Multi-Sector Comparison Platform',
    ar: 'منصة مقارنة متعددة القطاعات',
    pt: 'Plataforma de Comparação Multi-Setorial',
    sw: 'Jukwaa la Kulinganisha Sekta Nyingi',
    am: 'የብዙ ዘርፍ ማወዳደሪያ መድረክ'
  },
  'platform.universal.tagline': {
    fr: 'Comparez, Choisissez, Économisez - Tous Secteurs',
    en: 'Compare, Choose, Save - All Sectors',
    ar: 'قارن، اختر، وفر - جميع القطاعات',
    pt: 'Compare, Escolha, Poupe - Todos os Setores',
    sw: 'Linganisha, Chagua, Okoa - Sekta Zote',
    am: 'ያወዳድሩ፣ ይምረጡ፣ ይቆጥቡ - ሁሉም ዘርፎች'
  },
  'hero.universal.title': {
    fr: 'Comparez les meilleurs services d\'Afrique',
    en: 'Compare the best services in Africa',
    ar: 'قارن أفضل الخدمات في أفريقيا',
    pt: 'Compare os melhores serviços da África',
    sw: 'Linganisha huduma bora za Afrika',
    am: 'የአፍሪካን ምርጥ አገልግሎቶች ያወዳድሩ'
  },
  'hero.universal.subtitle': {
    fr: 'Assurance, banque, télécoms, énergie, immobilier et transport - trouvez les offres adaptées à vos besoins',
    en: 'Insurance, banking, telecoms, energy, real estate and transport - find offers that suit your needs',
    ar: 'التأمين والمصرفية والاتصالات والطاقة والعقارات والنقل - اعثر على العروض التي تناسب احتياجاتك',
    pt: 'Seguros, bancos, telecomunicações, energia, imobiliário e transporte - encontre ofertas adequadas às suas necessidades',
    sw: 'Bima, benki, mawasiliano, nishati, mali na usafiri - pata matoleo yanayofaa mahitaji yako',
    am: 'ኢንሹራንስ፣ ባንክ፣ ቴሌኮሙኒኬሽን፣ ሃይል፣ ሪል እስቴት እና ትራንስፖርት - ለፍላጎትዎ የሚስማሙ ቅናሾችን ያግኙ'
  },
  'sectors.explore.title': {
    fr: 'Explorez Nos Secteurs',
    en: 'Explore Our Sectors',
    ar: 'استكشف قطاعاتنا',
    pt: 'Explore Nossos Setores',
    sw: 'Chunguza Sekta Zetu',
    am: 'የእኛን ዘርፎች ያስሱ'
  },
  'sectors.popular': {
    fr: 'Secteurs populaires',
    en: 'Popular sectors',
    ar: 'القطاعات الشعبية',
    pt: 'Setores populares',
    sw: 'Sekta maarufu',
    am: 'ተወዳጅ ዘርፎች'
  },
  'search.universal.placeholder': {
    fr: 'Rechercher un service, produit ou secteur...',
    en: 'Search for a service, product or sector...',
    ar: 'البحث عن خدمة أو منتج أو قطاع...',
    pt: 'Procurar um serviço, produto ou setor...',
    sw: 'Tafuta huduma, bidhaa au sekta...',
    am: 'አገልግሎት፣ ምርት ወይም ዘርፍ ይፈልጉ...'
  }
};
