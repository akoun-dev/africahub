
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionBackground } from '@/components/ui/section-background';
import { useCountry } from '@/contexts/CountryContext';
import { Search, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { country } = useCountry();

  return (
    <SectionBackground variant="blue" withDecorations className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge className="bg-brandBlue text-white px-4 py-2">
              🌍 Disponible dans {country?.name} {country?.flag}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Comparez les <span className="text-brandBlue">meilleurs services</span> d'Afrique
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Assurance, banque, télécoms, énergie, immobilier et transport - trouvez les offres les plus adaptées à vos besoins en {country?.name}.
            </p>
          </div>

          <div className="pt-4">
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-8 text-lg bg-brandBlue hover:bg-brandBlue-dark text-white shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link to="/search">
                <Search className="mr-3 h-6 w-6" />
                Explorer les secteurs
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-brandBlue">6</div>
              <div className="text-sm text-gray-600">Secteurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brandBlue">200+</div>
              <div className="text-sm text-gray-600">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brandBlue">50K+</div>
              <div className="text-sm text-gray-600">Comparaisons</div>
            </div>
          </div>
        </div>
      </div>
    </SectionBackground>
  );
};
