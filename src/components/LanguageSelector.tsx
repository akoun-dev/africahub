
import React from 'react';
import { Check, Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useCountry, AvailableLanguage } from '@/contexts/CountryContext';
import { getLanguageDisplayName } from '@/hooks/geolocation/languageMapping';

// Language display names
const languageNames: Record<AvailableLanguage, string> = {
  'en': 'English',
  'fr': 'Français',
  'ar': 'العربية',
  'pt': 'Português',
  'sw': 'Kiswahili',
  'am': 'አማርኛ'
};

export const LanguageSelector = () => {
  const { 
    country, 
    language, 
    setLanguage, 
    autoLanguageEnabled, 
    setAutoLanguageEnabled 
  } = useCountry();
  
  // Filter available languages based on the selected country
  const availableLanguages: AvailableLanguage[] = country.languages
    .map(lang => lang.toLowerCase() as AvailableLanguage)
    .filter(lang => Object.keys(languageNames).includes(lang));
  
  // If no languages match our supported list, default to English
  if (availableLanguages.length === 0) {
    availableLanguages.push('en');
  }
  
  // Always show selector for language preferences
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">{languageNames[language]}</span>
            {autoLanguageEnabled && (
              <span className="text-xs bg-green-100 text-green-700 px-1 rounded">Auto</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[280px]" align="end">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Préférences de langue</h3>
              <Settings className="h-4 w-4 text-gray-500" />
            </div>
            
            {/* Auto language toggle */}
            <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium">Langue automatique</p>
                <p className="text-xs text-gray-600">Changer selon le pays</p>
              </div>
              <Switch
                checked={autoLanguageEnabled}
                onCheckedChange={setAutoLanguageEnabled}
              />
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-1">
              <p className="text-xs text-gray-600 mb-2">Langues disponibles :</p>
              {availableLanguages.map((lang) => (
                <Button
                  key={lang}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setLanguage(lang)}
                >
                  {languageNames[lang]}
                  {lang === language && (
                    <Check className="ml-auto h-4 w-4 text-green-600" />
                  )}
                </Button>
              ))}
            </div>
            
            {autoLanguageEnabled && (
              <div className="mt-3 p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-700">
                  💡 La langue changera automatiquement selon le pays sélectionné
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
