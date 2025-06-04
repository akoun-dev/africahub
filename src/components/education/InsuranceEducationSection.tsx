
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Award, Shield } from 'lucide-react';
import { InsuranceGuide } from '@/components/guides/InsuranceGuide';
import { useLocalizedContent } from '@/hooks/useLocalizedContent';
import { useCountry } from '@/contexts/CountryContext';

export const InsuranceEducationSection: React.FC = () => {
  const { data: guides } = useLocalizedContent(undefined, 'guide');
  const { country } = useCountry();

  const educationCards = [
    {
      icon: Shield,
      title: 'Protection essentielle',
      description: 'Comprendre vos besoins de base en assurance',
      color: 'text-blue-600'
    },
    {
      icon: Award,
      title: 'Choisir la bonne couverture',
      description: 'Comparez les options adaptées à votre situation',
      color: 'text-green-600'
    },
    {
      icon: BookOpen,
      title: 'Guides par pays',
      description: 'Réglementations et spécificités locales',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900 mb-4">
            Éducation assurance en Afrique
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprenez les assurances adaptées à votre pays et à vos besoins spécifiques
          </p>
        </div>

        {/* Cards éducatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {educationCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    En savoir plus
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guides spécifiques */}
        {guides && guides.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">
              Guides pour {country?.name || 'votre région'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.slice(0, 4).map((guide) => (
                <InsuranceGuide 
                  key={guide.id} 
                  sector={guide.metadata?.sector || 'general'} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
