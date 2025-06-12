
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

export const AboutMission = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-brandBlue mb-12 relative">
          Notre Mission
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-brandBlue rounded-full mt-4" />
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-700">
              <strong className="text-brandBlue">AfricaCompare</strong> est né d'une vision simple mais ambitieuse : 
              créer le premier comparateur universel dédié exclusivement au continent africain.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              Nous avons constaté que les consommateurs africains n'avaient pas accès aux mêmes outils de comparaison 
              que leurs homologues européens ou américains. Les sites existants se concentrent principalement sur les 
              marchés occidentaux, laissant un vide énorme sur notre continent.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              Notre plateforme connecte <strong className="text-brandBlue">54 pays africains</strong>, permettant aux 
              consommateurs de comparer les prix, services et offres dans leur langue, leur devise, et selon leurs 
              spécificités culturelles et réglementaires.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              Que vous soyez à Lagos, Casablanca, Nairobi, Johannesburg ou Abidjan, vous méritez d'avoir accès aux 
              meilleures opportunités du marché.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Card className="relative">
              <CardContent className="p-8">
                <div className="w-64 h-64 bg-gradient-to-br from-brandBlue to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden group">
                  <Globe className="h-24 w-24 text-white group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
