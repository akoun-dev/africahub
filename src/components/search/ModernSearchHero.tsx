
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCountry } from '@/contexts/CountryContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Search, 
  Sparkles,
  TrendingUp,
  Filter
} from 'lucide-react';

interface ModernSearchHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategorySelect: (category: string) => void;
  popularSearches?: string[];
}

export const ModernSearchHero: React.FC<ModernSearchHeroProps> = ({
  searchQuery,
  onSearchChange,
  onCategorySelect,
  popularSearches = ['iPhone 14', 'Assurance Auto', 'Orange Fiber', 'Samsung Galaxy']
}) => {
  const { country } = useCountry();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[400px] bg-gradient-to-br from-brandBlue/5 via-brandBlue/10 to-brandBlue/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgba(30,111,187,0.1)_1px,_transparent_0)] bg-[length:40px_40px]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brandBlue/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-brandBlue/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-brandBlue animate-pulse" />
              <Badge className="bg-brandBlue text-white border-0">
                IA Powered
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-brandBlue leading-tight">
              {t('search.advanced.title', 'Recherche Avancée')}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('search.advanced.subtitle', 'Trouvez exactement ce que vous cherchez avec notre moteur de recherche intelligent')}
            </p>
          </div>

          {/* Modern Search Bar */}
          <Card className="bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                
                <Input
                  placeholder={t('search.placeholder', 'Rechercher un produit, service ou catégorie...')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-16 pl-16 pr-6 text-lg border-0 bg-transparent focus:ring-2 focus:ring-brandBlue/20 placeholder:text-gray-400"
                />
                
                <Button 
                  size="lg"
                  className="absolute right-2 top-2 h-12 px-8 bg-brandBlue hover:bg-brandBlue-dark text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Searches */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              Recherches populaires
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              {popularSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSearchChange(search)}
                  className="bg-white/60 hover:bg-white/80 border-white/30 hover:border-brandBlue/30 transition-all duration-200 hover:scale-105"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-brandBlue">10K+</div>
              <div className="text-sm text-gray-600">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brandBlue">54</div>
              <div className="text-sm text-gray-600">Pays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brandBlue">500+</div>
              <div className="text-sm text-gray-600">Partenaires</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
