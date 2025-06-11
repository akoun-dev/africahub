
import { AvailableLanguage } from '@/contexts/CountryContext';

interface SectorsTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const sectorsTranslations: SectorsTranslations = {
  'sectors.title': {
    en: 'Explore all sectors',
    fr: 'Explorez tous les secteurs',
    ar: 'استكشف جميع القطاعات',
    pt: 'Explore todos os setores',
    sw: 'Chunguza sekta zote',
    am: 'ሁሉንም ዘርፎች ያስሱ'
  },
  'sectors.subtitle': {
    en: 'Discover services tailored to your needs in each sector',
    fr: 'Découvrez les services adaptés à vos besoins dans chaque secteur d\'activité',
    ar: 'اكتشف الخدمات المصممة خصيصاً لاحتياجاتك في كل قطاع نشاط',
    pt: 'Descubra serviços adaptados às suas necessidades em cada setor de atividade',
    sw: 'Gundua huduma zilizofaa mahitaji yako katika kila sekta ya shughuli',
    am: 'በእያንዳንዱ የእንቅስቃሴ ዘርፍ ውስጥ ለፍላጎትዎ ተስማሚ የሆኑ አገልግሎቶችን ያግኙ'
  },
  'sectors.insurance': {
    en: 'Insurance',
    fr: 'Assurance',
    ar: 'التأمين',
    pt: 'Seguros',
    sw: 'Bima',
    am: 'ኢንሹራንስ'
  },
  'sectors.banking': {
    en: 'Banking',
    fr: 'Banque',
    ar: 'المصرفية',
    pt: 'Bancário',
    sw: 'Benki',
    am: 'ባንክ'
  },
  'sectors.energy': {
    en: 'Energy',
    fr: 'Énergie',
    ar: 'الطاقة',
    pt: 'Energia',
    sw: 'Nishati',
    am: 'ሃይል'
  },
  'sectors.telecom': {
    en: 'Telecoms',
    fr: 'Télécoms',
    ar: 'الاتصالات',
    pt: 'Telecomunicações',
    sw: 'Mawasiliano',
    am: 'ቴሌኮሙኒኬሽን'
  },
  'sectors.real_estate': {
    en: 'Real Estate',
    fr: 'Immobilier',
    ar: 'العقارات',
    pt: 'Imobiliário',
    sw: 'Mali isiyohamishika',
    am: 'ሪል እስቴት'
  },
  'sectors.transport': {
    en: 'Transport',
    fr: 'Transport',
    ar: 'النقل',
    pt: 'Transporte',
    sw: 'Usafiri',
    am: 'ትራንስፖርት'
  }
};
