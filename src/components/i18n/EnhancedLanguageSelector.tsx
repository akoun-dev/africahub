
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Globe, 
  Languages, 
  MapPin, 
  CheckCircle,
  Flag
} from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  regions: string[];
  completion: number; // Pourcentage de traduction
}

export const EnhancedLanguageSelector: React.FC = () => {
  const { country, language, setLanguage } = useCountry();
  const { t } = useTranslation();
  
  const [languages] = useState<LanguageOption[]>([
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      regions: ['West Africa', 'Central Africa', 'North Africa'],
      completion: 100
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      regions: ['East Africa', 'South Africa', 'West Africa'],
      completion: 100
    },
    {
      code: 'ar',
      name: 'العربية',
      nativeName: 'Arabic',
      flag: '🇸🇦',
      regions: ['North Africa'],
      completion: 85
    },
    {
      code: 'pt',
      name: 'Português',
      nativeName: 'Português',
      flag: '🇵🇹',
      regions: ['Central Africa', 'West Africa'],
      completion: 75
    },
    {
      code: 'sw',
      name: 'Kiswahili',
      nativeName: 'Kiswahili',
      flag: '🇹🇿',
      regions: ['East Africa'],
      completion: 60
    },
    {
      code: 'am',
      name: 'አማርኛ',
      nativeName: 'Amharic',
      flag: '🇪🇹',
      regions: ['East Africa'],
      completion: 45
    }
  ]);

  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const getRecommendedLanguages = () => {
    if (!country) return languages.slice(0, 2);
    
    // Recommander les langues basées sur la région du pays
    const countryRegion = getCountryRegion(country.code);
    return languages.filter(lang => 
      lang.regions.includes(countryRegion) || lang.code === 'en' || lang.code === 'fr'
    );
  };

  const getCountryRegion = (countryCode: string): string => {
    const regions: Record<string, string> = {
      // West Africa
      'SN': 'West Africa', 'CI': 'West Africa', 'GH': 'West Africa', 'NG': 'West Africa',
      'BF': 'West Africa', 'ML': 'West Africa', 'NE': 'West Africa', 'BJ': 'West Africa',
      'TG': 'West Africa', 'GW': 'West Africa', 'LR': 'West Africa', 'SL': 'West Africa',
      
      // Central Africa
      'CM': 'Central Africa', 'GA': 'Central Africa', 'CF': 'Central Africa', 
      'TD': 'Central Africa', 'CG': 'Central Africa', 'CD': 'Central Africa', 'GQ': 'Central Africa',
      
      // East Africa
      'KE': 'East Africa', 'TZ': 'East Africa', 'UG': 'East Africa', 'ET': 'East Africa',
      'RW': 'East Africa', 'BI': 'East Africa', 'SO': 'East Africa', 'ER': 'East Africa',
      
      // North Africa
      'EG': 'North Africa', 'LY': 'North Africa', 'TN': 'North Africa', 
      'DZ': 'North Africa', 'MA': 'North Africa', 'SD': 'North Africa',
      
      // South Africa
      'ZA': 'South Africa', 'ZW': 'South Africa', 'BW': 'South Africa', 
      'NA': 'South Africa', 'ZM': 'South Africa', 'MW': 'South Africa'
    };
    
    return regions[countryCode] || 'West Africa';
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    
    // Enregistrer la préférence
    localStorage.setItem('preferred_language', newLanguage);
    
    console.log('Language changed to:', newLanguage);
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'bg-green-100 text-green-800';
    if (completion >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const recommendedLanguages = getRecommendedLanguages();
  const displayLanguages = showAllLanguages ? languages : recommendedLanguages;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {t('language.selector.title', 'Choisir la langue')}
        </CardTitle>
        {country && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{country.name}</span>
            <Badge variant="outline">{getCountryRegion(country.code)}</Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sélecteur rapide */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t('language.quick_select', 'Sélection rapide')}
          </label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {displayLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    {lang.completion < 100 && (
                      <Badge variant="outline" className="text-xs">
                        {lang.completion}%
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Liste détaillée */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {t('language.available', 'Langues disponibles')}
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllLanguages(!showAllLanguages)}
            >
              {showAllLanguages ? 
                t('language.show_recommended', 'Recommandées') : 
                t('language.show_all', 'Toutes')
              }
            </Button>
          </div>
          
          {displayLanguages.map((lang) => (
            <div
              key={lang.code}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                language === lang.code ? 'border-afroGreen bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <CheckCircle className="h-5 w-5 text-afroGreen" />
                  )}
                </div>
                
                <div className="text-right">
                  <Badge className={getCompletionColor(lang.completion)}>
                    {lang.completion}%
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {lang.regions.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informations sur la traduction */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Globe className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                {t('language.translation_info', 'À propos des traductions')}
              </p>
              <p className="text-blue-700 text-xs leading-relaxed">
                {t('language.translation_desc', 'Les traductions sont continuellement améliorées. Certaines langues peuvent avoir un contenu partiellement traduit.')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
