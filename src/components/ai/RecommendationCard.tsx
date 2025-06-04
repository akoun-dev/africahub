
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, MapPin, Brain } from 'lucide-react';
import { AdvancedRecommendation } from '@/hooks/useAdvancedRecommendations';

interface RecommendationCardProps {
  recommendation: AdvancedRecommendation;
  onRecommendationClick: (recommendation: AdvancedRecommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
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
                {recommendation.product?.name || 'Produit recommandé'}
              </h4>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getTypeIcon(recommendation.recommendation_type)}
                <span>{getRecommendationTypeLabel(recommendation.recommendation_type)}</span>
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-2 font-medium">
              {recommendation.product?.brand || 'Marque inconnue'}
            </p>
            
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {recommendation.product?.description || 'Description non disponible'}
            </p>
            
            {recommendation.reasoning && (
              <div className="bg-purple-50 p-3 rounded-lg mb-3 border border-purple-100">
                <p className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  Analyse IA :
                </p>
                <div className="space-y-1">
                  {recommendation.reasoning.main_factors?.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-center text-sm text-purple-700">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                      {factor}
                    </div>
                  ))}
                </div>
                
                {recommendation.context_factors && (
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <div className="flex items-center space-x-4 text-xs text-purple-600">
                      {recommendation.context_factors.location_match && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Adapté à votre région
                        </div>
                      )}
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {Math.round(recommendation.context_factors.behavior_similarity * 100)}% similitude
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="ml-4 text-right space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <Badge 
                className={`${getConfidenceColor(recommendation.confidence_score)} text-white text-xs`}
              >
                {getConfidenceLabel(recommendation.confidence_score)}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-500">
              Confiance: {Math.round(recommendation.confidence_score * 100)}%
            </div>
            
            <div className="pt-2">
              <p className="text-lg font-bold text-green-600">
                {recommendation.product?.price || 0} {recommendation.product?.currency || 'EUR'}
              </p>
              <p className="text-xs text-gray-500">Prix recommandé</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Secteur: {recommendation.insurance_type}</span>
            <span className="group-hover:text-purple-600 transition-colors">
              Cliquez pour plus de détails →
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
