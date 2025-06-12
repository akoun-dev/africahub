
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { MapboxStatusIndicator } from '@/components/Map/MapboxStatusIndicator';
import { InteractiveAfricaMap } from '@/components/Map/InteractiveAfricaMap';
import { useCountry } from '@/contexts/CountryContext';
import { getAfricanCountryByCode } from '@/components/CountrySelector';

interface MapCardProps {
  onCountryClick: (countryCode: string) => void;
}

export const MapCard: React.FC<MapCardProps> = ({ onCountryClick }) => {
  const { country } = useCountry();

  const handleCountryClick = (countryCode: string) => {
    const selectedCountry = getAfricanCountryByCode(countryCode);
    if (selectedCountry) {
      onCountryClick(countryCode);
    }
  };

  return (
    <CardContent className="pt-0 animate-fade-in">
      <div className="border-t border-afroGold/15 pt-4 bg-gradient-to-br from-white/60 to-amber-50/20 rounded-lg p-4 -mx-2">
        <div className="space-y-4">
          <MapboxStatusIndicator variant="minimal" />
          <InteractiveAfricaMap
            height="350px"
            onCountryClick={handleCountryClick}
            selectedCountry={country.code}
            showControls={true}
            showStats={false}
            className="shadow-lg rounded-lg"
          />
        </div>
      </div>
    </CardContent>
  );
};
