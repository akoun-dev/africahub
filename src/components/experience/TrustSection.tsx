
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Handshake, Users } from 'lucide-react';

interface TrustBadge {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  color: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: Shield,
    title: 'Données Sécurisées',
    subtitle: 'Certification SSL',
    color: 'text-green-600'
  },
  {
    icon: Award,
    title: 'Prix Actualisés',
    subtitle: 'Mise à jour en temps réel',
    color: 'text-blue-600'
  },
  {
    icon: Handshake,
    title: 'Marchands Vérifiés',
    subtitle: 'Partenaires de confiance',
    color: 'text-purple-600'
  },
  {
    icon: Users,
    title: 'Support 24/7',
    subtitle: 'Assistance multilingue',
    color: 'text-orange-600'
  }
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ils Nous Font Confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre engagement pour votre sécurité et satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge, index) => (
            <TrustCard key={index} badge={badge} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TrustCardProps {
  badge: TrustBadge;
}

const TrustCard: React.FC<TrustCardProps> = ({ badge }) => {
  const Icon = badge.icon;

  return (
    <Card className="group hover:scale-105 transition-all duration-300 bg-white border-0 shadow-lg hover:shadow-xl">
      <CardContent className="p-8 text-center space-y-4">
        <div className={`${badge.color} text-5xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="mx-auto h-12 w-12" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">
            {badge.title}
          </h3>
          <p className="text-sm text-gray-600">
            {badge.subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
