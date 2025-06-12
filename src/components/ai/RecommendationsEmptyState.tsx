
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles } from 'lucide-react';

interface RecommendationsEmptyStateProps {
  onGenerateRecommendations: () => void;
}

export const RecommendationsEmptyState: React.FC<RecommendationsEmptyStateProps> = ({
  onGenerateRecommendations
}) => {
  return (
    <div className="text-center py-8">
      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucune recommandation IA disponible
      </h3>
      <p className="text-gray-600 mb-4">
        Cliquez sur "Générer IA" pour obtenir des recommandations intelligentes personnalisées
      </p>
      <Button onClick={onGenerateRecommendations}>
        <Sparkles className="h-4 w-4 mr-2" />
        Obtenir mes recommandations IA
      </Button>
    </div>
  );
};
