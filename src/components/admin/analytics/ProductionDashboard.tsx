
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProductionMonitoring } from '@/hooks/useProductionMonitoring';
import { useAdvancedLLMCache } from '@/hooks/useAdvancedLLMCache';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { 
  Server, 
  Zap, 
  Shield, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Database,
  Globe,
  TrendingUp
} from 'lucide-react';

export const ProductionDashboard: React.FC = () => {
  const { systemHealth, alerts, resolvedAlerts, resolveAlert, SLA_THRESHOLDS } = useProductionMonitoring();
  const { strategy, stats, optimizeCacheStrategy } = useAdvancedLLMCache();
  const { data: analytics } = useLLMAnalytics('24h');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status Système</p>
                <p className={`text-lg font-bold capitalize ${getStatusColor(systemHealth.status)}`}>
                  {systemHealth.status}
                </p>
              </div>
              <Server className={`h-8 w-8 ${getStatusColor(systemHealth.status)}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uptime SLA</p>
                <p className="text-lg font-bold">{systemHealth.uptime.toFixed(2)}%</p>
                <Progress 
                  value={systemHealth.uptime} 
                  className="mt-2 h-2"
                />
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Latence Moyenne</p>
                <p className="text-lg font-bold">{systemHealth.latency}ms</p>
                <div className="text-xs text-gray-500">
                  SLA: &lt;{SLA_THRESHOLDS.latency}ms
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'Erreur</p>
                <p className="text-lg font-bold">{systemHealth.errorRate.toFixed(1)}%</p>
                <div className="text-xs text-gray-500">
                  SLA: &lt;{SLA_THRESHOLDS.errorRate}%
                </div>
              </div>
              <AlertTriangle className={`h-8 w-8 ${systemHealth.errorRate > SLA_THRESHOLDS.errorRate ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertes Actives ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p>Aucune alerte active - Système opérationnel</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={getSeverityVariant(alert.severity)} className="capitalize">
                      {alert.severity}
                    </Badge>
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Type: {alert.type}</span>
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                        {alert.autoMitigation && (
                          <span className="text-blue-600">Auto-résolu: {alert.autoMitigation}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Résoudre
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Performance Cache LLM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Stratégie Cache:</span>
                <Badge variant="outline" className="capitalize">{strategy.mode}</Badge>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de Hit</span>
                  <span>{(stats.hitRate * 100).toFixed(1)}%</span>
                </div>
                <Progress value={stats.hitRate * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Entrées:</span>
                  <div className="font-medium">{stats.totalEntries}</div>
                </div>
                <div>
                  <span className="text-gray-600">Économies:</span>
                  <div className="font-medium text-green-600">${stats.totalSavings.toFixed(4)}</div>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={optimizeCacheStrategy}
                className="w-full"
              >
                Optimiser Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Performance Régionale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: 'Afrique de l\'Ouest', health: 95, latency: 850 },
                { region: 'Afrique de l\'Est', health: 92, latency: 920 },
                { region: 'Afrique du Nord', health: 98, latency: 680 },
                { region: 'Afrique Australe', health: 89, latency: 1100 }
              ].map((region) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{region.region}</div>
                    <div className="text-xs text-gray-500">{region.latency}ms latence</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${region.health > 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {region.health}%
                    </div>
                    <Progress value={region.health} className="w-16 h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost and ROI Monitoring */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monitoring Coûts et ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${analytics.totalCost.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600">Coût 24h</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.costSavings.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Économies IA</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.totalRequests}
                </p>
                <p className="text-sm text-gray-600">Requêtes</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  ${(analytics.totalCost * 30).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Projection mensuelle</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Resolved Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Alertes Résolues Récentes ({resolvedAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resolvedAlerts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune alerte résolue récemment</p>
          ) : (
            <div className="space-y-2">
              {resolvedAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
