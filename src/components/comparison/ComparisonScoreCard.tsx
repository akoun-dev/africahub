
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, TrendingDown, CheckCircle, Award } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  criteria: Record<string, any>;
  score?: number;
  recommendation?: 'best_value' | 'best_for_you' | 'premium' | 'budget';
}

interface ComparisonScoreCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: () => void;
  criteriaWeights: Record<string, number>;
}

export const ComparisonScoreCard: React.FC<ComparisonScoreCardProps> = ({
  product,
  isSelected,
  onToggleSelect,
  criteriaWeights
}) => {
  const getRecommendationInfo = (recommendation?: string) => {
    switch (recommendation) {
      case 'best_value':
        return { icon: TrendingUp, label: 'Meilleur rapport qualité/prix', color: 'text-green-600' };
      case 'best_for_you':
        return { icon: Star, label: 'Recommandé pour vous', color: 'text-afroGold' };
      case 'premium':
        return { icon: Award, label: 'Option premium', color: 'text-purple-600' };
      case 'budget':
        return { icon: TrendingDown, label: 'Option économique', color: 'text-blue-600' };
      default:
        return null;
    }
  };

  const recommendationInfo = getRecommendationInfo(product.recommendation);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const topCriteria = Object.entries(product.criteria)
    .filter(([key]) => criteriaWeights[key] > 0)
    .sort(([a], [b]) => (criteriaWeights[b] || 0) - (criteriaWeights[a] || 0))
    .slice(0, 3);

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-xl ${
      isSelected ? 'ring-2 ring-afroGreen shadow-lg' : ''
    }`}>
      {/* Badge de recommandation */}
      {recommendationInfo && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-white border shadow-sm">
            <recommendationInfo.icon className={`h-3 w-3 mr-1 ${recommendationInfo.color}`} />
            <span className={recommendationInfo.color}>{recommendationInfo.label}</span>
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>
          {isSelected && (
            <CheckCircle className="h-6 w-6 text-afroGreen ml-2" />
          )}
        </div>

        {/* Score global */}
        <div className="flex items-center space-x-3 mt-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Score global</span>
              <span className={`text-lg font-bold ${getScoreColor(product.score || 0)}`}>
                {(product.score || 0).toFixed(0)}%
              </span>
            </div>
            <Progress value={product.score || 0} className="h-2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Prix */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Prix</span>
          <span className="text-lg font-bold text-afroGreen">
            {product.price} {product.currency}
          </span>
        </div>

        {/* Top critères */}
        {topCriteria.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Critères principaux</h4>
            {topCriteria.map(([criteria, value]) => (
              <div key={criteria} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">
                  {criteria.replace(/_/g, ' ')}
                </span>
                <span className="font-medium">
                  {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Points forts et faibles */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <h5 className="font-medium text-green-700">Points forts</h5>
            {Object.entries(product.criteria)
              .filter(([, value]) => typeof value === 'boolean' && value)
              .slice(0, 2)
              .map(([key]) => (
                <div key={key} className="text-green-600">
                  + {key.replace(/_/g, ' ')}
                </div>
              ))}
          </div>
          <div className="space-y-1">
            <h5 className="font-medium text-red-700">À améliorer</h5>
            {Object.entries(product.criteria)
              .filter(([, value]) => typeof value === 'boolean' && !value)
              .slice(0, 2)
              .map(([key]) => (
                <div key={key} className="text-red-600">
                  - {key.replace(/_/g, ' ')}
                </div>
              ))}
          </div>
        </div>

        {/* Bouton de sélection */}
        <Button 
          onClick={onToggleSelect}
          variant={isSelected ? "default" : "outline"}
          className="w-full"
        >
          {isSelected ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Sélectionné
            </>
          ) : (
            'Sélectionner pour comparer'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
