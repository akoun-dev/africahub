
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Globe, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { InteractiveAfricaMap } from './Map/InteractiveAfricaMap';
import { AFRICA_COUNTRIES } from '@/hooks/geolocation/countryData';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  languages: string[];
  region: string;
}

// Convert AFRICA_COUNTRIES to the Country interface format
const africanCountries: Country[] = Object.values(AFRICA_COUNTRIES).map(country => ({
  code: country.country_code,
  name: country.country,
  flag: getFlagEmoji(country.country_code),
  currency: country.currency,
  languages: [country.primary_language, ...country.local_languages],
  region: country.region
}));

function getFlagEmoji(countryCode: string): string {
  const flagMap: Record<string, string> = {
    'NG': '🇳🇬', 'EG': '🇪🇬', 'ZA': '🇿🇦', 'KE': '🇰🇪', 'GH': '🇬🇭', 'ET': '🇪🇹',
    'DZ': '🇩🇿', 'MA': '🇲🇦', 'CM': '🇨🇲', 'CI': '🇨🇮', 'TZ': '🇹🇿', 'SN': '🇸🇳',
    'TN': '🇹🇳', 'GA': '🇬🇦'
  };
  return flagMap[countryCode] || '🌍';
}

interface CountrySelectorProps {
  onSelect: (country: Country) => void;
  interactive?: boolean;
  selectedCountry?: Country;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  onSelect, 
  interactive = true, 
  selectedCountry 
}) => {
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<Country>(
    selectedCountry || africanCountries[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [useMap, setUseMap] = useState(false);

  useEffect(() => {
    if (selectedCountry) {
      setInternalSelectedCountry(selectedCountry);
    }
  }, [selectedCountry]);

  const handleCountryChange = (country: Country) => {
    console.log('Country selected:', country);
    setInternalSelectedCountry(country);
    onSelect(country);
    setIsOpen(false);
  };

  const handleCountryCodeSelect = (countryCode: string) => {
    const country = africanCountries.find(c => c.code === countryCode);
    if (country) {
      handleCountryChange(country);
    }
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <span className="text-lg">{internalSelectedCountry.flag}</span>
            <span className="hidden md:inline">{internalSelectedCountry.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[480px] z-[60] bg-white border shadow-xl" align="end">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm">Sélectionner un pays africain</h3>
              {interactive && (
                <div className="flex gap-1">
                  <Button
                    variant={!useMap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseMap(false)}
                    className="text-xs px-2 py-1"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Liste
                  </Button>
                  <Button
                    variant={useMap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseMap(true)}
                    className="text-xs px-2 py-1"
                  >
                    <Map className="h-3 w-3 mr-1" />
                    Carte
                  </Button>
                </div>
              )}
            </div>
            
            {useMap && interactive ? (
              <div className="space-y-3">
                <InteractiveAfricaMap
                  height="300px"
                  onCountryClick={handleCountryCodeSelect}
                  selectedCountry={internalSelectedCountry.code}
                  showControls={false}
                  showStats={false}
                  className="border rounded-md"
                />
                <p className="text-xs text-gray-500 text-center">
                  Cliquez sur un pays sur la carte ci-dessus
                </p>
              </div>
            ) : (
              <div className="max-h-72 overflow-auto">
                {africanCountries.map((country) => (
                  <Button
                    key={country.code}
                    variant="ghost"
                    className="w-full justify-start text-left font-normal hover:bg-gray-100"
                    onClick={() => handleCountryChange(country)}
                  >
                    <span className="mr-2 text-lg">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    {country.code === internalSelectedCountry.code && (
                      <Check className="ml-auto h-4 w-4 text-green-600" />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const getAfricanCountryByCode = (code: string): Country => {
  return africanCountries.find(c => c.code === code) || africanCountries[0];
};

export const getAllAfricanCountries = (): Country[] => {
  return africanCountries;
};
