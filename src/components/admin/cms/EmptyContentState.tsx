
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, History, Settings } from 'lucide-react';

interface EmptyContentStateProps {
  type: 'editor' | 'versions' | 'workflow';
  onCreateNew?: () => void;
}

export const EmptyContentState: React.FC<EmptyContentStateProps> = ({
  type,
  onCreateNew
}) => {
  const getConfig = () => {
    switch (type) {
      case 'editor':
        return {
          icon: FileText,
          title: 'Aucun contenu sélectionné',
          description: 'Sélectionnez un contenu à modifier ou créez-en un nouveau',
          actionLabel: 'Nouveau contenu',
          showAction: true
        };
      case 'versions':
        return {
          icon: History,
          title: 'Aucun contenu sélectionné',
          description: 'Sélectionnez un contenu pour voir ses versions',
          showAction: false
        };
      case 'workflow':
        return {
          icon: Settings,
          title: 'Aucun contenu sélectionné',
          description: 'Sélectionnez un contenu pour gérer son workflow',
          showAction: false
        };
      default:
        return {
          icon: FileText,
          title: 'Aucun contenu',
          description: 'Aucun contenu disponible',
          showAction: false
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <IconComponent className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">{config.title}</h3>
        <p className="text-gray-600 mb-4">{config.description}</p>
        {config.showAction && onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            {config.actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
