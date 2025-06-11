
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, X, PlayCircle, Clock } from 'lucide-react';

export const QualityAssurance: React.FC = () => {
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const testSuites = [
    {
      id: 'auth-tests',
      name: 'Tests d\'authentification',
      description: 'Vérification des processus de connexion/déconnexion',
      status: 'passed',
      lastRun: '2024-01-20 14:30',
      duration: '2m 15s',
      tests: { passed: 12, failed: 0, total: 12 }
    },
    {
      id: 'api-tests',
      name: 'Tests API',
      description: 'Vérification des endpoints et intégrations',
      status: 'passed',
      lastRun: '2024-01-20 14:25',
      duration: '5m 42s',
      tests: { passed: 28, failed: 0, total: 28 }
    },
    {
      id: 'payment-tests',
      name: 'Tests de paiement',
      description: 'Tests des intégrations Mobile Money',
      status: 'failed',
      lastRun: '2024-01-20 12:00',
      duration: '3m 18s',
      tests: { passed: 8, failed: 2, total: 10 }
    },
    {
      id: 'ui-tests',
      name: 'Tests d\'interface',
      description: 'Tests automatisés de l\'interface utilisateur',
      status: 'running',
      lastRun: '2024-01-20 15:00',
      duration: 'En cours...',
      tests: { passed: 15, failed: 0, total: 24 }
    }
  ];

  const runTestSuite = async (testId: string) => {
    setRunningTest(testId);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunningTest(null);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Réussi</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      case 'running':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">En cours</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const overallStats = testSuites.reduce(
    (acc, suite) => ({
      passed: acc.passed + suite.tests.passed,
      failed: acc.failed + suite.tests.failed,
      total: acc.total + suite.tests.total
    }),
    { passed: 0, failed: 0, total: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests totaux</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réussis</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échecs</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {overallStats.total > 0 ? Math.round((overallStats.passed / overallStats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Suites de tests</CardTitle>
            <Button onClick={() => runTestSuite('all')}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Lancer tous les tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testSuites.map((suite) => (
              <Card key={suite.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(suite.status)}
                      <div>
                        <h3 className="font-medium">{suite.name}</h3>
                        <p className="text-sm text-gray-600">{suite.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(suite.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => runTestSuite(suite.id)}
                        disabled={runningTest === suite.id}
                      >
                        {runningTest === suite.id ? 'En cours...' : 'Lancer'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Dernière exécution:</span>
                      <p className="font-medium">{suite.lastRun}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Durée:</span>
                      <p className="font-medium">{suite.duration}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Réussis:</span>
                      <p className="font-medium text-green-600">{suite.tests.passed}/{suite.tests.total}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Échecs:</span>
                      <p className="font-medium text-red-600">{suite.tests.failed}</p>
                    </div>
                  </div>
                  
                  {runningTest === suite.id && (
                    <div className="mt-3">
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Progression: {progress}%</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Assurance Qualité
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Tests automatisés pour garantir la qualité du code</p>
              <p>• Vérification continue des fonctionnalités critiques</p>
              <p>• Monitoring des performances et de la sécurité</p>
              <p>• Rapports détaillés pour le débogage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
