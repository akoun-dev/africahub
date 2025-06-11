
import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-afroGold/20 p-4 max-w-xs">
        <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-afroGreen to-afroGold"></div>
          Légende de la carte
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-afroGreen rounded border"></div>
            <span className="text-gray-700">Pays sélectionné</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-afroGold rounded border"></div>
            <span className="text-gray-700">Survol de souris</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded border"></div>
            <span className="text-gray-700">Pays disponible</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-afroGold/10">
          <p className="text-xs text-gray-500 leading-relaxed">
            🌍 Découvrez les services disponibles dans chaque pays africain
          </p>
        </div>
      </div>
    </div>
  );
};
