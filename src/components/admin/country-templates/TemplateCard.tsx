
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Copy } from 'lucide-react';
import { CountryTemplate } from './types';

interface TemplateCardProps {
  template: CountryTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-afroGreen border-afroGreen' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <FileText className="h-5 w-5 text-afroGreen" />
          <Badge variant="outline">{template.usageCount} utilisations</Badge>
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <p className="text-sm text-gray-600">{template.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Pays:</span>
          <div className="flex gap-1">
            {template.countries.slice(0, 3).map(country => (
              <Badge key={country} variant="secondary" className="text-xs">
                {country}
              </Badge>
            ))}
            {template.countries.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.countries.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Devise:</span>
          <span className="font-medium">{template.config.currency}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Commission:</span>
          <span className="font-medium">{template.config.commissionRate}%</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Éditer
          </Button>
          <Button size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
