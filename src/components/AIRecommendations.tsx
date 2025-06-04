
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIRecommendations, useGenerateRecommendations } from '@/hooks/useAIRecommendations';
import { useSearch } from '@/hooks/useSearch';
import { Brain, Star, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AIRecommendationsProps {
  insuranceType?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ insuranceType }) => {
  const { searchResults } = useSearch();
  const { data: recommendations, isLoading, refetch } = useAIRecommendations(searchResults);
  const generateRecommendations = useGenerateRecommendations();

  const handleGenerateRecommendations = async () => {
    try {
      await generateRecommendations.mutateAsync({
        insuranceType: insuranceType || 'auto',
        preferences: {
          budget_range: 'medium',
          risk_tolerance: 'moderate'
        }
      });
      toast({
        title: "Recommandations générées",
        description: "De nouvelles recommandations IA ont été créées pour vous",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les recommandations",
        variant: "destructive",
      });
    }
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
              <CardTitle>Recommandations IA</CardTitle>
            </div>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={generateRecommendations.isPending}
              size="sm"
              variant="outline"
            >
              {generateRecommendations.isPending ? (
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
            Nos recommandations personnalisées basées sur vos besoins et votre profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!recommendations || recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune recommandation disponible
              </h3>
              <p className="text-gray-600 mb-4">
                Cliquez sur "Générer" pour obtenir des recommandations personnalisées
              </p>
              <Button onClick={handleGenerateRecommendations}>
                Obtenir mes recommandations
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border-l-4 border-l-insurPurple">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {recommendation.products?.name || recommendation.product?.name}
                        </h4>
                        <p className="text-gray-600 mb-2">
                          {recommendation.products?.brand || recommendation.product?.brand}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                          {recommendation.products?.description || recommendation.product?.category}
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
                            className={`${getScoreColor(recommendation.recommendation_score || recommendation.score || 0)} text-white`}
                          >
                            {getScoreLabel(recommendation.recommendation_score || recommendation.score || 0)}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold">
                          {recommendation.products?.price || recommendation.product?.price} {recommendation.products?.currency || recommendation.product?.currency}
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

export default AIRecommendations;
