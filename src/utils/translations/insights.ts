
import { AvailableLanguage } from '@/contexts/CountryContext';

interface InsightsTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const insightsTranslations: InsightsTranslations = {
  'insights.personal.title': {
    en: 'Your Personalized Multi-Sector Insights',
    fr: 'Vos insights personnalisés multi-sectoriels',
    ar: 'رؤاكم الشخصية متعددة القطاعات',
    pt: 'Seus insights personalizados multi-setoriais',
    sw: 'Maarifa yako ya kibinafsi ya sekta nyingi',
    am: 'የእርስዎ የግል ባለብዙ ዘርፍ ግንዛቤዎች'
  },
  'insights.empty.title': {
    en: 'No Insights Available Yet',
    fr: 'Aucun insight disponible pour le moment',
    ar: 'لا توجد رؤى متاحة حتى الآن',
    pt: 'Nenhum insight disponível ainda',
    sw: 'Hakuna maarifa yaliyopatikana bado',
    am: 'እስካሁን ምንም ግንዛቤዎች አይገኙም'
  },
  'insights.empty.description': {
    en: 'Start exploring our platform to get personalized recommendations and insights.',
    fr: 'Commencez à explorer notre plateforme pour obtenir des recommandations et insights personnalisés.',
    ar: 'ابدأ باستكشاف منصتنا للحصول على توصيات ورؤى شخصية.',
    pt: 'Comece a explorar nossa plataforma para obter recomendações e insights personalizados.',
    sw: 'Anza kuchunguza jukwaa letu ili kupata mapendekezo na maarifa ya kibinafsi.',
    am: 'የግል ምክሮች እና ግንዛቤዎች ለማግኘት የእኛን መድረክ ማሰስ ይጀምሩ።'
  },
  'insights.generate.button': {
    en: 'Generate Insights',
    fr: 'Générer des insights',
    ar: 'توليد الرؤى',
    pt: 'Gerar insights',
    sw: 'Zalisha maarifa',
    am: 'ግንዛቤዎችን ይፍጠሩ'
  },
  'insights.opportunity.detected': {
    en: 'New opportunity detected',
    fr: 'Nouvelle opportunité détectée',
    ar: 'تم اكتشاف فرصة جديدة',
    pt: 'Nova oportunidade detectada',
    sw: 'Fursa mpya imegunduliwa',
    am: 'አዲስ እድል ተለይቷል'
  },
  'insights.market.trend': {
    en: 'Market trend',
    fr: 'Tendance du marché',
    ar: 'اتجاه السوق',
    pt: 'Tendência do mercado',
    sw: 'Muelekeo wa soko',
    am: 'የገበያ አዝማሚያ'
  },
  'insights.personalized.recommendation': {
    en: 'Personalized recommendation',
    fr: 'Recommandation personnalisée',
    ar: 'توصية شخصية',
    pt: 'Recomendação personalizada',
    sw: 'Pendekezo la kibinafsi',
    am: 'የግል ምክር'
  },
  'insights.confidence.reliable': {
    en: 'reliable',
    fr: 'fiable',
    ar: 'موثوق',
    pt: 'confiável',
    sw: 'ya kuaminika',
    am: 'አስተማማኝ'
  },
  'insights.action.view_options': {
    en: 'View options',
    fr: 'Voir les options',
    ar: 'عرض الخيارات',
    pt: 'Ver opções',
    sw: 'Ona chaguo',
    am: 'አማራጮችን ይመልከቱ'
  },
  'insights.action.compare_now': {
    en: 'Compare now',
    fr: 'Comparer maintenant',
    ar: 'قارن الآن',
    pt: 'Comparar agora',
    sw: 'Linganisha sasa',
    am: 'አሁን ያወዳድሩ'
  },
  'insights.action.discover': {
    en: 'Discover',
    fr: 'Découvrir',
    ar: 'اكتشف',
    pt: 'Descobrir',
    sw: 'Gundua',
    am: 'ያግኙ'
  },
  'insights.ai_title': {
    en: 'AI Insights',
    fr: 'IA Insights',
    ar: 'رؤى الذكاء الاصطناعي',
    pt: 'Insights de IA',
    sw: 'Maarifa ya AI',
    am: 'AI ግንዛቤዎች'
  },
  'insights.new_badge': {
    en: 'New',
    fr: 'Nouveau',
    ar: 'جديد',
    pt: 'Novo',
    sw: 'Mpya',
    am: 'አዲስ'
  },
  'insights.recommendations_available': {
    en: 'AI recommendations available',
    fr: 'recommandations IA disponibles',
    ar: 'توصيات الذكاء الاصطناعي متاحة',
    pt: 'recomendações de IA disponíveis',
    sw: 'mapendekezo ya AI yanapatikana',
    am: 'AI ምክሮች አገኛለሁ'
  },
  'insights.view_all_recommendations': {
    en: 'View all recommendations',
    fr: 'Voir toutes les recommandations',
    ar: 'عرض جميع التوصيات',
    pt: 'Ver todas as recomendações',
    sw: 'Ona mapendekezo yote',
    am: 'ሁሉንም ምክሮች ይመልከቱ'
  }
};
