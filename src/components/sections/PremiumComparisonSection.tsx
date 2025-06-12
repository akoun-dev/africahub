
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ComparisonItem {
  name: string;
  basic: boolean | string;
  premium: boolean | string;
  enterprise: boolean | string;
}

interface PremiumComparisonSectionProps {
  title?: string;
  subtitle?: string;
  plans?: Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    popular?: boolean;
    recommended?: boolean;
    features: string[];
    cta: string;
  }>;
  comparison?: ComparisonItem[];
  sectorColor?: string;
}

export const PremiumComparisonSection: React.FC<PremiumComparisonSectionProps> = ({
  title = "Choisissez Votre Formule",
  subtitle = "Des solutions adaptées à tous vos besoins d'assurance",
  plans,
  comparison,
  sectorColor = "#009639"
}) => {
  const defaultPlans = [
    {
      name: "Essentiel",
      price: "Gratuit",
      period: "",
      description: "Parfait pour découvrir nos services",
      popular: false,
      recommended: false,
      features: [
        "Comparaison de base",
        "3 devis par mois",
        "Support par email",
        "Accès mobile"
      ],
      cta: "Commencer gratuitement"
    },
    {
      name: "Premium",
      price: "2,500",
      period: "CFA/mois",
      description: "Pour les utilisateurs réguliers",
      popular: true,
      recommended: true,
      features: [
        "Comparaison avancée",
        "Devis illimités",
        "Support prioritaire 24/7",
        "Analyses personnalisées",
        "Recommandations IA",
        "Suivi des contrats"
      ],
      cta: "Choisir Premium"
    },
    {
      name: "Entreprise",
      price: "Sur demande",
      period: "",
      description: "Solution complète pour entreprises",
      popular: false,
      recommended: false,
      features: [
        "Toutes les fonctionnalités Premium",
        "Gestion multi-utilisateurs",
        "Intégration API",
        "Rapports personnalisés",
        "Gestionnaire dédié",
        "Formation incluse"
      ],
      cta: "Nous contacter"
    }
  ];

  const displayPlans = plans || defaultPlans;

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-afroRed/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-afroGold/10 rounded-full blur-2xl"></div>
      <div className="absolute inset-0 bg-[url('/patterns/kente-pattern.svg')] opacity-3"></div>

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

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {displayPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative ${plan.recommended ? 'md:scale-105' : ''}`}
            >
              <Card className={`h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white relative ${
                plan.recommended ? 'ring-2 ring-afroGold ring-opacity-50' : ''
              }`}>
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[url('/patterns/adinkra-pattern.svg')] opacity-5 hover:opacity-10 transition-opacity"></div>
                
                {/* Badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  {plan.popular && (
                    <Badge className="bg-afroRed text-white px-3 py-1">
                      <Trophy className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                  {plan.recommended && (
                    <Badge className="bg-afroGold text-afroBlack px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Recommandé
                    </Badge>
                  )}
                </div>

                <CardHeader className="relative z-10 text-center pb-4">
                  {/* Plan icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: sectorColor }}
                  >
                    <Zap className="h-8 w-8" />
                  </div>

                  {/* Plan details */}
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold" style={{ color: sectorColor }}>
                      {plan.price}
                    </div>
                    {plan.period && (
                      <div className="text-gray-500 text-sm mt-1">
                        {plan.period}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  {/* Features list */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-3 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Button
                      className={`w-full py-3 text-white hover:brightness-110 transition-all ${
                        plan.recommended ? 'shadow-xl hover:shadow-2xl' : 'shadow-lg hover:shadow-xl'
                      }`}
                      style={{ backgroundColor: sectorColor }}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </CardContent>

                {/* Bottom accent */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-2"
                  style={{ backgroundColor: sectorColor }}
                ></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Garantie satisfait ou remboursé 30 jours • Annulation à tout moment
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-emerald-600" />
              Sécurisé SSL
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-emerald-600" />
              Support 24/7
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2 text-emerald-600" />
              Sans engagement
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
