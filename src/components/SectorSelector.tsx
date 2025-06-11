
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSectors } from '@/hooks/useSectors';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Shield, 
  Banknote, 
  Smartphone, 
  Zap, 
  Car, 
  Home,
  ArrowRight,
  Sprout,
  BookOpen
} from 'lucide-react';

const iconMap = {
  Shield,
  Banknote,
  Smartphone,
  Zap,
  Car,
  Home,
  Sprout,
  BookOpen,
};

export const SectorSelector = () => {
  const { data: sectors, isLoading } = useSectors();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-afroGreen"></div>
      </div>
    );
  }

  const handleSectorClick = (slug: string) => {
    navigate(`/secteur/${slug}`);
  };

  return (
    <div id="sectors">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tighter md:text-3xl mb-3 bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
          {t('sectors.title', 'Explorez Nos Secteurs')}
        </h2>
        <p className="max-w-[600px] mx-auto text-gray-600 md:text-lg">
          {t('sectors.subtitle', 'Découvrez des services adaptés à vos besoins à travers différents secteurs en Afrique')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors?.map((sector) => {
          const IconComponent = iconMap[sector.icon as keyof typeof iconMap] || Shield;
          
          return (
            <Card 
              key={sector.id}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 group bg-white/80 backdrop-blur-sm border border-white/20 hover:scale-105 hover:bg-white/90"
              onClick={() => handleSectorClick(sector.slug)}
            >
              <CardHeader className="text-center pb-3">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${sector.color}, ${sector.color}dd)`,
                    boxShadow: `0 8px 25px ${sector.color}30`
                  }}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg group-hover:text-opacity-80 transition-colors font-bold">
                  {sector.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{sector.description}</p>
                <div 
                  className="flex items-center justify-center text-sm font-medium group-hover:translate-x-1 transition-transform px-4 py-2 rounded-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${sector.color}15, ${sector.color}05)`,
                    color: sector.color
                  }}
                >
                  {t('button.explore', 'Explorer')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!sectors || sectors.length === 0) && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('sectors.no_sectors_available', 'Aucun secteur disponible pour le moment.')}</p>
        </div>
      )}
    </div>
  );
};
