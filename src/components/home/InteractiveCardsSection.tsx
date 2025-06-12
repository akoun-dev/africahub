
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { SectionBackground } from '@/components/ui/section-background';
import { useCountry } from '@/contexts/CountryContext';
import { SectorSelector } from '@/components/SectorSelector';
import { getAfricanCountryByCode } from '@/components/CountrySelector';
import { 
  Globe, 
  Search, 
  BarChart3, 
  TrendingUp
} from 'lucide-react';

import { InteractiveCard, CardType } from './interactive-cards/InteractiveCard';
import { MapCard } from './interactive-cards/MapCard';
import { ProcessCard } from './interactive-cards/ProcessCard';
import { AdvantagesCard } from './interactive-cards/AdvantagesCard';
import { CTASection } from './interactive-cards/CTASection';

export const InteractiveCardsSection = () => {
  const { country, setCountry } = useCountry();
  const [expandedCard, setExpandedCard] = useState<CardType | null>('map');

  const handleCountryClick = (countryCode: string) => {
    const selectedCountry = getAfricanCountryByCode(countryCode);
    if (selectedCountry) {
      setCountry(selectedCountry);
      setTimeout(() => setExpandedCard('sectors'), 500);
    }
  };

  const toggleCard = (cardType: CardType) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  const cards = [
    {
      id: 'map' as CardType,
      title: 'Sélectionnez votre pays',
      subtitle: `Actuellement : ${country.flag} ${country.name}`,
      icon: Globe,
      color: 'brandBlue',
      description: 'Choisissez votre pays sur la carte interactive pour découvrir les services disponibles',
      content: <MapCard onCountryClick={handleCountryClick} />
    },
    {
      id: 'sectors' as CardType,
      title: 'Explorez les secteurs',
      subtitle: `6 secteurs disponibles en ${country.name}`,
      icon: Search,
      color: 'brandBlue',
      description: 'Découvrez les services dans chaque secteur d\'activité',
      content: (
        <CardContent className="pt-0 animate-fade-in">
          <div className="border-t border-brandBlue/15 pt-4 bg-gradient-to-br from-white/60 to-blue-50/20 rounded-lg p-4 -mx-2">
            <SectorSelector />
          </div>
        </CardContent>
      )
    },
    {
      id: 'process' as CardType,
      title: 'Comment ça marche',
      subtitle: 'En 3 étapes simples',
      icon: BarChart3,
      color: 'brandBlue',
      description: 'Notre processus de comparaison intelligent',
      content: <ProcessCard />
    },
    {
      id: 'advantages' as CardType,
      title: 'Pourquoi AfricaCompare ?',
      subtitle: 'Nos avantages uniques',
      icon: TrendingUp,
      color: 'brandBlue',
      description: 'Les raisons de nous faire confiance',
      content: <AdvantagesCard />
    }
  ];

  return (
    <SectionBackground variant="blue" withPattern withDecorations className="py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Découvrez AfricaCompare
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Votre plateforme de comparaison multi-sectorielle en Afrique
          </p>
        </div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {cards.map((card) => (
            <InteractiveCard
              key={card.id}
              id={card.id}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
              description={card.description}
              isExpanded={expandedCard === card.id}
              onToggle={toggleCard}
            >
              {card.content}
            </InteractiveCard>
          ))}
        </div>

        <CTASection />
      </div>
    </SectionBackground>
  );
};
