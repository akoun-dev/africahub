
import { useCountry } from '@/contexts/CountryContext';
import { getTranslation } from '@/utils/translations';

export const useTranslation = () => {
  const { language } = useCountry();
  
  const t = (key: string, fallback?: string) => {
    return getTranslation(key, language) || fallback || key;
  };
  
  return { t, language };
};
