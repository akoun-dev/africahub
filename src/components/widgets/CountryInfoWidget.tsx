
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Clock, DollarSign, Languages, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';

interface CountryInfoWidgetProps {
  className?: string;
  compact?: boolean;
}

export const CountryInfoWidget: React.FC<CountryInfoWidgetProps> = ({
  className = "",
  compact = false
}) => {
  const { country, language, formatCurrency } = useCountry();

  const getPriceZone = (countryCode: string) => {
    const premiumZones = ['ZA', 'NG', 'KE', 'EG'];
    const emergingZones = ['ET', 'TZ', 'SN'];
    
    if (premiumZones.includes(countryCode)) return 'Premium';
    if (emergingZones.includes(countryCode)) return 'Emerging';
    return 'Standard';
  };

  const getTimezone = (countryCode: string) => {
    const timezones: Record<string, string> = {
      'NG': 'WAT (UTC+1)',
      'EG': 'EET (UTC+2)',
      'ZA': 'SAST (UTC+2)',
      'KE': 'EAT (UTC+3)',
      'GH': 'GMT (UTC+0)',
      'ET': 'EAT (UTC+3)',
      'DZ': 'CET (UTC+1)',
      'MA': 'WET (UTC+0)',
      'CM': 'WAT (UTC+1)',
      'CI': 'GMT (UTC+0)',
      'TZ': 'EAT (UTC+3)',
      'SN': 'GMT (UTC+0)'
    };
    return timezones[countryCode] || 'UTC+0';
  };

  const priceZone = getPriceZone(country.code);
  const timezone = getTimezone(country.code);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white/90 backdrop-blur-sm border rounded-lg p-3 shadow-sm ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{country.flag}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{country.name}</h4>
            <p className="text-xs text-gray-500">{country.region}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {country.currency}
          </Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3">
            <div className="text-3xl">{country.flag}</div>
            <div>
              <h3 className="text-lg font-bold">{country.name}</h3>
              <p className="text-sm text-gray-600">{country.region}</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Devise et zone de prix */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-afroGold" />
              <div>
                <p className="text-sm font-medium">{country.currency}</p>
                <p className="text-xs text-gray-500">Devise locale</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-afroGreen" />
              <div>
                <Badge 
                  variant={priceZone === 'Premium' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {priceZone}
                </Badge>
                <p className="text-xs text-gray-500">Zone tarifaire</p>
              </div>
            </div>
          </div>

          {/* Langues */}
          <div className="flex items-start space-x-2">
            <Languages className="w-4 h-4 text-afroRed mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Langues</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {country.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Timezone */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-sm font-medium">{timezone}</p>
              <p className="text-xs text-gray-500">Fuseau horaire</p>
            </div>
          </div>

          {/* Format monétaire exemple */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Exemple de prix</p>
            <p className="font-medium text-afroGreen">
              {formatCurrency(50000)} / mois
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
