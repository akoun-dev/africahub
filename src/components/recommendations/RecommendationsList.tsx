
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Star, TrendingUp, Zap } from 'lucide-react';
import { Recommendation } from '@/domain/entities/Recommendation';
import { useTranslation } from '@/hooks/useTranslation';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  loading: boolean;
  onGenerateWithPreferences: () => void;
  onInteraction: (recommendationId: string, type: 'viewed' | 'clicked' | 'purchased') => void;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  loading,
  onGenerateWithPreferences,
  onInteraction
}) => {
  const { t } = useTranslation();

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return t('common.excellent');
    if (score >= 0.6) return t('common.good');
    return t('common.average');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <span className="text-gray-600">{t('recommendations.loading')}</span>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center py-8">
          <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {t('recommendations.no_available')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {t('recommendations.create_personalized')}
          </p>
          <Button onClick={onGenerateWithPreferences}>
            <Brain className="w-4 h-4 mr-2" />
            {t('recommendations.create_my')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-gray-900">
                    {t('recommendations.recommendation_id')} #{recommendation.id.slice(-8)}
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  {t('recommendations.type')}: {recommendation.recommendationType} • {t('recommendations.sector')}: {recommendation.insuranceType}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <Badge variant="outline" className={getScoreColor(recommendation.confidenceScore)}>
                  {getScoreLabel(recommendation.confidenceScore)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 text-gray-900 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t('recommendations.factors')}:
                </h4>
                <ul className="text-sm space-y-2">
                  {recommendation.reasoning.mainFactors.map((factor, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="block font-medium text-gray-600 mb-1">{t('recommendations.confidence_score')}:</span>
                  <div className={`text-lg font-bold ${getScoreColor(recommendation.confidenceScore)}`}>
                    {(recommendation.confidenceScore * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="block font-medium text-gray-600 mb-1">{t('recommendations.geo_match')}:</span>
                  <div className={`text-lg font-bold ${recommendation.contextFactors.locationMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {recommendation.contextFactors.locationMatch ? t('common.yes') : t('common.no')}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="block font-medium text-gray-600 mb-1">{t('recommendations.relevance')}:</span>
                  <div className="text-lg font-bold text-blue-600">
                    {(recommendation.contextFactors.contentRelevance * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onInteraction(recommendation.id, 'viewed')}
                  disabled={recommendation.isViewed}
                  className="disabled:opacity-50"
                >
                  {recommendation.isViewed ? t('recommendations.viewed') : t('recommendations.mark_viewed')}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onInteraction(recommendation.id, 'clicked')}
                  disabled={recommendation.isClicked}
                  className="disabled:opacity-50"
                >
                  {recommendation.isClicked ? t('recommendations.clicked') : t('recommendations.click')}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onInteraction(recommendation.id, 'purchased')}
                  disabled={recommendation.isPurchased}
                  className="disabled:opacity-50"
                >
                  {recommendation.isPurchased ? t('recommendations.purchased') : t('recommendations.simulate_purchase')}
                </Button>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                {t('recommendations.created')}: {recommendation.createdAt.toLocaleDateString()} • 
                {t('recommendations.expires')}: {recommendation.expiresAt.toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecommendationsList;
