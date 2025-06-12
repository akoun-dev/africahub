
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SystemComponent } from '../types/SystemValidationTypes';

interface SystemOverviewCardProps {
  globalScore: number;
  components: SystemComponent[];
  isValidating: boolean;
  onValidateSystem: () => void;
}

export const SystemOverviewCard: React.FC<SystemOverviewCardProps> = ({
  globalScore,
  components,
  isValidating,
  onValidateSystem
}) => {
  const healthyComponents = components.filter(c => c.status === 'healthy').length;
  const totalComponents = components.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Validation du Système Global
          <Button 
            onClick={onValidateSystem} 
            disabled={isValidating}
            size="sm"
          >
            {isValidating ? 'Validation...' : 'Valider Système'}
          </Button>
        </CardTitle>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{globalScore}</div>
            <div className="text-sm text-gray-600">Score Global</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {healthyComponents}/{totalComponents}
            </div>
            <div className="text-sm text-gray-600">Composants Sains</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {components.flatMap(c => c.metrics).length}
            </div>
            <div className="text-sm text-gray-600">Métriques Suivies</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
