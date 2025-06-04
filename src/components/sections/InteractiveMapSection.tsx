
import React, { useState } from 'react';
import { InteractiveAfricaMap } from '@/components/Map/InteractiveAfricaMap';
import { MapboxStatusIndicator } from '@/components/Map/MapboxStatusIndicator';
import { useCountry } from '@/contexts/CountryContext';
import { getAfricanCountryByCode } from '@/components/CountrySelector';
import { SectionBackground } from '@/components/ui/section-background';
import { MapHeader } from './map/MapHeader';
import { MapViewToggle } from './map/MapViewToggle';
import { MapStatsView } from './map/MapStatsView';
import { MapInfoPanels } from './map/MapInfoPanels';

export const InteractiveMapSection: React.FC = () => {
  const { setCountry, country } = useCountry();
  const [selectedView, setSelectedView] = useState<'map' | 'stats'>('map');

  const handleCountryClick = (countryCode: string) => {
    console.log('Country clicked:', countryCode);
    const selectedCountry = getAfricanCountryByCode(countryCode);
    console.log('Selected country:', selectedCountry);
    if (selectedCountry) {
      setCountry(selectedCountry);
    }
  };

  return (
    <SectionBackground variant="blue" withDecorations>
      <div className="container mx-auto px-4 py-12">
        {/* Section Header optimisé */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brandNavy via-brandBlue to-brandSky bg-clip-text text-transparent tracking-tight">
            Sélectionnez votre pays
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Cliquez sur votre pays pour découvrir les services disponibles dans votre région
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          {/* Main Map Section */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* Simple status indicator for users */}
              <MapboxStatusIndicator variant="minimal" />
              
              {/* View Toggle */}
              <MapViewToggle 
                selectedView={selectedView}
                onViewChange={setSelectedView}
              />

              {/* Map or Stats View - hauteur optimisée pour mobile */}
              {selectedView === 'map' ? (
                <InteractiveAfricaMap
                  height="400px"
                  onCountryClick={handleCountryClick}
                  selectedCountry={country.code}
                  showControls={true}
                  showStats={true}
                  className="shadow-xl rounded-lg"
                />
              ) : (
                <MapStatsView />
              )}
            </div>
          </div>

          {/* Info Panels */}
          <div className="lg:col-span-1">
            <MapInfoPanels />
          </div>
        </div>

        {/* Transition vers la section suivante */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Pays sélectionné : <span className="font-medium text-brandBlue">{country.flag} {country.name}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Explorez maintenant les secteurs disponibles ci-dessous
          </p>
        </div>
      </div>
    </SectionBackground>
  );
};
