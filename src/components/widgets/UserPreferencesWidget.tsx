
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Calendar, Target, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountry } from '@/contexts/CountryContext';
import { getLanguageDisplayName } from '@/hooks/geolocation/languageMapping';

interface UserPreferencesWidgetProps {
  className?: string;
}

export const UserPreferencesWidget: React.FC<UserPreferencesWidgetProps> = ({
  className = ""
}) => {
  const { 
    country, 
    language, 
    autoLanguageEnabled, 
    setAutoLanguageEnabled 
  } = useCountry();
  
  const [notifications, setNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [preferredSector, setPreferredSector] = useState('');

  const getLocalPreferences = (countryCode: string) => {
    const preferences: Record<string, {
      dateFormat: string;
      numberFormat: string;
      popularSectors: string[];
      businessHours: string;
    }> = {
      'NG': {
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '1,000.00',
        popularSectors: ['Banking', 'Insurance', 'Telecom'],
        businessHours: '8h-17h WAT'
      },
      'ZA': {
        dateFormat: 'YYYY/MM/DD',
        numberFormat: '1 000,00',
        popularSectors: ['Insurance', 'Banking', 'Mining'],
        businessHours: '8h-17h SAST'
      },
      'KE': {
        dateFormat: 'DD/MM/YYYY',
        numberFormat: '1,000.00',
        popularSectors: ['Mobile Money', 'Agriculture', 'Insurance'],
        businessHours: '8h-17h EAT'
      }
    };

    return preferences[countryCode] || {
      dateFormat: 'DD/MM/YYYY',
      numberFormat: '1,000.00',
      popularSectors: ['Banking', 'Insurance'],
      businessHours: '8h-17h'
    };
  };

  const localPrefs = getLocalPreferences(country.code);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={className}
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-afroGreen" />
            <span>Préférences Locales</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Language preferences */}
          <div className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-afroBlue" />
                <span className="text-sm font-medium">Langue automatique</span>
              </div>
              <Switch
                checked={autoLanguageEnabled}
                onCheckedChange={setAutoLanguageEnabled}
              />
            </div>
            <p className="text-xs text-gray-600 mb-1">Langue actuelle : {getLanguageDisplayName(language)}</p>
            {autoLanguageEnabled ? (
              <p className="text-xs text-green-600">✓ Changement automatique activé</p>
            ) : (
              <p className="text-xs text-amber-600">⚡ Changement manuel activé</p>
            )}
          </div>

          {/* Formats locaux */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-afroGold" />
                <span className="text-sm font-medium">Format date</span>
              </div>
              <p className="text-xs text-gray-600">{localPrefs.dateFormat}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-bold">#</span>
                <span className="text-sm font-medium">Format nombre</span>
              </div>
              <p className="text-xs text-gray-600">{localPrefs.numberFormat}</p>
            </div>
          </div>

          {/* Secteur préféré */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Secteur d'intérêt principal
            </label>
            <Select value={preferredSector} onValueChange={setPreferredSector}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un secteur" />
              </SelectTrigger>
              <SelectContent>
                {localPrefs.popularSectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-afroRed" />
                <span className="text-sm font-medium">Notifications push</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-afroGreen" />
                <span className="text-sm font-medium">Rapports hebdomadaires</span>
              </div>
              <Switch
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </div>

          {/* Heures d'activité */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Heures d'activité locales</p>
            <p className="text-sm font-medium">{localPrefs.businessHours}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
