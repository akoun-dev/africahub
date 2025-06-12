
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { useRecommendationInteractions } from '@/hooks/useRecommendationInteractions';
import { useSectorStats } from '@/hooks/useSectorStats';
import { Brain, TrendingUp, Users, DollarSign, Star, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { AIRecommendation } from '@/types/recommendations';
import { aiToRecommendation } from '@/utils/recommendationConverter';

interface PersonalizedSectorContentProps {
  sectorSlug: string;
  userLocation?: string;
}

const PersonalizedSectorContent: React.FC<PersonalizedSectorContentProps> = ({ 
  sectorSlug, 
  userLocation 
}) => {
  const { data: recommendations, isLoading: recommendationsLoading } = useAIRecommendations([], {});
  const { data: sectorStats, isLoading: statsLoading } = useSectorStats(sectorSlug);
  
  // Convert recommendations for the hook
  const convertedRecommendations = recommendations?.map(aiToRecommendation) || [];
  
  const { 
    handleGenerateRecommendations, 
    handleRecommendationClick,
    isGenerating 
  } = useRecommendationInteractions(convertedRecommendations);

  const handleRecommendationClickWrapper = (recommendation: AIRecommendation) => {
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

  if (recommendationsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Sector-specific recommendations
  const sectorRecommendations = recommendations?.filter(
    rec => rec.insurance_type === sectorSlug
  ) || [];

  return (
    <div className="space-y-6">
      {/* Sector Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-insurPurple" />
            <span>Aperçu du secteur {sectorSlug}</span>
          </CardTitle>
          <CardDescription>
            Analyse personnalisée du secteur {sectorSlug} pour vos besoins d'assurance
            {userLocation && ` - ${userLocation}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Compagnies actives</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sectorStats?.totalCompanies || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Prix moyen</p>
                <p className="text-2xl font-bold text-green-600">
                  {sectorStats?.averagePrice || 0}€
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-purple-600">
                  {sectorStats?.averageRating || 0}/5
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-insurPurple" />
              <CardTitle>Recommandations personnalisées pour {sectorSlug}</CardTitle>
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
                  Actualiser
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            Sélection personnalisée d'offres d'assurance pour le secteur {sectorSlug}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sectorRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune recommandation spécifique au secteur
              </h3>
              <p className="text-gray-600 mb-4">
                Générez des recommandations personnalisées pour le secteur {sectorSlug}
              </p>
              <Button onClick={handleGenerateRecommendations}>
                Générer des recommandations
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sectorRecommendations.map((recommendation) => (
                <Card 
                  key={recommendation.id} 
                  className="border-l-4 border-l-insurPurple cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleRecommendationClickWrapper(recommendation)}
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
                            <strong>Adapté au secteur {sectorSlug} :</strong> {recommendation.reasoning}
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

export default PersonalizedSectorContent;
