
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Bell, 
  TrendingUp, 
  Star, 
  Globe, 
  Smartphone 
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Search,
    title: 'Recherche Intelligente',
    description: 'Notre algorithme trouve automatiquement les meilleures offres dans tous les pays africains selon vos critères.'
  },
  {
    icon: Bell,
    title: 'Alertes Prix',
    description: 'Recevez des notifications quand les prix baissent sur vos produits favoris. Ne ratez plus aucune promotion.'
  },
  {
    icon: TrendingUp,
    title: 'Historique des Prix',
    description: 'Consultez l\'évolution des prix sur plusieurs mois pour acheter au meilleur moment.'
  },
  {
    icon: Star,
    title: 'Avis Vérifiés',
    description: 'Consultez des milliers d\'avis authentiques de consommateurs africains pour faire le bon choix.'
  },
  {
    icon: Globe,
    title: 'Couverture Continentale',
    description: 'Accédez aux meilleures offres dans les 54 pays africains depuis une seule plateforme.'
  },
  {
    icon: Smartphone,
    title: 'Application Mobile',
    description: 'Comparez et achetez depuis votre smartphone avec notre app mobile optimisée.'
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi Choisir AfricaCompare ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des fonctionnalités avancées pour une expérience de comparaison optimale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-brandBlue via-blue-600 to-blue-700 text-white border-0 shadow-lg hover:shadow-xl">
      <CardContent className="p-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">
            {feature.title}
          </h3>
        </div>
        
        <p className="text-white/90 leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};
