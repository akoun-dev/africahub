
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLLMProviderStatus, useLLMAnalytics } from '@/hooks/useMultiLLM';
import { Zap, DollarSign, Clock, TrendingUp } from 'lucide-react';

export const LLMMetricsWidget: React.FC = () => {
  const { data: providerStatus } = useLLMProviderStatus();
  const { data: analytics } = useLLMAnalytics('24h');

  if (!analytics || !providerStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Métriques IA Multi-LLM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Métriques IA Multi-LLM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Requêtes totales</p>
                <p className="text-xl font-semibold">{analytics.totalRequests}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Coût total</p>
                <p className="text-xl font-semibold">${analytics.totalCost.toFixed(4)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Latence moy.</p>
                <p className="text-xl font-semibold">{analytics.averageLatency}ms</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Économies réalisées</p>
            <div className="flex items-center gap-2">
              <Progress value={analytics.costSavings * 100} className="flex-1" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {Math.round(analytics.costSavings * 100)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Providers IA Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(providerStatus).map(([provider, status]: [string, any]) => (
              <div key={provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${status.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium capitalize">{provider}</p>
                    <p className="text-sm text-gray-600">{status.model}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${status.cost_per_1m}/1M tokens</p>
                  <p className="text-xs text-gray-600">{status.latency}ms</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {analytics.providerBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Requêtes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.providerBreakdown).map(([provider, data]: [string, any]) => (
                <div key={provider} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{provider}</span>
                    <span>{data.percentage}% ({data.requests} requêtes)</span>
                  </div>
                  <Progress value={data.percentage} className="h-2" />
                  <p className="text-xs text-gray-600">${data.cost.toFixed(4)} total</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
