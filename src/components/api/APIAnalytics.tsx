
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAPIAnalytics } from '@/hooks/useAPIManagement';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Activity
} from 'lucide-react';

export const APIAnalytics: React.FC = () => {
  const { data: analytics, isLoading } = useAPIAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const mockMetrics = {
    totalRequests: 12847,
    successRate: 98.5,
    avgResponseTime: 142,
    activeKeys: 8,
    topEndpoints: [
      { endpoint: '/api/v1/products', requests: 4521, avgTime: 120 },
      { endpoint: '/api/v1/companies', requests: 3204, avgTime: 89 },
      { endpoint: '/api/v1/compare', requests: 2456, avgTime: 245 },
      { endpoint: '/api/v1/quotes', requests: 1834, avgTime: 167 }
    ],
    errorsByCode: [
      { code: 401, count: 89, percentage: 45 },
      { code: 403, count: 67, percentage: 34 },
      { code: 500, count: 28, percentage: 14 },
      { code: 429, count: 14, percentage: 7 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics API</h2>
        <Select defaultValue="7d">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Dernières 24 heures</SelectItem>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Requêtes totales</span>
            </div>
            <p className="text-2xl font-bold">{mockMetrics.totalRequests.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">↗ +12% vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Taux de succès</span>
            </div>
            <p className="text-2xl font-bold">{mockMetrics.successRate}%</p>
            <p className="text-xs text-green-600 mt-1">↗ +0.3% vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Temps de réponse moy.</span>
            </div>
            <p className="text-2xl font-bold">{mockMetrics.avgResponseTime}ms</p>
            <p className="text-xs text-red-600 mt-1">↗ +8ms vs période précédente</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">Clés actives</span>
            </div>
            <p className="text-2xl font-bold">{mockMetrics.activeKeys}</p>
            <p className="text-xs text-blue-600 mt-1">2 nouvelles cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Endpoints les plus utilisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMetrics.topEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-mono text-sm">{endpoint.endpoint}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{endpoint.requests.toLocaleString()} requêtes</span>
                      <span>{endpoint.avgTime}ms moyen</span>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <div className="text-sm font-bold">#{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Analyse des erreurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMetrics.errorsByCode.map((error, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-red-700">{error.code}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{error.count} erreurs</p>
                      <p className="text-xs text-gray-500">{error.percentage}% du total</p>
                    </div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${error.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Over Time Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation dans le temps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Graphique d'utilisation API</p>
              <p className="text-sm text-gray-500">Intégration avec recharts à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
