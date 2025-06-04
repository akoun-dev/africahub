
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectorSelector } from '@/components/SectorSelector';
import { InteractiveMapSection } from '@/components/sections/InteractiveMapSection';
import { CountryWidgetsContainer } from '@/components/widgets/CountryWidgetsContainer';
import { ModernFeaturesSection } from '@/components/sections/ModernFeaturesSection';
import { useTranslation } from '@/hooks/useTranslation';
import { Building, Map, Globe, Zap } from 'lucide-react';

export const TabbedContentSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 bg-gradient-to-br from-white via-gray-50 to-afroGreen/5 relative overflow-hidden">
      {/* Background avec motifs africains subtils */}
      <div className="absolute inset-0 bg-[url('/patterns/kente-pattern.svg')] opacity-3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Tabs defaultValue="sectors" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-white/80 backdrop-blur-sm border border-afroGreen/20 shadow-lg p-1 rounded-xl">
              <TabsTrigger 
                value="sectors" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-afroGreen data-[state=active]:to-afroGold data-[state=active]:text-white rounded-lg transition-all"
              >
                <Building className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.sectors', 'Secteurs')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="map" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-afroGreen data-[state=active]:to-afroGold data-[state=active]:text-white rounded-lg transition-all"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.map', 'Carte')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="country" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-afroGreen data-[state=active]:to-afroGold data-[state=active]:text-white rounded-lg transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.country_info', 'Info Pays')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-afroGreen data-[state=active]:to-afroGold data-[state=active]:text-white rounded-lg transition-all"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.features', 'Fonctionnalités')}</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="sectors" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <SectorSelector />
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <InteractiveMapSection />
            </div>
          </TabsContent>
          
          <TabsContent value="country" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
                  {t('country.widgets.title', 'Informations Adaptées à Votre Pays')}
                </h2>
                <p className="text-gray-600">
                  {t('country.widgets.subtitle', 'Des détails personnalisés selon votre localisation en Afrique')}
                </p>
              </div>
              <CountryWidgetsContainer />
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <ModernFeaturesSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
