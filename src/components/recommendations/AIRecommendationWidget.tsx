
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { AIRecommendation } from '@/types/recommendations';

interface AIRecommendationWidgetProps {
  recommendations: AIRecommendation[];
  loading: boolean;
  onProductClick: (productId: string) => void;
  onRefresh: () => void;
}

export const AIRecommendationWidget: React.FC<AIRecommendationWidgetProps> = ({
  recommendations,
  loading,
  onProductClick,
  onRefresh
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'similar': return <TrendingUp className="h-4 w-4" />;
      case 'popular': return <Star className="h-4 w-4" />;
      case 'complementary': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'similar': return 'Similaire';
      case 'popular': return 'Populaire';
      case 'complementary': return 'Complémentaire';
      default: return 'Personnalisé';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Recommandations IA
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune recommandation disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={rec.product.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProductClick(rec.product.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getTypeIcon(rec.type)}
                        {getTypeLabel(rec.type)}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getConfidenceColor(rec.confidence)}`}></div>
                    </div>
                    <h4 className="font-semibold">{rec.product.name}</h4>
                    <p className="text-sm text-gray-600">{rec.product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{rec.product.price} {rec.product.currency}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{rec.product.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">Score IA:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${rec.score * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{Math.round(rec.score * 100)}%</span>
                  </div>
                </div>

                {rec.reasoning && (
                  <div className="space-y-1">
                    <p className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      • {rec.reasoning}
                    </p>
                  </div>
                )}

                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Top IA
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Apprentissage continu</span>
            </div>
            <p className="text-xs text-gray-600">
              Notre IA apprend de vos interactions pour améliorer les recommandations futures.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
