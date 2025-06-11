
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/glass-card';
import { SectionBackground } from '@/components/ui/section-background';
import { Car, Home, Shield, Smartphone, Zap, Sprout, Building, Plane } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const sectors = [
  { id: 'insurance', nameKey: 'sectors.insurance', icon: Shield, color: 'text-afroGreen' },
  { id: 'banking', nameKey: 'sectors.banking', icon: Sprout, color: 'text-afroGold' },
  { id: 'energy', nameKey: 'sectors.energy', icon: Zap, color: 'text-afroRed' },
  { id: 'telecom', nameKey: 'sectors.telecom', icon: Smartphone, color: 'text-afroGreen' },
  { id: 'real-estate', nameKey: 'sectors.real_estate', icon: Building, color: 'text-afroGold' },
  { id: 'transport', nameKey: 'sectors.transport', icon: Plane, color: 'text-afroRed' },
];

export const UnifiedTabbedContentSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('insurance');

  return (
    <SectionBackground variant="subtle" withDecorations>
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            {t('sectors.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            {t('sectors.subtitle')}
          </p>
        </div>

        <GlassCard variant="premium" size="xl" radius="xl" className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-50/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-2 mb-8">
              {sectors.map((sector) => {
                const IconComponent = sector.icon;
                return (
                  <TabsTrigger
                    key={sector.id}
                    value={sector.id}
                    className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all"
                  >
                    <IconComponent className={`h-5 w-5 ${sector.color}`} />
                    <span className="text-xs font-medium hidden sm:block">{t(sector.nameKey)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {sectors.map((sector) => (
              <TabsContent key={sector.id} value={sector.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((index) => (
                    <GlassCard 
                      key={index} 
                      variant="subtle" 
                      size="default" 
                      radius="lg"
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${sector.color.replace('text-', '')} to-${sector.color.replace('text-', '')}-light flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                          <sector.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                            {t('features.service')} {t(sector.nameKey)} #{index}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {t('features.description')}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-afroGreen">
                              {t('features.price_from')} {20 + index * 10}€{t('features.per_month')}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                              ⭐ 4.{5 + index}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </GlassCard>
      </div>
    </SectionBackground>
  );
};
