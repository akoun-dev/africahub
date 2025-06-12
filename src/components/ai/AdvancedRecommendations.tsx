
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useRecommendationInteractions } from '@/hooks/useRecommendationInteractions';
import { Brain, Star, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { AIRecommendation } from '@/types/recommendations';
import { aiToRecommendation } from '@/utils/recommendationConverter';

interface AIRecommendationsProps {
  insuranceType?: string;
}

const AdvancedRecommendations: React.FC<AIRecommendationsProps> = ({ insuranceType }) => {
  const { data: recommendations, isLoading, refetch } = useAIRecommendations([], {});
  
  // Convert AIRecommendation[] to Recommendation[] for the hook
  const convertedRecommendations = recommendations?.map(aiToRecommendation) || [];
  
  const { 
    handleGenerateRecommendations, 
    handleRecommendationClick,
    isGenerating 
  } = useRecommendationInteractions(convertedRecommendations, insuranceType);

  const handleAdvancedRecommendationClick = (recommendation: AIRecommendation) => {
    const converted = aiToRecommendation(recommendation);
    handleRecommendationClick(converted);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Bon';
    return 'Moyen';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-insurPurple" />
              <CardTitle>Recommandations IA Avancées</CardTitle>
            </div>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isGenerating}
              size="sm"
              variant="outline"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            Nos recommandations avancées personnalisées basées sur l'IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!recommendations || recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune recommandation avancée disponible
              </h3>
              <p className="text-gray-600 mb-4">
                Cliquez sur "Générer" pour obtenir des recommandations IA personnalisées
              </p>
              <Button onClick={handleGenerateRecommendations}>
                Obtenir mes recommandations IA
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <Card 
                  key={recommendation.id} 
                  className="border-l-4 border-l-insurPurple cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAdvancedRecommendationClick(recommendation)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {recommendation.products?.name}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {recommendation.products?.brand}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          {recommendation.products?.description}
                        </p>
                        {recommendation.reasoning && (
                          <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                            <strong>Pourquoi cette recommandation :</strong> {recommendation.reasoning}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Badge 
                            className={`${getScoreColor(recommendation.recommendation_score)} text-white`}
                          >
                            {getScoreLabel(recommendation.recommendation_score)}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold">
                          {recommendation.products?.price} {recommendation.products?.currency}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedRecommendations;
