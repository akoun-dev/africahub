
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Search, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  searchesPerMinute: number;
  memoryUsage: number;
  cpuUsage: number;
}

export const MonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.8,
    responseTime: 145,
    errorRate: 0.2,
    activeUsers: 1247,
    searchesPerMinute: 34,
    memoryUsage: 67,
    cpuUsage: 23
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Pic de trafic détecté (+45%)', time: '2 min' },
    { id: 2, type: 'info', message: 'Déploiement réussi v2.1.3', time: '15 min' },
    { id: 3, type: 'success', message: 'Cache optimisé (+12% performance)', time: '1h' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50) + 120,
        activeUsers: Math.floor(Math.random() * 200) + 1200,
        searchesPerMinute: Math.floor(Math.random() * 20) + 25,
        memoryUsage: Math.floor(Math.random() * 20) + 60,
        cpuUsage: Math.floor(Math.random() * 30) + 15
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (value: number, threshold: number, inverted = false) => {
    const isGood = inverted ? value < threshold : value > threshold;
    return isGood ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-2xl font-bold">{metrics.uptime}%</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.uptime, 99)}
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <Progress value={metrics.uptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps de réponse</p>
                <p className="text-2xl font-bold">{metrics.responseTime}ms</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(metrics.responseTime, 200, true)}
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <Progress value={Math.min((metrics.responseTime / 500) * 100, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600">+12% vs hier</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recherches/min</p>
                <p className="text-2xl font-bold">{metrics.searchesPerMinute}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <Search className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-600">Pic à 14h</div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques système */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Ressources Système
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Mémoire</span>
                <span className="text-sm font-medium">{metrics.memoryUsage}%</span>
              </div>
              <Progress value={metrics.memoryUsage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">CPU</span>
                <span className="text-sm font-medium">{metrics.cpuUsage}%</span>
              </div>
              <Progress value={metrics.cpuUsage} />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Taux d'erreur</span>
                <span className="text-sm font-medium">{metrics.errorRate}%</span>
              </div>
              <Progress value={metrics.errorRate} className="bg-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">Il y a {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Géographie et trafic */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition géographique du trafic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { country: 'Sénégal', users: 456, percentage: 37 },
              { country: 'Côte d\'Ivoire', users: 342, percentage: 28 },
              { country: 'Mali', users: 189, percentage: 15 },
              { country: 'Burkina Faso', users: 156, percentage: 13 },
              { country: 'Autres', users: 104, percentage: 7 }
            ].map((item) => (
              <div key={item.country} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.country}</p>
                  <p className="text-sm text-gray-600">{item.users} utilisateurs</p>
                </div>
                <Badge variant="secondary">{item.percentage}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
