
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calculator, Clock, Users, DollarSign, Target, RefreshCw } from 'lucide-react';

interface PricingMetric {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  calculation_count: number;
  avg_price: number;
  success_rate: number;
  avg_response_time: number;
  conversion_rate: number;
  created_at: string;
}

const mockMetrics: PricingMetric[] = [
  {
    id: '1',
    product_id: 'prod-1',
    product_name: 'Assurance Auto Premium',
    category: 'auto',
    calculation_count: 245,
    avg_price: 180000,
    success_rate: 0.95,
    avg_response_time: 1200,
    conversion_rate: 0.12,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    product_id: 'prod-2',
    product_name: 'Assurance Santé Famille',
    category: 'health',
    calculation_count: 189,
    avg_price: 350000,
    success_rate: 0.92,
    avg_response_time: 1800,
    conversion_rate: 0.18,
    created_at: '2024-01-15'
  },
  {
    id: '3',
    product_id: 'prod-3',
    product_name: 'Assurance Habitation',
    category: 'home',
    calculation_count: 156,
    avg_price: 120000,
    success_rate: 0.88,
    avg_response_time: 950,
    conversion_rate: 0.15,
    created_at: '2024-01-15'
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const PricingAnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredMetrics = useMemo(() => {
    return selectedCategory === 'all' 
      ? mockMetrics 
      : mockMetrics.filter(m => m.category === selectedCategory);
  }, [selectedCategory]);

  const aggregateStats = useMemo(() => {
    const totalCalculations = filteredMetrics.reduce((sum, m) => sum + m.calculation_count, 0);
    const avgSuccessRate = filteredMetrics.reduce((sum, m) => sum + m.success_rate, 0) / filteredMetrics.length;
    const avgResponseTime = filteredMetrics.reduce((sum, m) => sum + m.avg_response_time, 0) / filteredMetrics.length;
    const avgConversionRate = filteredMetrics.reduce((sum, m) => sum + m.conversion_rate, 0) / filteredMetrics.length;

    return {
      totalCalculations,
      avgSuccessRate,
      avgResponseTime,
      avgConversionRate
    };
  }, [filteredMetrics]);

  const chartData = filteredMetrics.map(metric => ({
    name: metric.product_name.substring(0, 15) + '...',
    calculations: metric.calculation_count,
    conversion: metric.conversion_rate * 100,
    avgPrice: metric.avg_price / 1000, // En milliers
    responseTime: metric.avg_response_time
  }));

  const categoryData = mockMetrics.reduce((acc, metric) => {
    const existing = acc.find(item => item.name === metric.category);
    if (existing) {
      existing.value += metric.calculation_count;
    } else {
      acc.push({
        name: metric.category,
        value: metric.calculation_count
      });
    }
    return acc;
  }, [] as Array<{name: string, value: number}>);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simuler le rechargement des données
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brandBlue" />
              Analytics du Pricing Dynamique
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Aujourd'hui</SelectItem>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">90 jours</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="health">Santé</SelectItem>
                  <SelectItem value="home">Habitation</SelectItem>
                  <SelectItem value="travel">Voyage</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Calculs totaux</p>
                <p className="text-2xl font-bold">{aggregateStats.totalCalculations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Taux de succès</p>
                <p className="text-2xl font-bold">{(aggregateStats.avgSuccessRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold">{aggregateStats.avgResponseTime.toFixed(0)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Taux conversion</p>
                <p className="text-2xl font-bold">{(aggregateStats.avgConversionRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculs par produit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demandes de calcul par produit</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calculations" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Taux de conversion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taux de conversion par produit</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="conversion" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temps de réponse */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temps de réponse moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `${value}ms`} />
                <Bar dataKey="responseTime" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détails par produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Produit</th>
                  <th className="text-left p-2">Catégorie</th>
                  <th className="text-right p-2">Calculs</th>
                  <th className="text-right p-2">Prix moyen</th>
                  <th className="text-right p-2">Succès</th>
                  <th className="text-right p-2">Conversion</th>
                  <th className="text-right p-2">Temps (ms)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetrics.map((metric) => (
                  <tr key={metric.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{metric.product_name}</td>
                    <td className="p-2">
                      <Badge variant="outline">{metric.category}</Badge>
                    </td>
                    <td className="p-2 text-right">{metric.calculation_count}</td>
                    <td className="p-2 text-right">{metric.avg_price.toLocaleString()} XOF</td>
                    <td className="p-2 text-right">
                      <Badge variant={metric.success_rate > 0.9 ? "default" : "secondary"}>
                        {(metric.success_rate * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="p-2 text-right">
                      <Badge variant={metric.conversion_rate > 0.15 ? "default" : "outline"}>
                        {(metric.conversion_rate * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="p-2 text-right">{metric.avg_response_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
