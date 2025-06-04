
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SectionBackground } from '@/components/ui/section-background';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <SectionBackground variant="blue-warm" withDecorations className="py-16 bg-brandBlue">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6 text-white">
          <Sparkles className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold">
            Prêt à découvrir les meilleurs services ?
          </h2>
          <p className="text-xl opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont déjà trouvé les services parfaits pour leurs besoins
          </p>
          <Button 
            asChild 
            size="lg" 
            className="h-14 px-8 text-lg bg-white text-brandBlue hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Link to="/search">
              Commencer maintenant - C'est gratuit
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </SectionBackground>
  );
};
