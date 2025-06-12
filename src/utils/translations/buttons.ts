
import { AvailableLanguage } from '@/contexts/CountryContext';

interface ButtonsTranslations {
  [key: string]: {
    [key in AvailableLanguage]?: string;
  };
}

export const buttonsTranslations: ButtonsTranslations = {
  'button.compare': {
    en: 'Compare Services',
    fr: 'Comparer les Services',
    ar: 'قارن الخدمات',
    pt: 'Comparar Serviços',
    sw: 'Linganisha Huduma',
    am: 'አገልግሎቶችን አወዳድር'
  },
  'button.quote': {
    en: 'Get Quote',
    fr: 'Obtenir un Devis',
    ar: 'احصل على عرض سعر',
    pt: 'Obter Cotação',
    sw: 'Pata Bei',
    am: 'ዋጋ አግኝ'
  },
  'button.explore': {
    en: 'Explore',
    fr: 'Explorer',
    ar: 'استكشف',
    pt: 'Explorar',
    sw: 'Chunguza',
    am: 'ያስሱ'
  },
  'button.recommendations': {
    en: 'Get Recommendations',
    fr: 'Obtenir des Recommandations',
    ar: 'احصل على التوصيات',
    pt: 'Obter Recomendações',
    sw: 'Pata Mapendekezo',
    am: 'ምክሮችን አግኝ'
  }
};
