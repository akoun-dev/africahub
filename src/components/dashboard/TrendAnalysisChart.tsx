
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface TrendAnalysisChartProps {
  trends: any;
}

export const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({ trends }) => {
  // Données simulées pour les tendances
  const trendData = [
    { date: '2024-01-20', searches: 1100, users: 420, avgTime: 150 },
    { date: '2024-01-21', searches: 1250, users: 480, avgTime: 145 },
    { date: '2024-01-22', searches: 1400, users: 520, avgTime: 142 },
    { date: '2024-01-23', searches: 1300, users: 490, avgTime: 148 },
    { date: '2024-01-24', searches: 1600, users: 610, avgTime: 140 },
    { date: '2024-01-25', searches: 1450, users: 580, avgTime: 144 },
    { date: '2024-01-26', searches: 1700, users: 650, avgTime: 138 },
  ];

  const popularQueries = [
    { query: 'assurance auto', count: 234, trend: '+15%' },
    { query: 'smartphone', count: 189, trend: '+8%' },
    { query: 'assurance santé', count: 156, trend: '+22%' },
    { query: 'ordinateur portable', count: 134, trend: '+5%' },
    { query: 'forfait internet', count: 98, trend: '+12%' },
  ];

  return (
    <div className="space-y-6">
      {/* Graphique des tendances principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Recherches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                formatter={(value, name) => [
                  value, 
                  name === 'searches' ? 'Recherches' : name === 'users' ? 'Utilisateurs' : 'Temps (ms)'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="searches" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requêtes populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Requêtes Tendances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularQueries.map((item, index) => (
                <div key={item.query} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.query}</p>
                      <p className="text-sm text-gray-600">{item.count} recherches</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Temps de réponse */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Temps Réel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">142ms</p>
                <p className="text-xs text-gray-600">Temps moyen</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">-8%</p>
                <p className="text-xs text-gray-600">Amélioration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
