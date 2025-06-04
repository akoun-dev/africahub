
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

export type CardType = 'map' | 'sectors' | 'process' | 'advantages';

interface InteractiveCardProps {
  id: CardType;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  description: string;
  isExpanded: boolean;
  onToggle: (cardType: CardType) => void;
  children: React.ReactNode;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  color,
  description,
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:shadow-lg bg-gradient-to-br from-white/80 via-white/70 to-amber-50/30 border-afroGold/15 backdrop-blur-sm ${
        isExpanded ? 'shadow-xl scale-[1.01] border-afroGold/25' : 'hover:scale-[1.005] hover:border-afroGold/20'
      }`}
      onClick={() => onToggle(id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${color} shadow-lg`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto hover:bg-afroGold/10 hover:text-afroGold"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </CardHeader>
      
      {isExpanded && children}
    </Card>
  );
};
