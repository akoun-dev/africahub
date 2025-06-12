
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    year: '2022',
    title: 'L\'Idée Naît',
    description: 'Après avoir vécu la frustration de ne pas pouvoir comparer efficacement les prix entre différents pays africains, notre équipe décide de créer la solution manquante.'
  },
  {
    year: '2023',
    title: 'Premiers Partenariats',
    description: 'Signature des premiers accords avec des marchands en Afrique de l\'Ouest et de l\'Est. Développement de la technologie de comparaison multi-devises.'
  },
  {
    year: '2024',
    title: 'Expansion Continentale',
    description: 'Lancement dans 20 pays africains. Plus de 5000 marchands partenaires. Première application mobile lancée avec succès.'
  },
  {
    year: '2025',
    title: 'Leadership Africain',
    description: 'Couverture de tous les 54 pays africains. Plus de 15 000 marchands partenaires. 2 millions d\'utilisateurs actifs. Reconnaissance comme leader du e-commerce africain.'
  }
];

export const AboutTimeline = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-brandBlue mb-12 relative">
          Notre Histoire
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-brandBlue rounded-full mt-4" />
        </h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brandBlue to-blue-600 rounded-full" />
          
          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content */}
                <div className="flex-1 px-8">
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-brandBlue mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Year Circle */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-brandBlue to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {item.year}
                  </div>
                </div>
                
                {/* Spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
