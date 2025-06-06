import React from 'react';
import { motion } from 'framer-motion';
import { PremiumCard, PremiumCardContent } from '@/components/ui/premium-card';
import { SectionBackground } from '@/components/ui/section-background';
import { Users, Building, Percent, TrendingUp } from 'lucide-react';
import { useSectorCMSContent } from '@/hooks/useSectorCMSContent';

interface CMSSectorStatsProps {
  sectorSlug: string;
  sectorColor: string;
}

export const CMSSectorStats: React.FC<CMSSectorStatsProps> = ({
  sectorSlug,
  sectorColor
}) => {
  const { content, isLoading } = useSectorCMSContent(sectorSlug);

  if (isLoading || !content?.stats) {
    return null;
  }

  const stats = [
    {
      icon: Building,
      label: 'Prestataires',
      value: content.stats.providers.toLocaleString(),
      description: 'Partenaires de confiance'
    },
    {
      icon: TrendingUp,
      label: 'Produits',
      value: content.stats.products.toLocaleString(),
      description: 'Solutions disponibles'
    },
    {
      icon: Percent,
      label: 'Économies',
      value: content.stats.savings,
      description: 'Économies moyennes'
    },
    {
      icon: Users,
      label: 'Utilisateurs',
      value: content.stats.users.toLocaleString(),
      description: 'Clients satisfaits'
    }
  ];

  return (
    <SectionBackground variant="muted" withPattern>
      <div className="container px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
              Nos Chiffres Clés
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Des résultats qui parlent d'eux-mêmes
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PremiumCard className="text-center h-full hover:shadow-xl transition-all duration-300 group">
                  <PremiumCardContent className="p-8">
                    <div className="space-y-4">
                      {/* Icône */}
                      <div 
                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${sectorColor}20` }}
                      >
                        <Icon 
                          className="w-8 h-8" 
                          style={{ color: sectorColor }}
                        />
                      </div>

                      {/* Valeur */}
                      <div className="space-y-2">
                        <div 
                          className="text-4xl font-bold tracking-tight"
                          style={{ color: sectorColor }}
                        >
                          {stat.value}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {stat.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.description}
                        </div>
                      </div>
                    </div>
                  </PremiumCardContent>
                </PremiumCard>
              </motion.div>
            );
          })}
        </div>

        {/* Section supplémentaire avec progression */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <PremiumCard className="max-w-4xl mx-auto">
            <PremiumCardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Taux de satisfaction</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Support disponible</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">15 pays</div>
                  <div className="text-sm text-gray-600">Couverture Afrique</div>
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        </motion.div>
      </div>
    </SectionBackground>
  );
};
