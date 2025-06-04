
import React from 'react';
import { Button } from '@/components/ui/button';

export const CTASection: React.FC = () => {
  return (
    <div className="text-center mt-10 p-8 bg-brandBlue rounded-2xl shadow-xl relative overflow-hidden">
      {/* Motifs décoratifs dans le CTA */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-8 h-8 border-2 border-white rounded-lg rotate-12"></div>
        <div className="absolute bottom-2 right-4 w-6 h-6 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-white rounded-full"></div>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-4 text-white relative z-10">
        <h3 className="text-2xl font-bold">
          Prêt à découvrir les meilleurs services ?
        </h3>
        <p className="text-lg opacity-90">
          Rejoignez des milliers d'utilisateurs qui ont déjà trouvé les services parfaits
        </p>
        <Button 
          size="lg" 
          className="h-12 px-8 text-lg bg-white text-brandBlue hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20 hover:border-white/40"
          onClick={() => window.location.href = '/search'}
        >
          Commencer maintenant - C'est gratuit
        </Button>
      </div>
    </div>
  );
};
