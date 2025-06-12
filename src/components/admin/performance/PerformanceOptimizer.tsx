
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Database, 
  Globe, 
  Settings, 
  TrendingUp, 
  Clock,
  Cpu,
  HardDrive,
  Network,
  Gauge
} from 'lucide-react';

interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  dbConnectionsActive: number;
  dbConnectionsIdle: number;
}

interface OptimizationSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  implemented: boolean;
}

export const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 245,
    throughput: 1250,
    errorRate: 0.15,
    cpuUsage: 35,
    memoryUsage: 68,
    diskUsage: 42,
    networkLatency: 12,
    cacheHitRate: 87,
    dbConnectionsActive: 25,
    dbConnectionsIdle: 15
  });

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: '1',
      category: 'Cache',
      title: 'Améliorer le taux de cache',
      description: 'Implémenter un cache Redis multi-niveaux pour les requêtes fréquentes',
      impact: 'high',
      effort: 'medium',
      implemented: false
    },
    {
      id: '2',
      category: 'Database',
      title: 'Optimiser les requêtes SQL',
      description: 'Ajouter des index pour les jointures fréquentes sur les tables principales',
      impact: 'high',
      effort: 'low',
      implemented: false
    },
    {
      id: '3',
      category: 'Frontend',
      title: 'Lazy loading des composants',
      description: 'Implémenter le chargement paresseux pour les composants lourds',
      impact: 'medium',
      effort: 'low',
      implemented: true
    },
    {
      id: '4',
      category: 'API',
      title: 'Compression gzip',
      description: 'Activer la compression gzip pour réduire la taille des réponses',
      impact: 'medium',
      effort: 'low',
      implemented: false
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simuler la mise à jour des métriques en temps réel
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 20),
        throughput: Math.max(800, prev.throughput + (Math.random() - 0.5) * 100),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.1)),
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(20, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        cacheHitRate: Math.max(70, Math.min(99, prev.cacheHitRate + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const implementSuggestion = async (suggestionId: string) => {
    setLoading(true);
    
    // Simuler l'implémentation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId ? { ...s, implemented: true } : s
      )
    );
    
    setLoading(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Optimiseur de Performance</h1>
          <p className="text-gray-600">Surveillance et optimisation temps réel</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <Settings className="h-4 w-4 mr-2" />
          Actualiser les métriques
        </Button>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Métriques Temps Réel</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions d'Optimisation</TabsTrigger>
          <TabsTrigger value="database">Base de Données</TabsTrigger>
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {/* Métriques système */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Temps de Réponse</p>
                    <p className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.responseTime, { good: 200, warning: 500 }))}`}>
                      {Math.round(metrics.responseTime)}ms
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Débit</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(metrics.throughput)}
                    </p>
                    <p className="text-xs text-gray-500">req/min</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taux d'Erreur</p>
                    <p className={`text-2xl font-bold ${getStatusColor(getMetricStatus(metrics.errorRate, { good: 1, warning: 3 }))}`}>
                      {metrics.errorRate.toFixed(2)}%
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(metrics.cacheHitRate)}%
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ressources système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Utilisation des Ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">CPU</span>
                    <span className="text-sm">{Math.round(metrics.cpuUsage)}%</span>
                  </div>
                  <Progress value={metrics.cpuUsage} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Mémoire</span>
                    <span className="text-sm">{Math.round(metrics.memoryUsage)}%</span>
                  </div>
                  <Progress value={metrics.memoryUsage} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Disque</span>
                    <span className="text-sm">{Math.round(metrics.diskUsage)}%</span>
                  </div>
                  <Progress value={metrics.diskUsage} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions d'Optimisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge variant="outline">{suggestion.category}</Badge>
                          <Badge className={getImpactColor(suggestion.impact)}>
                            Impact: {suggestion.impact}
                          </Badge>
                          <Badge className={getEffortColor(suggestion.effort)}>
                            Effort: {suggestion.effort}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                      
                      <div className="ml-4">
                        {suggestion.implemented ? (
                          <Badge variant="secondary">
                            Implémenté
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => implementSuggestion(suggestion.id)}
                            disabled={loading}
                          >
                            {loading ? 'En cours...' : 'Implémenter'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Performance Base de Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Connexions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Actives</span>
                      <span className="font-medium">{metrics.dbConnectionsActive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">En attente</span>
                      <span className="font-medium">{metrics.dbConnectionsIdle}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Requêtes les plus lentes</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>SELECT products...</span>
                      <span className="text-red-600">450ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>JOIN user_preferences...</span>
                      <span className="text-yellow-600">280ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UPDATE metrics...</span>
                      <span className="text-green-600">120ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frontend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Performance Frontend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Core Web Vitals</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">LCP (Largest Contentful Paint)</span>
                        <span className="text-sm text-green-600">1.2s</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">FID (First Input Delay)</span>
                        <span className="text-sm text-green-600">45ms</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CLS (Cumulative Layout Shift)</span>
                        <span className="text-sm text-yellow-600">0.15</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Tailles des bundles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Vendor.js</span>
                      <span>245 KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Main.js</span>
                      <span>156 KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chunks.js</span>
                      <span>89 KB</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>490 KB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
