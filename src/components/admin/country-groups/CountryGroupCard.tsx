
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountryGroup } from './types';
import { getRingClasses, getBorderClasses } from './utils';

interface CountryGroupCardProps {
  group: CountryGroup;
  isSelected: boolean;
  onClick: () => void;
}

export const CountryGroupCard: React.FC<CountryGroupCardProps> = ({
  group,
  isSelected,
  onClick
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected 
          ? `ring-2 ${getRingClasses(group.color, true)} ${getBorderClasses(group.color, true)}`
          : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: group.color }}
          />
          <Badge variant={group.isActive ? 'default' : 'secondary'}>
            {group.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
        <CardTitle className="text-lg">{group.name}</CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Pays:</span>
          <span className="font-medium">{group.countries.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Actifs:</span>
          <span className="font-medium text-green-600">{group.activeCountries}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Utilisateurs:</span>
          <span className="font-medium">{group.totalUsers.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
