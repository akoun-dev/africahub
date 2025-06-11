
import { AvailableLanguage } from '@/contexts/CountryContext';

interface GenericTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const genericTranslations: GenericTranslations = {
  'platform.universal.title': {
    fr: 'Plateforme de Services Multi-Sectoriels',
    en: 'Multi-Sector Services Platform',
    ar: 'منصة خدمات متعددة القطاعات',
    pt: 'Plataforma de Serviços Multi-Setoriais',
    sw: 'Jukwaa la Huduma za Sekta Nyingi',
    am: 'የብዙ ዘርፍ አገልግሎቶች መድረክ'
  },
  'hero.generic.title': {
    fr: 'Trouvez et comparez les meilleurs services en Afrique',
    en: 'Find and compare the best services in Africa',
    ar: 'اعثر على أفضل الخدمات في أفريقيا وقارنها',
    pt: 'Encontre e compare os melhores serviços em África',
    sw: 'Pata na ulinganishe huduma bora zaidi Afrika',
    am: 'በአፍሪካ ምርጥ አገልግሎቶችን ያግኙ እና ያወዳድሩ'
  },
  'hero.generic.subtitle': {
    fr: 'Assurance, banque, télécommunications, énergie, immobilier et plus - comparez facilement toutes les offres',
    en: 'Insurance, banking, telecommunications, energy, real estate and more - easily compare all offers',
    ar: 'التأمين والمصرفية والاتصالات والطاقة والعقارات والمزيد - قارن جميع العروض بسهولة',
    pt: 'Seguros, bancos, telecomunicações, energia, imobiliário e mais - compare facilmente todas as ofertas',
    sw: 'Bima, benki, mawasiliano, nishati, mali na mengine - linganisha matoleo yote kwa urahisi',
    am: 'ኢንሹራንስ፣ ባንክ፣ ቴሌኮሙኒኬሽን፣ ሃይል፣ ሪል እስቴት እና ሌሎች - ሁሉንም ቅናሾች በቀላሉ ያወዳድሩ'
  },
  'sectors.all': {
    fr: 'Tous les secteurs',
    en: 'All sectors',
    ar: 'جميع القطاعات',
    pt: 'Todos os setores',
    sw: 'Sekta zote',
    am: 'ሁሉም ዘርፎች'
  },
  'cta.explore': {
    fr: 'Explorer maintenant',
    en: 'Explore now',
    ar: 'استكشف الآن',
    pt: 'Explorar agora',
    sw: 'Chunguza sasa',
    am: 'አሁን ያስሱ'
  },
  'stats.companies': {
    fr: 'Entreprises partenaires',
    en: 'Partner companies',
    ar: 'الشركات الشريكة',
    pt: 'Empresas parceiras',
    sw: 'Makampuni washirika',
    am: 'የአጋር ኩባንያዎች'
  },
  'stats.countries': {
    fr: 'Pays couverts',
    en: 'Countries covered',
    ar: 'البلدان المغطاة',
    pt: 'Países cobertos',
    sw: 'Nchi zilizoshughulikiwa',
    am: 'የተሸፈኑ አገሮች'
  },
  'stats.users': {
    fr: 'Utilisateurs actifs',
    en: 'Active users',
    ar: 'المستخدمون النشطون',
    pt: 'Usuários ativos',
    sw: 'Watumiaji wenye shughuli',
    am: 'ንቁ ተጠቃሚዎች'
  }
};
