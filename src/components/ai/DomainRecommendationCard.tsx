
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, MapPin, Brain } from 'lucide-react';
import { Recommendation } from '@/domain/entities/Recommendation';

interface DomainRecommendationCardProps {
  recommendation: Recommendation;
  onRecommendationClick: (recommendation: Recommendation) => void;
}

export const DomainRecommendationCard: React.FC<DomainRecommendationCardProps> = ({
  recommendation,
  onRecommendationClick
}) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return 'Très fiable';
    if (score >= 0.6) return 'Fiable';
    return 'Modéré';
  };

  const getRecommendationTypeLabel = (type: string) => {
    const labels = {
      behavioral: 'Basé sur votre comportement',
      collaborative: 'Utilisateurs similaires',
      content: 'Caractéristiques produit',
      hybrid: 'IA avancée'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'behavioral':
        return <TrendingUp className="h-4 w-4" />;
      case 'collaborative':
        return <Star className="h-4 w-4" />;
      case 'content':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card 
      className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onRecommendationClick(recommendation)}
    >
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-lg group-hover:text-purple-700 transition-colors">
                Produit recommandé #{recommendation.productId.slice(-8)}
              </h4>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getTypeIcon(recommendation.recommendationType)}
                <span>{getRecommendationTypeLabel(recommendation.recommendationType)}</span>
              </Badge>
            </div>
            
            {recommendation.reasoning.mainFactors && recommendation.reasoning.mainFactors.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg mb-3 border border-purple-100">
                <p className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  Analyse IA :
                </p>
                <div className="space-y-1">
                  {recommendation.reasoning.mainFactors.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-center text-sm text-purple-700">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                      {factor}
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <div className="flex items-center space-x-4 text-xs text-purple-600">
                    {recommendation.contextFactors.locationMatch && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Adapté à votre région
                      </div>
                    )}
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.round(recommendation.contextFactors.behaviorSimilarity * 100)}% similitude
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="ml-4 text-right space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <Badge 
                className={`${getConfidenceColor(recommendation.confidenceScore)} text-white text-xs`}
              >
                {getConfidenceLabel(recommendation.confidenceScore)}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-500">
              Confiance: {Math.round(recommendation.confidenceScore * 100)}%
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Secteur: {recommendation.insuranceType}</span>
            <span className="group-hover:text-purple-600 transition-colors">
              Cliquez pour plus de détails →
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
