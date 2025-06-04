
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Server, 
  Zap,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';

export const SystemHealthDashboard: React.FC = () => {
  const { healthData, isLoading: healthLoading } = useSystemHealth();
  const { metrics, isConnected } = useRealTimeMetrics();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatUptime = (uptime: number) => {
    if (uptime >= 99.9) return '99.9%+';
    return `${uptime.toFixed(2)}%`;
  };

  if (healthLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Système</h1>
          <p className="text-gray-600">Observabilité temps réel de la plateforme</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Temps réel' : 'Déconnecté'}
            </span>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut Global</p>
                <p className={`text-2xl font-bold ${
                  healthData?.overallStatus === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {healthData?.overallStatus === 'healthy' ? 'Sain' : 'Dégradé'}
                </p>
              </div>
              <CheckCircle className={`h-8 w-8 ${
                healthData?.overallStatus === 'healthy' ? 'text-green-500' : 'text-red-500'
              }`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibilité</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatUptime(healthData?.uptime || 99.9)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={healthData?.uptime || 99.9} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Latence Moyenne</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics?.averageLatency || 245}ms
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics?.activeUsers || 1247}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs détaillées */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métriques temps réel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Métriques Temps Réel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comparaisons/min</span>
                  <span className="font-bold">{metrics?.comparisonsPerMinute || 23}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Requêtes devis</span>
                  <span className="font-bold">{metrics?.quoteRequests || 156}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion</span>
                  <span className="font-bold text-green-600">{metrics?.conversionRate || 8.4}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue/heure</span>
                  <span className="font-bold text-blue-600">$</span>
                </div>
              </CardContent>
            </Card>

            {/* Statut des services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Statut Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {healthData?.services?.map((service: any) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                )) || [
                  { name: 'API Gateway', status: 'healthy' },
                  { name: 'Base de données', status: 'healthy' },
                  { name: 'Cache Redis', status: 'healthy' },
                  { name: 'Moteur IA', status: 'warning' }
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Product Catalog', status: 'healthy', uptime: 99.98, latency: 120 },
              { name: 'Comparison Engine', status: 'healthy', uptime: 99.95, latency: 340 },
              { name: 'AI Recommendations', status: 'warning', uptime: 99.2, latency: 1200 },
              { name: 'User Management', status: 'healthy', uptime: 99.99, latency: 80 },
              { name: 'Analytics', status: 'healthy', uptime: 99.8, latency: 200 },
              { name: 'Notifications', status: 'healthy', uptime: 99.95, latency: 150 }
            ].map((service) => (
              <Card key={service.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{service.name}</h3>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disponibilité</span>
                      <span className="font-medium">{service.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latence</span>
                      <span className="font-medium">{service.latency}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Performance par Région</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { region: 'Afrique de l\'Ouest', latency: 145, users: 423, status: 'healthy' },
                  { region: 'Afrique de l\'Est', latency: 189, users: 312, status: 'healthy' },
                  { region: 'Afrique du Nord', latency: 167, users: 298, status: 'healthy' },
                  { region: 'Afrique Centrale', latency: 234, users: 156, status: 'warning' },
                  { region: 'Afrique Australe', latency: 198, users: 267, status: 'healthy' }
                ].map((region) => (
                  <div key={region.region} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{region.region}</span>
                      <Badge className={getStatusColor(region.status)}>
                        {region.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Latence: </span>
                        <span className="font-medium">{region.latency}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Utilisateurs: </span>
                        <span className="font-medium">{region.users}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disponibilité par Pays</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { country: 'Sénégal', uptime: 99.9, flag: '🇸🇳' },
                  { country: 'Cameroun', uptime: 99.8, flag: '🇨🇲' },
                  { country: 'Nigeria', uptime: 99.7, flag: '🇳🇬' },
                  { country: 'Kenya', uptime: 99.6, flag: '🇰🇪' },
                  { country: 'Ghana', uptime: 99.9, flag: '🇬🇭' }
                ].map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={country.uptime} className="w-20" />
                      <span className="text-sm font-medium w-12">{country.uptime}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Vitesse</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Page d'accueil</span>
                  <span className="font-bold text-green-600">1.2s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Comparaison</span>
                  <span className="font-bold text-blue-600">2.1s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Devis</span>
                  <span className="font-bold text-orange-600">3.4s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Base de données</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Connexions actives</span>
                  <span className="font-bold">47/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Queries/sec</span>
                  <span className="font-bold">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cache hit ratio</span>
                  <span className="font-bold text-green-600">94.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Coûts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Infrastructure/jour</span>
                  <span className="font-bold">$12.34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">IA/1000 req</span>
                  <span className="font-bold">$0.45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total mensuel</span>
                  <span className="font-bold text-blue-600">$892</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: 'warning',
                title: 'Latence élevée - Moteur IA',
                description: 'Le service IA affiche une latence de 1.2s (seuil: 800ms)',
                time: '2 min ago',
                resolved: false
              },
              {
                id: 2,
                type: 'info',
                title: 'Pic de trafic détecté',
                description: 'Augmentation de 300% du trafic au Sénégal',
                time: '15 min ago',
                resolved: true
              },
              {
                id: 3,
                type: 'error',
                title: 'Erreur base de données',
                description: 'Connexion temporairement interrompue (récupérée automatiquement)',
                time: '1h ago',
                resolved: true
              }
            ].map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${
                alert.type === 'error' ? 'border-l-red-500' :
                alert.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.type === 'error' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                      </div>
                    </div>
                    <Badge variant={alert.resolved ? "secondary" : "destructive"}>
                      {alert.resolved ? 'Résolu' : 'Actif'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
