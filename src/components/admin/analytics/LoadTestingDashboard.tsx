
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  Activity
} from 'lucide-react';

interface LoadTestScenario {
  id: string;
  name: string;
  description: string;
  virtualUsers: number;
  duration: number; // minutes
  rampUp: number; // seconds
  status: 'idle' | 'running' | 'completed' | 'failed';
  results?: {
    requests: number;
    failures: number;
    averageResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  };
}

interface LoadTestMetrics {
  currentUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  totalRequests: number;
  totalFailures: number;
}

export const LoadTestingDashboard: React.FC = () => {
  const [scenarios, setScenarios] = useState<LoadTestScenario[]>([
    {
      id: '1',
      name: 'Test de Charge Standard',
      description: 'Simulation de 1000 utilisateurs simultanés',
      virtualUsers: 1000,
      duration: 10,
      rampUp: 300,
      status: 'idle'
    },
    {
      id: '2',
      name: 'Test de Stress',
      description: 'Montée progressive jusqu\'à 5000 utilisateurs',
      virtualUsers: 5000,
      duration: 30,
      rampUp: 600,
      status: 'idle'
    },
    {
      id: '3',
      name: 'Test de Spike',
      description: 'Pic soudain de 10000 utilisateurs',
      virtualUsers: 10000,
      duration: 5,
      rampUp: 60,
      status: 'idle'
    }
  ]);

  const [currentMetrics, setCurrentMetrics] = useState<LoadTestMetrics>({
    currentUsers: 0,
    requestsPerSecond: 0,
    averageResponseTime: 0,
    errorRate: 0,
    totalRequests: 0,
    totalFailures: 0
  });

  const [activeTest, setActiveTest] = useState<string | null>(null);

  const startTest = async (scenarioId: string) => {
    setActiveTest(scenarioId);
    setScenarios(prev => 
      prev.map(s => 
        s.id === scenarioId ? { ...s, status: 'running' } : s
      )
    );

    // Simuler le test de charge
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    const testDuration = scenario.duration * 60 * 1000; // en millisecondes
    const rampUpDuration = scenario.rampUp * 1000;
    const startTime = Date.now();

    const updateMetrics = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / testDuration, 1);
      
      if (elapsed < rampUpDuration) {
        // Phase de montée en charge
        const userProgress = elapsed / rampUpDuration;
        setCurrentMetrics({
          currentUsers: Math.floor(scenario.virtualUsers * userProgress),
          requestsPerSecond: Math.floor(50 * userProgress + Math.random() * 20),
          averageResponseTime: 200 + Math.random() * 100,
          errorRate: Math.random() * 2,
          totalRequests: Math.floor(elapsed / 1000 * 30 * userProgress),
          totalFailures: Math.floor(Math.random() * 5)
        });
      } else if (elapsed < testDuration) {
        // Phase de test stable
        setCurrentMetrics({
          currentUsers: scenario.virtualUsers,
          requestsPerSecond: 70 + Math.random() * 30,
          averageResponseTime: 250 + Math.random() * 200,
          errorRate: 1 + Math.random() * 3,
          totalRequests: Math.floor((elapsed - rampUpDuration) / 1000 * 80),
          totalFailures: Math.floor(Math.random() * 10)
        });
      } else {
        // Test terminé
        clearInterval(interval);
        setActiveTest(null);
        setScenarios(prev => 
          prev.map(s => 
            s.id === scenarioId ? { 
              ...s, 
              status: 'completed',
              results: {
                requests: currentMetrics.totalRequests,
                failures: currentMetrics.totalFailures,
                averageResponseTime: currentMetrics.averageResponseTime,
                maxResponseTime: currentMetrics.averageResponseTime * 1.8,
                requestsPerSecond: currentMetrics.requestsPerSecond,
                errorRate: currentMetrics.errorRate
              }
            } : s
          )
        );
        setCurrentMetrics({
          currentUsers: 0,
          requestsPerSecond: 0,
          averageResponseTime: 0,
          errorRate: 0,
          totalRequests: 0,
          totalFailures: 0
        });
      }
    };

    const interval = setInterval(updateMetrics, 1000);
  };

  const stopTest = () => {
    if (activeTest) {
      setScenarios(prev => 
        prev.map(s => 
          s.id === activeTest ? { ...s, status: 'idle' } : s
        )
      );
      setActiveTest(null);
      setCurrentMetrics({
        currentUsers: 0,
        requestsPerSecond: 0,
        averageResponseTime: 0,
        errorRate: 0,
        totalRequests: 0,
        totalFailures: 0
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'completed': return <TrendingUp className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tests de Charge</h1>
          <p className="text-gray-600">Validation de la performance sous charge</p>
        </div>
        
        {activeTest && (
          <Button variant="destructive" onClick={stopTest}>
            <Square className="h-4 w-4 mr-2" />
            Arrêter le Test
          </Button>
        )}
      </div>

      {/* Métriques en temps réel */}
      {activeTest && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold">{currentMetrics.currentUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Req/sec</p>
                  <p className="text-2xl font-bold">{Math.round(currentMetrics.requestsPerSecond)}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps de Réponse</p>
                  <p className="text-2xl font-bold">{Math.round(currentMetrics.averageResponseTime)}ms</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux d'Erreur</p>
                  <p className={`text-2xl font-bold ${currentMetrics.errorRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {currentMetrics.errorRate.toFixed(1)}%
                  </p>
                </div>
                <AlertTriangle className={`h-8 w-8 ${currentMetrics.errorRate > 5 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alertes */}
      {activeTest && currentMetrics.errorRate > 5 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Alerte:</strong> Taux d'erreur élevé détecté ({currentMetrics.errorRate.toFixed(1)}%). 
            Vérifiez les performances du système.
          </AlertDescription>
        </Alert>
      )}

      {/* Scénarios de test */}
      <Card>
        <CardHeader>
          <CardTitle>Scénarios de Test de Charge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge className={getStatusColor(scenario.status)}>
                        {getStatusIcon(scenario.status)}
                        <span className="ml-1 capitalize">{scenario.status}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Utilisateurs:</span>
                        <div className="font-medium">{scenario.virtualUsers.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Durée:</span>
                        <div className="font-medium">{scenario.duration} min</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Montée:</span>
                        <div className="font-medium">{scenario.rampUp}s</div>
                      </div>
                    </div>

                    {scenario.results && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h5 className="font-medium mb-2">Résultats du dernier test</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Requêtes:</span>
                            <div className="font-medium">{scenario.results.requests.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Échecs:</span>
                            <div className="font-medium text-red-600">{scenario.results.failures}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Temps moyen:</span>
                            <div className="font-medium">{Math.round(scenario.results.averageResponseTime)}ms</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Req/sec:</span>
                            <div className="font-medium">{Math.round(scenario.results.requestsPerSecond)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {scenario.status === 'idle' && !activeTest && (
                      <Button onClick={() => startTest(scenario.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Lancer
                      </Button>
                    )}
                    
                    {scenario.status === 'running' && (
                      <Button variant="outline" disabled>
                        <Pause className="h-4 w-4 mr-2" />
                        En cours...
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations de performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Objectif: &lt; 500ms temps de réponse</h4>
                <p className="text-sm text-gray-600">Maintenir un temps de réponse inférieur à 500ms pour 95% des requêtes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Objectif: &lt; 2% taux d'erreur</h4>
                <p className="text-sm text-gray-600">Le taux d'erreur ne doit pas dépasser 2% sous charge normale</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Capacité: 10,000 utilisateurs simultanés</h4>
                <p className="text-sm text-gray-600">Le système doit supporter 10,000 utilisateurs simultanés sans dégradation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
