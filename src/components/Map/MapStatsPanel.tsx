
import React from 'react';

interface MapStatsPanelProps {
  countryData: any;
}

export const MapStatsPanel: React.FC<MapStatsPanelProps> = ({ countryData }) => {
  if (!countryData) return null;

  return (
    <div className="absolute top-4 right-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-afroGold/20 p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-afroGreen to-afroGold flex items-center justify-center">
            <span className="text-white text-sm font-bold">📊</span>
          </div>
          <h4 className="font-bold text-gray-900">Statistiques pays</h4>
        </div>
        
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-afroGreen/10 to-afroGreen/5 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Population</span>
              <span className="font-bold text-afroGreen">
                {(countryData.population / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-afroGold/10 to-afroGold/5 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Compagnies</span>
              <span className="font-bold text-afroGold">
                {countryData.insurance_companies}
              </span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-afroRed/10 to-afroRed/5 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Marché</span>
              <span className="font-bold text-afroRed text-xs">
                {countryData.market_size}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-afroGold/10">
          <p className="text-xs text-gray-500 text-center">
            📈 Données mises à jour en temps réel
          </p>
        </div>
      </div>
    </div>
  );
};
