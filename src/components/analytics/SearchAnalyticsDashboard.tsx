
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchAnalyticsService, PopularQuery, SearchTrends, GeographicInsights } from '@/services/SearchAnalyticsService';
import { SearchCacheService } from '@/services/SearchCacheService';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Zap,
  Users,
  Search,
  Target,
  Globe,
  Activity
} from 'lucide-react';

export const SearchAnalyticsDashboard: React.FC = () => {
  const [popularQueries, setPopularQueries] = useState<PopularQuery[]>([]);
  const [trends, setTrends] = useState<SearchTrends | null>(null);
  const [geoInsights, setGeoInsights] = useState<GeographicInsights[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [cacheMetrics, setCacheMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [queries, trendsData, geoData, perfMetrics] = await Promise.all([
        SearchAnalyticsService.getPopularQueries(10, selectedPeriod),
        SearchAnalyticsService.getSearchTrends(selectedPeriod === 'day' ? 'daily' : selectedPeriod === 'week' ? 'weekly' : 'monthly'),
        SearchAnalyticsService.getGeographicInsights(),
        SearchAnalyticsService.getPerformanceMetrics('24h')
      ]);

      setPopularQueries(queries);
      setTrends(trendsData);
      setGeoInsights(geoData);
      setPerformanceMetrics(perfMetrics);
      setCacheMetrics(SearchCacheService.getStats());
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    SearchCacheService.clear();
    setCacheMetrics(SearchCacheService.getStats());
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics de Recherche</h1>
          <p className="text-gray-600">Insights et métriques de performance en temps réel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAnalytics}>
            <Activity className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={handleClearCache}>
            <Zap className="h-4 w-4 mr-2" />
            Vider Cache
          </Button>
        </div>
      </div>

      {/* Métriques de performance principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recherches totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics?.total_searches?.toLocaleString() || '0'}
                </p>
              </div>
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">
                +12% par rapport à hier
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics?.avg_search_time || 142}ms
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">
                -8% plus rapide
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de cache</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((cacheMetrics?.metrics?.hitRate || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-600">
                {cacheMetrics?.metrics?.hits || 0} hits / {cacheMetrics?.metrics?.totalQueries || 0} requêtes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux conversion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((performanceMetrics?.conversion_rate || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600">
                +3.2% ce mois
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets d'analytics */}
      <Tabs defaultValue="queries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queries">Requêtes populaires</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="queries" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requêtes populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Requêtes de Recherche
                </CardTitle>
                <div className="flex gap-2">
                  {['day', 'week', 'month'].map((period) => (
                    <Button
                      key={period}
                      size="sm"
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod(period as any)}
                    >
                      {period === 'day' ? 'Jour' : period === 'week' ? 'Semaine' : 'Mois'}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularQueries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{query.query}</p>
                          <p className="text-sm text-gray-600">
                            {query.frequency} recherches • {query.avg_results} résultats moy.
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={query.conversion_rate > 0.3 ? 'default' : 'secondary'}>
                          {(query.conversion_rate * 100).toFixed(1)}% conv.
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {query.avg_search_time}ms moy.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions automatiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Suggestions Intelligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Haute performance</span>
                    </div>
                    <p className="text-sm">Requêtes avec temps de réponse &lt; 100ms</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">assurance auto</Badge>
                      <Badge variant="outline" className="text-xs">smartphone</Badge>
                      <Badge variant="outline" className="text-xs">forfait internet</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-orange-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-orange-800">À optimiser</span>
                    </div>
                    <p className="text-sm">Requêtes avec faible taux de conversion</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">meilleur prix</Badge>
                      <Badge variant="outline" className="text-xs">comparaison</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">Tendances émergentes</span>
                    </div>
                    <p className="text-sm">Nouvelles requêtes en croissance</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">banque en ligne</Badge>
                      <Badge variant="outline" className="text-xs">écologique</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {geoInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {insight.country}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Recherches totales</p>
                      <p className="text-2xl font-bold">{insight.searches.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Catégories populaires</p>
                      <div className="flex flex-wrap gap-1">
                        {insight.top_categories.map((cat, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Marques populaires</p>
                      <div className="flex flex-wrap gap-1">
                        {insight.popular_brands.map((brand, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de conversion</span>
                        <span className="font-semibold text-green-600">
                          {(insight.avg_conversion_rate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métriques du cache */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance du Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de succès</span>
                    <span className="font-semibold">
                      {((cacheMetrics?.metrics?.hitRate || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Entrées en cache</span>
                    <span className="font-semibold">
                      {cacheMetrics?.size || 0} / {cacheMetrics?.maxSize || 1000}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Requêtes totales</span>
                    <span className="font-semibold">
                      {cacheMetrics?.metrics?.totalQueries || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps de réponse moy.</span>
                    <span className="font-semibold">
                      {Math.round(cacheMetrics?.metrics?.averageResponseTime || 0)}ms
                    </span>
                  </div>

                  <div className="pt-3 border-t">
                    <Button onClick={handleClearCache} variant="outline" size="sm" className="w-full">
                      Vider le cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métriques système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Métriques Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Utilisateurs uniques</span>
                    <span className="font-semibold">
                      {performanceMetrics?.unique_users?.toLocaleString() || '0'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux d&apos;erreur</span>
                    <span className="font-semibold text-green-600">
                      {((performanceMetrics?.error_rate || 0) * 100).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Heures de pointe</span>
                    <div className="flex gap-1">
                      {(performanceMetrics?.peak_hours || []).map((hour: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {hour}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Répartition appareils</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Mobile</span>
                        <span className="text-xs">
                          {((performanceMetrics?.device_breakdown?.mobile || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Desktop</span>
                        <span className="text-xs">
                          {((performanceMetrics?.device_breakdown?.desktop || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Tablette</span>
                        <span className="text-xs">
                          {((performanceMetrics?.device_breakdown?.tablet || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Évolution des Recherches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trends && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trends.data.slice(0, 3).map((day, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">{day.date}</p>
                        <p className="text-lg font-bold">{day.searches} recherches</p>
                        <p className="text-xs text-gray-600">
                          {day.unique_users} utilisateurs • {day.avg_response_time}ms moy.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
