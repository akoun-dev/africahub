
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserCircle, 
  GraduationCap, 
  TrendingUp, 
  Palette 
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  icon: React.ComponentType<any>;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Amadou Diallo',
    role: 'Fondateur & CEO',
    bio: 'Entrepreneur passionné par la tech africaine. 15 ans d\'expérience dans le e-commerce international. Diplômé de l\'École Polytechnique de Thiès.',
    icon: UserCircle
  },
  {
    name: 'Fatima El Mansouri',
    role: 'CTO',
    bio: 'Experte en intelligence artificielle et big data. Ancienne de Google. Spécialisée dans les algorithmes de comparaison et de recommandation.',
    icon: GraduationCap
  },
  {
    name: 'Kwame Asante',
    role: 'Directeur Commercial',
    bio: 'Expert du marché africain avec un réseau étendu de partenaires. 12 ans d\'expérience dans le développement commercial pan-africain.',
    icon: TrendingUp
  },
  {
    name: 'Aisha Mwangi',
    role: 'Directrice UX/UI',
    bio: 'Designer primée, spécialisée dans l\'expérience utilisateur pour les marchés émergents. Passionnée par l\'accessibilité numérique.',
    icon: Palette
  }
];

export const AboutTeam = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-brandBlue mb-12 relative">
          Notre Équipe
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-brandBlue rounded-full mt-4" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card 
                key={index} 
                className="group hover:scale-105 transition-all duration-300 bg-white shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-brandBlue to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-brandBlue font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
