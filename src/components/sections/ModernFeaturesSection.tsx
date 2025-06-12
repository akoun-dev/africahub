
import React from 'react';
import { PremiumFeatureCard } from '@/components/cards/PremiumFeatureCard';
import { Shield, Zap, Globe, Users, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ModernFeaturesSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Comparaison Intelligente",
      description: "Comparez automatiquement les meilleures offres d'assurance adaptées à votre profil et vos besoins spécifiques.",
      icon: Zap,
      color: "#009639",
      badge: "IA Avancée",
      onClick: () => navigate('/compare')
    },
    {
      title: "Couverture Africaine",
      description: "Accédez aux offres d'assurance dans 54 pays africains avec des partenaires locaux vérifiés.",
      icon: Globe,
      color: "#FCD116", 
      badge: "54 Pays",
      onClick: () => navigate('/about')
    },
    {
      title: "Sécurité Garantie",
      description: "Vos données personnelles sont protégées avec les plus hauts standards de sécurité internationaux.",
      icon: Shield,
      color: "#CE1126",
      badge: "Certifié",
      onClick: () => navigate('/about')
    },
    {
      title: "Support Expert",
      description: "Bénéficiez de l'accompagnement de nos experts en assurance disponibles 24h/7j.",
      icon: Users,
      color: "#33C3F0",
      badge: "24h/7j",
      onClick: () => navigate('/contact')
    },
    {
      title: "Économies Maximales",
      description: "Économisez jusqu'à 40% sur vos primes d'assurance grâce à notre technologie de comparaison.",
      icon: TrendingUp,
      color: "#9b87f5",
      badge: "Jusqu'à 40%",
      onClick: () => navigate('/compare')
    },
    {
      title: "Partenaires Premium",
      description: "Travaillons avec les meilleures compagnies d'assurance africaines pour vous offrir le meilleur.",
      icon: Award,
      color: "#E07A5F",
      badge: "Premium",
      onClick: () => navigate('/about')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-afroGold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-afroGreen/5 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-afroRed via-afroGold to-afroGreen rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi Choisir 
            <span className="bg-gradient-to-r from-afroGreen to-afroGold bg-clip-text text-transparent"> Policy Hunter</span> ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les avantages qui font de nous la plateforme de référence 
            pour la comparaison d'assurances en Afrique.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <PremiumFeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              badge={feature.badge}
              onClick={feature.onClick}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Prêt à découvrir les meilleures offres d'assurance ?
          </p>
          <button 
            onClick={() => navigate('/compare')}
            className="bg-gradient-to-r from-afroGreen to-afroGold hover:from-afroGreen-dark hover:to-afroGold-dark text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Commencer maintenant
          </button>
        </motion.div>
      </div>
    </section>
  );
};
