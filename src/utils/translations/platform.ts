
import { AvailableLanguage } from '@/contexts/CountryContext';

interface PlatformTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const platformTranslations: PlatformTranslations = {
  'platform.name': {
    en: 'AfricaHub',
    fr: 'AfricaHub',
    ar: 'أفريقيا هب',
    pt: 'AfricaHub',
    sw: 'AfricaHub',
    am: 'አፍሪካ ሀብ'
  },
  'platform.tagline': {
    en: 'Multi-Sector Platform',
    fr: 'Plateforme Multi-Sectorielle',
    ar: 'منصة متعددة القطاعات',
    pt: 'Plataforma Multi-Setorial',
    sw: 'Jukwaa la Sekta Nyingi',
    am: 'የብዙ ዘርፍ መድረክ'
  },
  'platform.hero.title': {
    en: 'Compare and choose the best services across Africa',
    fr: 'Comparez et choisissez les meilleurs services à travers l\'Afrique',
    ar: 'قارن واختر أفضل الخدمات في جميع أنحاء أفريقيا',
    pt: 'Compare e escolha os melhores serviços em toda a África',
    sw: 'Linganisha na uchague huduma bora zaidi Afrika nzima',
    am: 'በመላው አፍሪካ ምርጥ አገልግሎቶችን ያወዳድሩ እና ይምረጡ'
  },
  'platform.hero.subtitle': {
    en: 'From insurance to banking, telecommunications to energy - find the perfect service for your needs with our intelligent comparison platform.',
    fr: 'De l\'assurance à la banque, des télécommunications à l\'énergie - trouvez le service parfait pour vos besoins avec notre plateforme de comparaison intelligente.',
    ar: 'من التأمين إلى المصرفية، ومن الاتصالات إلى الطاقة - اعثر على الخدمة المثالية لاحتياجاتك مع منصة المقارنة الذكية لدينا.',
    pt: 'De seguros a bancos, telecomunicações a energia - encontre o serviço perfeito para suas necessidades com nossa plataforma de comparação inteligente.',
    sw: 'Kutoka bima hadi benki, mawasiliano hadi nishati - pata huduma kamili kwa mahitaji yako na jukwaa letu la kulinganisha kwa akili.',
    am: 'ከኢንሹራንስ እስከ ባንክ፣ ከቴሌኮሙኒኬሽን እስከ ሃይል - በእኛ የብልህ ማወዳደሪያ መድረክ ለፍላጎትዎ ትክክለኛውን አገልግሎት ያግኙ።'
  }
};
