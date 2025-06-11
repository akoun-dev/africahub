
import { AvailableLanguage } from '@/contexts/CountryContext';

interface RecommendationsTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const recommendationsTranslations: RecommendationsTranslations = {
  // Recommendations page
  'recommendations.title': {
    en: 'AI Recommendation System',
    fr: 'Système de Recommandations IA',
    ar: 'نظام التوصيات بالذكاء الاصطناعي',
    pt: 'Sistema de Recomendações IA',
    sw: 'Mfumo wa Mapendekezo ya AI',
    am: 'የAI ምክር ስርዓት'
  },
  'recommendations.subtitle': {
    en: 'Complete demonstration of the intelligent recommendation engine',
    fr: 'Démonstration complète du moteur de recommandations intelligent',
    ar: 'عرض شامل لمحرك التوصيات الذكي',
    pt: 'Demonstração completa do motor de recomendações inteligente',
    sw: 'Onyesho kamili la injini ya mapendekezo mahiri',
    am: 'የብልሃተኛ ምክር ሞተር ሙሉ ማሳያ'
  },
  'recommendations.insurance_type': {
    en: 'Insurance Type',
    fr: 'Type d\'assurance',
    ar: 'نوع التأمين',
    pt: 'Tipo de Seguro',
    sw: 'Aina ya Bima',
    am: 'የኢንሹራንስ አይነት'
  },
  'recommendations.generate': {
    en: 'Generate Recommendations',
    fr: 'Générer Recommandations',
    ar: 'إنشاء توصيات',
    pt: 'Gerar Recomendações',
    sw: 'Tengeneza Mapendekezo',
    am: 'ምክሮችን አዘጋጅ'
  },
  'recommendations.refresh': {
    en: 'Refresh',
    fr: 'Actualiser',
    ar: 'تحديث',
    pt: 'Atualizar',
    sw: 'Onyesha upya',
    am: 'አድስ'
  },
  'recommendations.loading': {
    en: 'Loading recommendations...',
    fr: 'Chargement des recommandations...',
    ar: 'جاري تحميل التوصيات...',
    pt: 'Carregando recomendações...',
    sw: 'Inapakia mapendekezo...',
    am: 'ምክሮችን እየጫነ...'
  },
  'recommendations.error_loading': {
    en: 'Error loading recommendations',
    fr: 'Erreur lors du chargement des recommandations',
    ar: 'خطأ في تحميل التوصيات',
    pt: 'Erro ao carregar recomendações',
    sw: 'Hitilafu ya kupakia mapendekezo',
    am: 'ምክሮችን በመጫን ላይ ስህተት'
  },
  'recommendations.no_available': {
    en: 'No recommendations available',
    fr: 'Aucune recommandation disponible',
    ar: 'لا توجد توصيات متاحة',
    pt: 'Nenhuma recomendação disponível',
    sw: 'Hakuna mapendekezo yaliyopatikana',
    am: 'ምንም ምክሮች አይገኙም'
  },
  'recommendations.create_personalized': {
    en: 'Generate personalized recommendations for this insurance type',
    fr: 'Générez des recommandations personnalisées pour ce type d\'assurance',
    ar: 'إنشاء توصيات مخصصة لنوع التأمين هذا',
    pt: 'Gere recomendações personalizadas para este tipo de seguro',
    sw: 'Tengeneza mapendekezo ya kibinafsi kwa aina hii ya bima',
    am: 'ለዚህ የኢንሹራንስ አይነት ተበጁ ምክሮችን ያዘጋጁ'
  },
  'recommendations.create_my': {
    en: 'Create my recommendations',
    fr: 'Créer mes recommandations',
    ar: 'إنشاء توصياتي',
    pt: 'Criar minhas recomendações',
    sw: 'Unda mapendekezo yangu',
    am: 'የእኔን ምክሮች ፍጠር'
  },
  'recommendations.recommendation_id': {
    en: 'Recommendation',
    fr: 'Recommandation',
    ar: 'توصية',
    pt: 'Recomendação',
    sw: 'Pendekezo',
    am: 'ምክር'
  },
  'recommendations.type': {
    en: 'Type',
    fr: 'Type',
    ar: 'النوع',
    pt: 'Tipo',
    sw: 'Aina',
    am: 'አይነት'
  },
  'recommendations.sector': {
    en: 'Sector',
    fr: 'Secteur',
    ar: 'القطاع',
    pt: 'Setor',
    sw: 'Sekta',
    am: 'ዘርፍ'
  },
  'recommendations.factors': {
    en: 'Recommendation factors',
    fr: 'Facteurs de recommandation',
    ar: 'عوامل التوصية',
    pt: 'Fatores de recomendação',
    sw: 'Mambo ya mapendekezo',
    am: 'የምክር ምክንያቶች'
  },
  'recommendations.confidence_score': {
    en: 'Confidence score',
    fr: 'Score de confiance',
    ar: 'درجة الثقة',
    pt: 'Pontuação de confiança',
    sw: 'Alama ya uaminifu',
    am: 'የመተማመኛ ነጥብ'
  },
  'recommendations.geo_match': {
    en: 'Geographic match',
    fr: 'Correspondance géo',
    ar: 'التطابق الجغرافي',
    pt: 'Correspondência geográfica',
    sw: 'Mfumo wa kijiografia',
    am: 'የጂኦግራፊ ተመሳሳይነት'
  },
  'recommendations.relevance': {
    en: 'Relevance',
    fr: 'Pertinence',
    ar: 'الصلة',
    pt: 'Relevância',
    sw: 'Uhusiano',
    am: 'ተዛማጅነት'
  },
  'recommendations.mark_viewed': {
    en: 'Mark as viewed',
    fr: 'Marquer comme vu',
    ar: 'تحديد كمرئي',
    pt: 'Marcar como visto',
    sw: 'Alama kama imeangaliwa',
    am: 'እንደታየ ምልክት አድርግ'
  },
  'recommendations.viewed': {
    en: 'Viewed',
    fr: 'Vu',
    ar: 'مرئي',
    pt: 'Visto',
    sw: 'Imeangaliwa',
    am: 'ታይቷል'
  },
  'recommendations.click': {
    en: 'Click',
    fr: 'Cliquer',
    ar: 'انقر',
    pt: 'Clique',
    sw: 'Bonyeza',
    am: 'ጠቅ'
  },
  'recommendations.clicked': {
    en: 'Clicked',
    fr: 'Cliqué',
    ar: 'تم النقر',
    pt: 'Clicado',
    sw: 'Imebonyezwa',
    am: 'ተጠቅቷል'
  },
  'recommendations.simulate_purchase': {
    en: 'Simulate purchase',
    fr: 'Simuler achat',
    ar: 'محاكاة الشراء',
    pt: 'Simular compra',
    sw: 'Igiza ununuzi',
    am: 'ግዢን ኮንካ'
  },
  'recommendations.purchased': {
    en: 'Purchased',
    fr: 'Acheté',
    ar: 'تم الشراء',
    pt: 'Comprado',
    sw: 'Imenunuliwa',
    am: 'ተገዝቷል'
  },
  'recommendations.created': {
    en: 'Created',
    fr: 'Créé',
    ar: 'تم الإنشاء',
    pt: 'Criado',
    sw: 'Imeundwa',
    am: 'ተፈጥሯል'
  },
  'recommendations.expires': {
    en: 'Expires',
    fr: 'Expire',
    ar: 'ينتهي',
    pt: 'Expira',
    sw: 'Inaisha',
    am: 'ያልቃል'
  }
};
