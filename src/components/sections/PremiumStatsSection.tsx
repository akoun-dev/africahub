
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Shield, Award, Zap } from 'lucide-react';

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  description: string;
  color: string;
}

interface PremiumStatsSectionProps {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  sectorColor?: string;
}

export const PremiumStatsSection: React.FC<PremiumStatsSectionProps> = ({
  title = "Nos Performances",
  subtitle = "Des chiffres qui témoignent de notre excellence sur le continent africain",
  stats,
  sectorColor = "#009639"
}) => {
  const defaultStats: StatItem[] = [
    {
      icon: Globe,
      value: "54",
      label: "Pays Africains",
      description: "Couverture complète du continent",
      color: "#CE1126"
    },
    {
      icon: Users,
      value: "500K+",
      label: "Utilisateurs Actifs",
      description: "Communauté grandissante",
      color: "#FCD116"
    },
    {
      icon: TrendingUp,
      value: "1000+",
      label: "Produits Comparés",
      description: "Large sélection d'offres",
      color: "#009639"
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Sécurité Garantie",
      description: "Protection des données",
      color: "#33C3F0"
    },
    {
      icon: Award,
      value: "50+",
      label: "Partenaires Certifiés",
      description: "Assureurs de confiance",
      color: "#9b87f5"
    },
    {
      icon: Zap,
      value: "2min",
      label: "Temps Moyen",
      description: "Comparaison ultra-rapide",
      color: "#E07A5F"
    }
  ];

  const displayStats = stats || defaultStats;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-afroGold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-afroGreen/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[url('/patterns/adinkra-pattern.svg')] opacity-5"></div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div 
              className="w-16 h-1 rounded-full"
              style={{ backgroundColor: sectorColor }}
            ></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden h-full">
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)` }}
                ></div>

                {/* Content */}
                <div className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="h-8 w-8" />
                  </div>

                  {/* Value */}
                  <div className="space-y-2">
                    <div 
                      className="text-4xl md:text-5xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {stat.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Decorative elements */}
                  <div className="flex justify-center space-x-2 pt-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    ></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                  style={{ backgroundColor: stat.color }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Rejoignez des milliers d'Africains qui nous font confiance
          </p>
          <button 
            className="bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Commencer maintenant
          </button>
        </motion.div>
      </div>
    </section>
  );
};
