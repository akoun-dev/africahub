
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles,
  TrendingUp,
  ArrowRight,
  Globe
} from 'lucide-react';

export const UniversalHeroSection: React.FC = () => {
  const { country } = useCountry();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-brandBlue/5 via-brandBlue/10 to-brandBlue/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgba(30,111,187,0.1)_1px,_transparent_0)] bg-[length:40px_40px]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brandBlue/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-brandBlue/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Title Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-brandBlue animate-pulse" />
              <Badge className="bg-brandBlue text-white border-0 px-4 py-2">
                {country?.flag} {country?.name} • Plateforme Multi-Sectorielle
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold text-brandBlue leading-tight">
              Comparez les{' '}
              <span className="bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
                meilleurs services
              </span>{' '}
              d'Afrique
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Assurance, banque, télécoms, énergie, immobilier et transport - 
              trouvez les offres les plus adaptées à vos besoins dans {country?.name || 'votre pays'}.
            </p>
          </div>

          {/* Modern Search Bar */}
          <Card className="bg-white/90 backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                
                <Input
                  placeholder="Rechercher un service, produit ou secteur..."
                  className="h-16 pl-16 pr-6 text-lg border-0 bg-transparent focus:ring-2 focus:ring-brandBlue/20 placeholder:text-gray-400"
                />
                
                <Button 
                  size="lg"
                  onClick={() => navigate('/search')}
                  className="absolute right-2 top-2 h-12 px-8 bg-brandBlue hover:bg-brandBlue-dark text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sector Quick Access */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              Secteurs populaires
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'Assurance', icon: '🛡️', sector: 'assurance' },
                { name: 'Banque', icon: '🏦', sector: 'banque' },
                { name: 'Télécoms', icon: '📱', sector: 'telecoms' },
                { name: 'Énergie', icon: '⚡', sector: 'energie' },
                { name: 'Transport', icon: '🚗', sector: 'transport' },
                { name: 'Immobilier', icon: '🏠', sector: 'immobilier' }
              ].map((sector, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/secteur/${sector.sector}`)}
                  className="bg-white/80 hover:bg-white/90 border-white/30 hover:border-brandBlue/30 transition-all duration-200 hover:scale-105"
                >
                  <span className="mr-2">{sector.icon}</span>
                  {sector.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/secteurs')}
              className="h-14 px-8 text-lg bg-gradient-to-r from-afroGreen via-afroGold to-afroRed hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Explorer tous les secteurs
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-brandBlue">6+</div>
              <div className="text-sm text-gray-600">Secteurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brandBlue">54</div>
              <div className="text-sm text-gray-600">Pays</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brandBlue">500+</div>
              <div className="text-sm text-gray-600">Partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brandBlue">10K+</div>
              <div className="text-sm text-gray-600">Services</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
