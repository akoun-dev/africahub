
import React from 'react';
import { SectionBackground } from '@/components/ui/section-background';
import { SectorSelector } from '@/components/SectorSelector';

export const SectorsSection = () => {
  return (
    <SectionBackground variant="blue-warm" withPattern className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explorez nos secteurs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs services dans chaque secteur d'activité
          </p>
        </div>

        <SectorSelector />
      </div>
    </SectionBackground>
  );
};
