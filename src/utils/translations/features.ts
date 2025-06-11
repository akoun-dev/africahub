
import { AvailableLanguage } from '@/contexts/CountryContext';

interface FeaturesTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const featuresTranslations: FeaturesTranslations = {
  'features.service': {
    en: 'Service',
    fr: 'Service',
    ar: 'خدمة',
    pt: 'Serviço',
    sw: 'Huduma',
    am: 'አገልግሎት'
  },
  'features.description': {
    en: 'Description of the service and its benefits for African users.',
    fr: 'Description du service et de ses avantages pour les utilisateurs africains.',
    ar: 'وصف الخدمة وفوائدها للمستخدمين الأفارقة.',
    pt: 'Descrição do serviço e seus benefícios para usuários africanos.',
    sw: 'Maelezo ya huduma na faida zake kwa watumiaji wa Afrika.',
    am: 'የአገልግሎቱ መግለጫ እና ለአፍሪካ ተጠቃሚዎች ያሉት ጥቅሞች።'
  },
  'features.price_from': {
    en: 'From',
    fr: 'À partir de',
    ar: 'ابتداءً من',
    pt: 'A partir de',
    sw: 'Kuanzia',
    am: 'ከ'
  },
  'features.per_month': {
    en: '/month',
    fr: '/mois',
    ar: '/شهر',
    pt: '/mês',
    sw: '/mwezi',
    am: '/ወር'
  },
  'features.african_optimization': {
    en: 'African Optimized',
    fr: 'Optimisé pour l\'Afrique',
    ar: 'محسّن لأفريقيا',
    pt: 'Otimizado para África',
    sw: 'Imeboreshwa kwa Afrika',
    am: 'ለአፍሪካ የተመቻቸ'
  },
  'features.african_optimization_desc': {
    en: 'Tailored for African markets',
    fr: 'Adapté aux marchés africains',
    ar: 'مخصص للأسواق الأفريقية',
    pt: 'Adaptado aos mercados africanos',
    sw: 'Imeundwa kwa masoko ya Afrika',
    am: 'ለአፍሪካ ገበያዎች የተዘጋጀ'
  },
  'features.smart_comparison': {
    en: 'Smart Comparison',
    fr: 'Comparaison Intelligente',
    ar: 'مقارنة ذكية',
    pt: 'Comparação Inteligente',
    sw: 'Ulinganisho wa Akili',
    am: 'ዘመናዊ ማወዳደሪያ'
  },
  'features.smart_comparison_desc': {
    en: 'AI-powered analysis',
    fr: 'Analyse alimentée par l\'IA',
    ar: 'تحليل مدعوم بالذكاء الاصطناعي',
    pt: 'Análise alimentada por IA',
    sw: 'Uchambuzi wa AI',
    am: 'በAI የተጎላበተ ትንተና'
  },
  'features.ai_assistant': {
    en: 'AI Assistant',
    fr: 'Assistant IA',
    ar: 'مساعد ذكي',
    pt: 'Assistente IA',
    sw: 'Msaidizi wa AI',
    am: 'AI አጋዥ'
  },
  'features.ai_assistant_desc': {
    en: 'Personal guidance',
    fr: 'Guidance personnalisée',
    ar: 'إرشاد شخصي',
    pt: 'Orientação personalizada',
    sw: 'Mwongozo wa kibinafsi',
    am: 'የግል መመሪያ'
  }
};
