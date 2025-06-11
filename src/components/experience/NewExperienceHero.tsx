
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCountry } from '@/contexts/CountryContext';
import { 
  Search, 
  Smartphone, 
  Home, 
  Car, 
  Plane, 
  Building, 
  DollarSign 
} from 'lucide-react';

export const NewExperienceHero = () => {
  const { country } = useCountry();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulation de recherche
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSearching(false);
    alert('Fonctionnalité de recherche en cours de développement !');
  };

  const quickCategories = [
    { icon: Smartphone, label: '📱 Téléphones', category: 'telephones' },
    { icon: Home, label: '🏠 Assurance Habitation', category: 'assurance' },
    { icon: Car, label: '🚗 Voitures', category: 'automobile' },
    { icon: Plane, label: '✈️ Vols', category: 'voyages' },
    { icon: Building, label: '🏨 Hôtels', category: 'voyages' },
    { icon: DollarSign, label: '💰 Prêts', category: 'banque' }
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1 animate-pulse" />
      </div>

      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title Section */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Le Premier Comparateur Universel d'Afrique
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Comparez les prix, services et offres dans tous les pays africains. 
              Économisez du temps et de l'argent avec AfricaCompare.
            </p>
          </div>

          {/* Search Section */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Main Search Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Que recherchez-vous ? (produits, services, assurances...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-14 text-lg bg-white/90 border-0 focus:ring-2 focus:ring-white/30"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    size="lg"
                    className="h-14 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg text-lg font-semibold"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Recherche...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Comparer
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Categories */}
                <div className="flex flex-wrap justify-center gap-3">
                  {quickCategories.map((cat, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 border-white/30 text-white text-sm py-2 px-4 cursor-pointer transition-all duration-200 hover:scale-105"
                      onClick={() => setSearchQuery(cat.label.split(' ').slice(1).join(' '))}
                    >
                      {cat.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Country Badge */}
          <Badge className="bg-white/20 text-white border-white/30 text-base py-2 px-6">
            🌍 Disponible en {country?.name} {country?.flag}
          </Badge>
        </div>
      </div>
    </section>
  );
};
