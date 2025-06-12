
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity } from 'lucide-react';

interface PerformanceMetricsChartProps {
  metrics: any;
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = ({ metrics }) => {
  // Données simulées pour la démonstration
  const performanceData = [
    { hour: '00h', searches: 120, responseTime: 145, errors: 2 },
    { hour: '04h', searches: 80, responseTime: 132, errors: 1 },
    { hour: '08h', searches: 340, responseTime: 158, errors: 3 },
    { hour: '12h', searches: 520, responseTime: 142, errors: 2 },
    { hour: '16h', searches: 480, responseTime: 139, errors: 4 },
    { hour: '20h', searches: 380, responseTime: 147, errors: 1 },
  ];

  const cacheData = [
    { period: 'Sem 1', hitRate: 68, misses: 340 },
    { period: 'Sem 2', hitRate: 71, misses: 290 },
    { period: 'Sem 3', hitRate: 73, misses: 250 },
    { period: 'Sem 4', hitRate: 75, misses: 220 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Métriques de Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Graphique des recherches et temps de réponse */}
        <div>
          <h4 className="text-sm font-medium mb-3">Recherches par heure</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="searches" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique du temps de réponse */}
        <div>
          <h4 className="text-sm font-medium mb-3">Temps de réponse (ms)</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="responseTime" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Métriques supplémentaires */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {metrics?.error_rate ? `${(metrics.error_rate * 100).toFixed(1)}%` : '0.02%'}
            </p>
            <p className="text-xs text-gray-600">Taux d'erreur</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {metrics?.total_searches ? `${(metrics.total_searches / 1000).toFixed(1)}K` : '12.4K'}
            </p>
            <p className="text-xs text-gray-600">Requêtes totales</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
