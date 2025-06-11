
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface TestHeaderProps {
  onRunAllTests: () => void;
}

export const TestHeader: React.FC<TestHeaderProps> = ({ onRunAllTests }) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        Tests d'Intégration et Validation
        <div className="flex gap-2">
          <Button onClick={onRunAllTests} size="sm">
            <Play className="h-4 w-4 mr-1" />
            Lancer tous les tests
          </Button>
        </div>
      </CardTitle>
      <div className="text-sm text-gray-600">
        Validation complète du système de comparaison et des optimisations
      </div>
    </CardHeader>
  );
};
