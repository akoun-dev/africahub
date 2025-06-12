
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Heart, Activity } from 'lucide-react';

interface PersonalizedInsightsProps {
  insights: {
    top_categories: string[];
    preferred_price_range: { min: number; max: number };
    favorite_brands: string[];
    activity_score: number;
  } | null;
}

export const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ insights }) => {
  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Insights Personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Pas assez de données pour générer des insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Votre Profil IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score d'activité */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Score d'activité</span>
            <span className="text-sm">{Math.round(insights.activity_score * 100)}%</span>
          </div>
          <Progress value={insights.activity_score * 100} className="h-2" />
          <p className="text-xs text-gray-600 mt-1">
            Plus vous utilisez la plateforme, meilleures sont nos recommandations
          </p>
        </div>

        {/* Catégories préférées */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Vos catégories favorites</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.top_categories.map((category, index) => (
              <Badge 
                key={category} 
                variant={index === 0 ? "default" : "secondary"}
                className={index === 0 ? "bg-green-500" : ""}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Gamme de prix */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Gamme de prix habituelle</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">{insights.preferred_price_range.min.toFixed(0)} XOF</span>
              {' - '}
              <span className="font-semibold">{insights.preferred_price_range.max.toFixed(0)} XOF</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Basé sur vos consultations récentes
            </p>
          </div>
        </div>

        {/* Marques favorites */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">Marques préférées</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {insights.favorite_brands.map((brand, index) => (
              <div 
                key={brand}
                className="bg-gray-50 p-2 rounded text-center"
              >
                <p className="text-sm font-medium">{brand}</p>
                <p className="text-xs text-gray-600">#{index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conseils IA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">💡 Conseil IA</h4>
          <p className="text-xs text-gray-700">
            Continuez à explorer différentes catégories pour découvrir de nouveaux produits 
            qui correspondent à vos besoins !
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
