
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Scale, 
  Users, 
  Shield, 
  Rocket, 
  Handshake 
} from 'lucide-react';

interface Value {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: Heart,
    title: 'Passion Africaine',
    description: 'Nous sommes fiers de notre continent et travaillons chaque jour pour améliorer l\'expérience d\'achat de nos concitoyens africains.'
  },
  {
    icon: Scale,
    title: 'Transparence Totale',
    description: 'Nos comparaisons sont impartiales et basées sur des données réelles. Nous ne favorisons aucun marchand et publions les prix authentiques.'
  },
  {
    icon: Users,
    title: 'Inclusivité',
    description: 'Notre plateforme est conçue pour tous : des zones urbaines aux régions rurales, nous adaptons notre service à tous les niveaux technologiques.'
  },
  {
    icon: Shield,
    title: 'Sécurité',
    description: 'Vos données sont protégées selon les standards internationaux. Nous respectons scrupuleusement votre vie privée.'
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'Nous développons constamment de nouvelles fonctionnalités adaptées aux spécificités du marché africain.'
  },
  {
    icon: Handshake,
    title: 'Partenariats Locaux',
    description: 'Nous collaborons avec des entreprises africaines pour soutenir l\'économie locale et créer des emplois sur le continent.'
  }
];

export const AboutValues = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-brandBlue mb-12 relative">
          Nos Valeurs
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-brandBlue rounded-full mt-4" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card 
                key={index} 
                className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-brandBlue to-blue-600 text-white border-0 shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold">
                    {value.title}
                  </h3>
                  
                  <p className="text-white/90 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
