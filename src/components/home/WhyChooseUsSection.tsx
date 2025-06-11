
import React from 'react';
import { SectionBackground } from '@/components/ui/section-background';
import { Globe, Clock, TrendingUp } from 'lucide-react';

export const WhyChooseUsSection = () => {
  return (
    <SectionBackground variant="blue-warm" withPattern className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi AfricaCompare ?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Globe className="h-12 w-12 text-brandBlue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-sectoriel</h3>
            <p className="text-gray-600">
              6 secteurs couverts avec des centaines d'entreprises partenaires
            </p>
          </div>

          <div className="text-center">
            <Clock className="h-12 w-12 text-brandBlue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rapide et gratuit</h3>
            <p className="text-gray-600">
              Comparaisons instantanées et service entièrement gratuit
            </p>
          </div>

          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-brandBlue mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Optimisé pour l'Afrique</h3>
            <p className="text-gray-600">
              Conçu spécifiquement pour les besoins du marché africain
            </p>
          </div>
        </div>
      </div>
    </SectionBackground>
  );
};
