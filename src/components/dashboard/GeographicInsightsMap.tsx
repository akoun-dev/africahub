
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, TrendingUp, Users } from 'lucide-react';

interface GeographicInsightsMapProps {
  insights: any[];
}

export const GeographicInsightsMap: React.FC<GeographicInsightsMapProps> = ({ insights }) => {
  // Données simulées si pas d'insights fournis
  const defaultInsights = [
    {
      country: 'SN',
      countryName: 'Sénégal',
      searches: 2456,
      top_categories: ['assurance-auto', 'smartphones', 'assurance-sante'],
      avg_conversion_rate: 0.28,
      popular_brands: ['Orange', 'Sonatel', 'Samsung'],
      growth: '+23%'
    },
    {
      country: 'CI',
      countryName: 'Côte d\'Ivoire',
      searches: 1923,
      top_categories: ['smartphones', 'forfait-internet', 'assurance-auto'],
      avg_conversion_rate: 0.31,
      popular_brands: ['MTN', 'Orange', 'Apple'],
      growth: '+18%'
    },
    {
      country: 'MA',
      countryName: 'Maroc',
      searches: 1654,
      top_categories: ['assurance-sante', 'ordinateurs', 'smartphones'],
      avg_conversion_rate: 0.25,
      popular_brands: ['Maroc Telecom', 'BMCE', 'iPhone'],
      growth: '+15%'
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Insights Géographiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayInsights.map((insight, index) => (
              <div key={insight.country} className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{insight.countryName || insight.country}</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {insight.growth || '+20%'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{insight.searches.toLocaleString()} recherches</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {Math.round(insight.avg_conversion_rate * 100)}% conversion
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Top catégories:</p>
                  <div className="flex flex-wrap gap-1">
                    {insight.top_categories.slice(0, 3).map((category: string) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Marques populaires:</p>
                  <div className="flex flex-wrap gap-1">
                    {insight.popular_brands.slice(0, 2).map((brand: string) => (
                      <Badge key={brand} variant="secondary" className="text-xs">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {displayInsights.reduce((sum, insight) => sum + insight.searches, 0).toLocaleString()}
              </p>
              <p className="text-sm opacity-90">Total recherches</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {Math.round(
                  displayInsights.reduce((sum, insight) => sum + insight.avg_conversion_rate, 0) / 
                  displayInsights.length * 100
                )}%
              </p>
              <p className="text-sm opacity-90">Conversion moyenne</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{displayInsights.length}</p>
              <p className="text-sm opacity-90">Pays actifs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
