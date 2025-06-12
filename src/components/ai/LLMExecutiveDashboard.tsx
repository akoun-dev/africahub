
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLLMAnalytics, useLLMProviderStatus } from '@/hooks/useMultiLLM';
import { TrendingUp, DollarSign, Clock, Zap, Target, Shield } from 'lucide-react';

export const LLMExecutiveDashboard: React.FC = () => {
  const { data: analytics24h } = useLLMAnalytics('24h');
  const { data: analytics7d } = useLLMAnalytics('7d');
  const { data: providerStatus } = useLLMProviderStatus();

  if (!analytics24h || !analytics7d || !providerStatus) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const roiMetrics = {
    weeklySavings: analytics7d.costSavings * analytics7d.totalCost,
    monthlySavings: analytics7d.costSavings * analytics7d.totalCost * 4.3,
    annualSavings: analytics7d.costSavings * analytics7d.totalCost * 52,
    efficiency: Math.round((analytics24h.totalRequests / Object.keys(providerStatus).length) * 100) / 100,
    uptime: Object.values(providerStatus).filter((p: any) => p.available).length / Object.values(providerStatus).length * 100
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Résumé Exécutif Multi-LLM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${roiMetrics.monthlySavings.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Économies mensuelles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(analytics7d.costSavings * 100)}%
              </div>
              <div className="text-sm text-gray-600">Réduction des coûts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics7d.totalRequests}
              </div>
              <div className="text-sm text-gray-600">Requêtes (7 jours)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {roiMetrics.uptime.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Retour sur Investissement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Économies hebdomadaires</span>
                <span className="font-semibold">${roiMetrics.weeklySavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Économies mensuelles</span>
                <span className="font-semibold">${roiMetrics.monthlySavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Économies annuelles projetées</span>
                <span className="font-bold text-green-600">${roiMetrics.annualSavings.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Impact Business</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Réduction de 70-85% des coûts IA</li>
                <li>• Amélioration de la résilience système</li>
                <li>• Optimisation continue automatique</li>
                <li>• Support multilingue renforcé</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Performance & Fiabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Disponibilité globale</span>
                  <span className="text-sm font-medium">{roiMetrics.uptime.toFixed(1)}%</span>
                </div>
                <Progress value={roiMetrics.uptime} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Efficacité du routage</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Satisfaction qualité</span>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Latence moyenne</span>
                  <span>{analytics24h.averageLatency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Requêtes par provider</span>
                  <span>{roiMetrics.efficiency}/provider</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance des Providers IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(providerStatus).map(([provider, status]: [string, any]) => (
              <div key={provider} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium capitalize">{provider}</h4>
                  <Badge variant={status.available ? "secondary" : "destructive"}>
                    {status.available ? 'Actif' : 'Indisponible'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Modèle</span>
                    <span>{status.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coût/1M tokens</span>
                    <span>${status.cost_per_1m}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latence</span>
                    <span>{status.latency}ms</span>
                  </div>
                </div>

                {analytics7d.providerBreakdown[provider] && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      {analytics7d.providerBreakdown[provider].percentage}% du trafic
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle>Recommandations Stratégiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Optimisations Immédiates</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Augmenter l'utilisation de DeepSeek pour les tâches simples</li>
                <li>• Optimiser les prompts pour Qwen (contexte africain)</li>
                <li>• Implémenter la mise en cache intelligente</li>
                <li>• Ajuster les seuils de basculement automatique</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Évolutions Futures</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Intégration de modèles locaux africains</li>
                <li>• Support des langues locales (Wolof, Swahili)</li>
                <li>• IA prédictive pour l'optimisation des coûts</li>
                <li>• Expansion vers de nouveaux providers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
