
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Loader2 } from 'lucide-react';

interface RecommendationsHeaderProps {
  onGenerateRecommendations: () => void;
  isGenerating: boolean;
}

export const RecommendationsHeader: React.FC<RecommendationsHeaderProps> = ({
  onGenerateRecommendations,
  isGenerating
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <CardTitle>Recommandations IA Avancées</CardTitle>
        </div>
        <Button 
          onClick={onGenerateRecommendations}
          disabled={isGenerating}
          size="sm"
          variant="outline"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Générer IA
            </>
          )}
        </Button>
      </div>
    </CardHeader>
  );
};
