
import React from 'react';

export const MapInstructions: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-afroGold/20 p-3 max-w-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="text-afroGreen">🖱️</span>
            <span>Survolez un pays pour voir les détails</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="text-afroGold">👆</span>
            <span>Cliquez pour sélectionner</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="text-afroRed">🔍</span>
            <span>Utilisez les contrôles pour naviguer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
