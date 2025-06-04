
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield, 
  Globe, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { metrics, isConnected } = useRealTimeMetrics();
  const { healthData } = useSystemHealth();
  const { data: llmAnalytics } = useLLMAnalytics('24h');

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec statut général */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Exécutif</h1>
          <p className="text-gray-600">Vue d'ensemble temps réel de la plateforme</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
          
          {healthData && (
            <Badge className={getHealthStatusColor(healthData.overallStatus)}>
              Système {healthData.overallStatus}
            </Badge>
          )}
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% vs hier
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comparaisons/min</p>
                <p className="text-2xl font-bold">{metrics.comparisonsPerMinute}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Temps réel
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
                <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
                <div className="text-sm text-gray-600">
                  Objectif: 10%
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus (24h)</p>
                <p className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8% vs hier
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Système */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm">{healthData?.uptime.toFixed(2)}%</span>
                </div>
                <Progress value={healthData?.uptime || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Latence Moyenne</span>
                  <span className="text-sm">{metrics.averageLatency}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - (metrics.averageLatency / 10))} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Taux d'Erreur</span>
                  <span className="text-sm">{metrics.errorRate.toFixed(2)}%</span>
                </div>
                <Progress value={Math.max(0, 100 - (metrics.errorRate * 20))} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Distribution Géographique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{country.users}</div>
                    <div className="text-xs text-gray-500">utilisateurs</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secteurs Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Performance par Secteur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.topSectors.map((sector) => (
              <div key={sector.sector} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{sector.sector}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {sector.requests}
                </div>
                <div className="text-sm text-gray-600">demandes aujourd'hui</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métriques IA */}
      {llmAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Métriques IA et Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {llmAnalytics.totalRequests}
                </div>
                <div className="text-sm text-gray-600">Requêtes IA</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${llmAnalytics.totalCost.toFixed(4)}
                </div>
                <div className="text-sm text-gray-600">Coût IA</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {llmAnalytics.averageLatency}ms
                </div>
                <div className="text-sm text-gray-600">Latence IA</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(llmAnalytics.costSavings * 100)}%
                </div>
                <div className="text-sm text-gray-600">Économies</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
