
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Info, ArrowRight, Star } from 'lucide-react';
import { Sector } from '@/hooks/useSectors';
import { useSectorCMSContent } from '@/hooks/useSectorCMSContent';
import { useCountry } from '@/contexts/CountryContext';
import { motion } from 'framer-motion';

interface PremiumSectorHeroProps {
  sector: Sector;
  themeColor: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

export const PremiumSectorHero: React.FC<PremiumSectorHeroProps> = ({ 
  sector, 
  themeColor, 
  IconComponent 
}) => {
  const navigate = useNavigate();
  const { country } = useCountry();
  const { content, isLoading } = useSectorCMSContent(sector.slug);

  const title = content.hero_title || sector.name;
  const description = content.hero_description || sector.description;
  const ctaText = content.cta_text || 'Comparer les offres';

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Dynamic background with sector color */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{ 
          background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 50%, ${themeColor}aa 100%)` 
        }}
      ></div>
      
      {/* African pattern overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/adinkra-pattern.svg')] opacity-20"></div>
      
      {/* Geometric decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 transform rotate-45"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-afroGold rounded-full animate-pulse"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Sector badge and icon */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <IconComponent className="h-8 w-8" />
              </div>
              <Badge 
                variant="outline" 
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2"
              >
                <Star className="w-4 h-4 mr-2" />
                Secteur Premium
              </Badge>
            </div>

            {/* Title and description */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {title}
              </h1>
              <p className="text-xl md:text-2xl opacity-95 max-w-3xl leading-relaxed">
                {description}
              </p>
            </div>

            {/* Country-specific information */}
            {country && content.regulatory_info && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-afroGold/80 flex items-center justify-center">
                    <Info className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-lg">Information pour {country.name}</span>
                </div>
                <p className="text-white/90 leading-relaxed">{content.regulatory_info}</p>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all group"
                onClick={() => navigate(`/secteur/${sector.slug}/comparer`)}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                {ctaText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg transition-all"
                onClick={() => navigate(`/secteur/${sector.slug}/devis`)}
              >
                <FileText className="h-5 w-5 mr-3" />
                Demander un devis
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-6 pt-6 text-sm opacity-90"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-afroGold rounded-full"></div>
                <span>Comparaison gratuite</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-afroGold rounded-full"></div>
                <span>Partenaires vérifiés</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-afroGold rounded-full"></div>
                <span>Support personnalisé</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
  );
};
