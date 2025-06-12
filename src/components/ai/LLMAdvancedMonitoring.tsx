
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLLMProactiveAlerts } from '@/hooks/useLLMProactiveAlerts';
import { useLLMCache } from '@/hooks/useLLMCache';
import { useLLMAnalytics } from '@/hooks/useMultiLLM';
import { AlertTriangle, Shield, Zap, TrendingUp, Database, Clock, DollarSign } from 'lucide-react';

export const LLMAdvancedMonitoring: React.FC = () => {
  const { activeAlerts, applyAutoMitigation, analyzePerformanceTrends } = useLLMProactiveAlerts();
  const { getCacheStats } = useLLMCache();
  const { data: analytics } = useLLMAnalytics('24h');

  const cacheStats = getCacheStats();
  const performanceTrends = analyzePerformanceTrends();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Alerts */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertes Proactives ({activeAlerts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts && activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {alert.provider}
                        </Badge>
                        {alert.auto_mitigation_applied && (
                          <Badge variant="secondary" className="text-xs">
                            Auto-corrigé
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mb-3">{alert.message}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Valeur actuelle:</span> {alert.metrics.current_value}
                        </div>
                        <div>
                          <span className="font-medium">Seuil:</span> {alert.metrics.threshold_value}
                        </div>
                        <div>
                          <span className="font-medium">Tendance:</span> {alert.metrics.trend_direction}
                        </div>
                        <div>
                          <span className="font-medium">Confiance:</span> {Math.round(alert.metrics.confidence_score * 100)}%
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-medium mb-1">Actions recommandées:</p>
                        <ul className="text-xs space-y-1">
                          {alert.recommended_actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {!alert.auto_mitigation_applied && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyAutoMitigation.mutate({ 
                          alertId: alert.id, 
                          mitigationType: 'switch_to_cheap_provider' 
                        })}
                        disabled={applyAutoMitigation.isPending}
                      >
                        Corriger
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>Aucune alerte active. Tous les systèmes fonctionnent normalement.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tendances Coûts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Direction</span>
                <Badge variant={performanceTrends.cost_trend.direction === 'stable' ? 'secondary' : 'destructive'}>
                  {performanceTrends.cost_trend.direction}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Confiance</span>
                <span className="text-sm font-medium">
                  {Math.round(performanceTrends.cost_trend.prediction_confidence * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Prévision 1h</span>
                <span className="text-sm font-medium">
                  ${performanceTrends.cost_trend.next_hour_estimate.toFixed(4)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tendances Latence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Direction</span>
                <Badge variant={performanceTrends.latency_trend.direction === 'up' ? 'destructive' : 'secondary'}>
                  {performanceTrends.latency_trend.direction}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Confiance</span>
                <span className="text-sm font-medium">
                  {Math.round(performanceTrends.latency_trend.prediction_confidence * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Risque dégradation</span>
                <Badge variant={performanceTrends.latency_trend.degradation_risk === 'medium' ? 'destructive' : 'secondary'}>
                  {performanceTrends.latency_trend.degradation_risk}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Cache Intelligent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Entrées cache</span>
                <span className="text-sm font-medium">{cacheStats.totalEntries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hits totaux</span>
                <span className="text-sm font-medium">{cacheStats.totalHits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Économies</span>
                <span className="text-sm font-medium text-green-600">
                  ${cacheStats.totalSavings.toFixed(4)}
                </span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Efficacité cache</span>
                  <span className="text-xs">
                    {cacheStats.totalEntries > 0 ? Math.round((cacheStats.totalHits / cacheStats.totalEntries) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={cacheStats.totalEntries > 0 ? (cacheStats.totalHits / cacheStats.totalEntries) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Santé des Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(performanceTrends.provider_health).map(([provider, health]: [string, any]) => (
              <div key={provider} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium capitalize">{provider}</h4>
                  <Badge 
                    variant={health.status === 'excellent' ? 'secondary' : health.status === 'healthy' ? 'outline' : 'destructive'}
                  >
                    {health.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score de risque</span>
                    <span className="font-medium">{Math.round(health.risk_score * 100)}%</span>
                  </div>
                  <Progress 
                    value={100 - (health.risk_score * 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-600 mt-2">
                    {health.risk_score < 0.1 && "Excellent état de santé"}
                    {health.risk_score >= 0.1 && health.risk_score < 0.2 && "Bon état de santé"}
                    {health.risk_score >= 0.2 && "Surveillance recommandée"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Performance Metrics */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Métriques de Performance (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.totalRequests}
                </div>
                <div className="text-sm text-gray-600">Requêtes totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${analytics.totalCost.toFixed(4)}
                </div>
                <div className="text-sm text-gray-600">Coût total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.averageLatency}ms
                </div>
                <div className="text-sm text-gray-600">Latence moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(analytics.costSavings * 100)}%
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
