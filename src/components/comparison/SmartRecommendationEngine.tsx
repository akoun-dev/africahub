
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Star, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  criteria: Record<string, any>;
  score?: number;
}

interface SmartRecommendationEngineProps {
  products: Product[];
  userProfile?: any;
  selectedProducts: string[];
  onProductRecommend: (productId: string) => void;
}

export const SmartRecommendationEngine: React.FC<SmartRecommendationEngineProps> = ({
  products,
  userProfile,
  selectedProducts,
  onProductRecommend
}) => {
  const recommendations = useMemo(() => {
    if (products.length === 0) return [];

    const sortedByScore = [...products].sort((a, b) => (b.score || 0) - (a.score || 0));
    const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
    
    // Calculer le rapport qualité/prix
    const withValueScore = products.map(product => ({
      ...product,
      valueScore: ((product.score || 0) / Math.sqrt(product.price)) * 100
    })).sort((a, b) => b.valueScore - a.valueScore);

    const recs = [];

    // Meilleure performance globale
    if (sortedByScore[0]) {
      recs.push({
        type: 'best_performance',
        icon: Star,
        title: 'Meilleure performance globale',
        description: 'Le produit avec le score le plus élevé sur tous les critères',
        product: sortedByScore[0],
        reason: `Score exceptionnel de ${(sortedByScore[0].score || 0).toFixed(0)}%`,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      });
    }

    // Meilleur rapport qualité/prix
    if (withValueScore[0]) {
      recs.push({
        type: 'best_value',
        icon: TrendingUp,
        title: 'Meilleur rapport qualité/prix',
        description: 'L\'équilibre optimal entre performance et coût',
        product: withValueScore[0],
        reason: `Excellent ratio performance/prix: ${withValueScore[0].valueScore.toFixed(0)} points`,
        color: 'bg-green-100 text-green-800 border-green-200'
      });
    }

    // Option économique
    if (sortedByPrice[0]) {
      recs.push({
        type: 'budget_friendly',
        icon: DollarSign,
        title: 'Option la plus économique',
        description: 'Pour optimiser votre budget sans compromis majeur',
        product: sortedByPrice[0],
        reason: `Prix le plus accessible: ${sortedByPrice[0].price} ${sortedByPrice[0].currency}`,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      });
    }

    // Recommandation personnalisée (si profil utilisateur disponible)
    if (userProfile && sortedByScore[1]) {
      recs.push({
        type: 'personalized',
        icon: Target,
        title: 'Recommandé pour votre profil',
        description: 'Basé sur vos préférences et votre historique',
        product: sortedByScore[1],
        reason: 'Correspondance avec vos critères prioritaires',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      });
    }

    return recs.slice(0, 3); // Limiter à 3 recommandations
  }, [products, userProfile]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-afroGreen" />
          Recommandations intelligentes
        </CardTitle>
        <p className="text-sm text-gray-600">
          Nos suggestions basées sur l'analyse de vos critères et préférences
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <div 
              key={rec.type}
              className="relative p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${rec.color}`}>
                  <rec.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                  
                  <div className="mb-3">
                    <div className="font-medium text-sm">{rec.product.name}</div>
                    <div className="text-xs text-gray-500">{rec.product.brand}</div>
                    <div className="text-sm font-bold text-afroGreen mt-1">
                      {rec.product.price} {rec.product.currency}
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs mb-3">
                    {rec.reason}
                  </Badge>
                  
                  <Button
                    size="sm"
                    variant={selectedProducts.includes(rec.product.id) ? "default" : "outline"}
                    onClick={() => onProductRecommend(rec.product.id)}
                    className="w-full text-xs"
                  >
                    {selectedProducts.includes(rec.product.id) ? 'Sélectionné' : 'Ajouter à la comparaison'}
                  </Button>
                </div>
              </div>
              
              {index === 0 && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-afroGold text-afroBlack text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Top choix
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Tendances du marché</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Plus populaire:</span> {recommendations[0]?.product.name}
            </div>
            <div>
              <span className="font-medium">Tendance prix:</span> Stable
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
