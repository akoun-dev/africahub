
import { AvailableLanguage } from '@/contexts/CountryContext';

interface AnalyticsTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const analyticsTranslations: AnalyticsTranslations = {
  // Tab labels
  'tabs.recommendations': {
    en: 'Recommendations',
    fr: 'Recommandations',
    ar: 'التوصيات',
    pt: 'Recomendações',
    sw: 'Mapendekezo',
    am: 'ምክሮች'
  },
  'tabs.analytics': {
    en: 'Analytics',
    fr: 'Analytiques',
    ar: 'التحليلات',
    pt: 'Análises',
    sw: 'Uchambuzi',
    am: 'ትንታኔዎች'
  },
  'tabs.performance': {
    en: 'Performance',
    fr: 'Performance',
    ar: 'الأداء',
    pt: 'Desempenho',
    sw: 'Utendaji',
    am: 'አፈጻጸም'
  },

  // Analytics section
  'analytics.title': {
    en: 'Recommendation Analytics',
    fr: 'Analytiques des Recommandations',
    ar: 'تحليلات التوصيات',
    pt: 'Análises de Recomendações',
    sw: 'Uchambuzi wa Mapendekezo',
    am: 'የምክር ትንታኔዎች'
  },
  'analytics.subtitle': {
    en: 'Statistics and metrics of the recommendation system',
    fr: 'Statistiques et métriques du système de recommandations',
    ar: 'إحصائيات ومقاييس نظام التوصيات',
    pt: 'Estatísticas e métricas do sistema de recomendações',
    sw: 'Takwimu na vipimo vya mfumo wa mapendekezo',
    am: 'የምክር ስርዓት ስታቲስቲክስ እና መለኪያዎች'
  },
  'analytics.total_recommendations': {
    en: 'Total Recommendations',
    fr: 'Total Recommandations',
    ar: 'إجمالي التوصيات',
    pt: 'Total de Recomendações',
    sw: 'Jumla ya Mapendekezo',
    am: 'ጠቅላላ ምክሮች'
  },
  'analytics.views': {
    en: 'Views',
    fr: 'Vues',
    ar: 'المشاهدات',
    pt: 'Visualizações',
    sw: 'Miongozo',
    am: 'እይታዎች'
  },
  'analytics.clicks': {
    en: 'Clicks',
    fr: 'Clics',
    ar: 'النقرات',
    pt: 'Cliques',
    sw: 'Mibonyezo',
    am: 'ጠቅታዎች'
  },
  'analytics.conversions': {
    en: 'Conversions',
    fr: 'Conversions',
    ar: 'التحويلات',
    pt: 'Conversões',
    sw: 'Mabadiliko',
    am: 'ሙሉነቶች'
  },

  // Performance section
  'performance.title': {
    en: 'System Performance',
    fr: 'Performance du Système',
    ar: 'أداء النظام',
    pt: 'Desempenho do Sistema',
    sw: 'Utendaji wa Mfumo',
    am: 'የስርዓት አፈጻጸም'
  },
  'performance.subtitle': {
    en: 'Performance metrics and quality of recommendations',
    fr: 'Métriques de performance et qualité des recommandations',
    ar: 'مقاييس الأداء وجودة التوصيات',
    pt: 'Métricas de desempenho e qualidade das recomendações',
    sw: 'Vipimo vya utendaji na ubora wa mapendekezo',
    am: 'የአፈጻጸም መለኪያዎች እና የምክሮች ጥራት'
  },
  'performance.avg_confidence': {
    en: 'Average confidence score',
    fr: 'Score de confiance moyen',
    ar: 'متوسط درجة الثقة',
    pt: 'Pontuação média de confiança',
    sw: 'Wastani wa alama ya uaminifu',
    am: 'አማካይ የመተማመኛ ነጥብ'
  },
  'performance.conversion_rate': {
    en: 'Conversion rate',
    fr: 'Taux de conversion',
    ar: 'معدل التحويل',
    pt: 'Taxa de conversão',
    sw: 'Kiwango cha ubadilishaji',
    am: 'የመቀየሪያ መጠን'
  }
};
