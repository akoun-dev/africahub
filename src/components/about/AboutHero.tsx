
import React from 'react';
import { Globe } from 'lucide-react';

export const AboutHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-brandBlue via-blue-600 to-blue-800 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1 animate-pulse" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Globe className="h-12 w-12 text-white animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Notre Mission : Démocratiser la Comparaison en Afrique
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Nous croyons que chaque consommateur africain mérite d'accéder aux meilleures offres, 
            peu importe son pays ou sa situation géographique.
          </p>
        </div>
      </div>
    </section>
  );
};
