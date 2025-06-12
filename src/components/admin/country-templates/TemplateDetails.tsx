
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Copy, Download } from 'lucide-react';
import { CountryTemplate } from './types';

interface TemplateDetailsProps {
  template: CountryTemplate;
}

export const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du Template: {template.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration Details */}
          <div className="space-y-4">
            <h4 className="font-medium">Configuration</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Devise:</span>
                <span className="font-medium">{template.config.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuseau horaire:</span>
                <span className="font-medium">{template.config.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format date:</span>
                <span className="font-medium">{template.config.dateFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format nombre:</span>
                <span className="font-medium">{template.config.numberFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux commission:</span>
                <span className="font-medium">{template.config.commissionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Templates email:</span>
                <span className="font-medium">{template.config.emailTemplates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Niveau réglementaire:</span>
                <Badge variant="outline" className="capitalize">
                  {template.config.regulatoryLevel}
                </Badge>
              </div>
            </div>
          </div>

          {/* Usage and Actions */}
          <div className="space-y-4">
            <h4 className="font-medium">Utilisation</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pays utilisant ce template:</span>
                <span className="font-medium">{template.usageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière modification:</span>
                <span className="font-medium">{template.lastUpdated}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Button className="w-full bg-afroGreen hover:bg-afroGreen/90">
                <Settings className="h-4 w-4 mr-2" />
                Modifier Template
              </Button>
              <Button variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Dupliquer Template
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter Template
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
