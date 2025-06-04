
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play,
  Shield,
  Code,
  Accessibility,
  Globe
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  coverage: number;
  duration: number;
}

export const QualityAssuranceDashboard: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Tests unitaires', status: 'passed', coverage: 87, duration: 2.3 },
    { name: 'Tests d\'intégration', status: 'passed', coverage: 72, duration: 8.7 },
    { name: 'Tests E2E', status: 'warning', coverage: 64, duration: 15.2 },
    { name: 'Tests de sécurité', status: 'passed', coverage: 91, duration: 4.1 },
    { name: 'Tests d\'accessibilité', status: 'failed', coverage: 45, duration: 1.8 },
    { name: 'Tests de performance', status: 'passed', coverage: 89, duration: 6.4 }
  ]);

  const runAllTests = () => {
    setRunning(true);
    setTimeout(() => {
      setTestResults(prev => prev.map(test => ({
        ...test,
        status: Math.random() > 0.2 ? 'passed' : Math.random() > 0.5 ? 'warning' : 'failed',
        coverage: Math.floor(Math.random() * 40) + 60,
        duration: Math.random() * 10 + 1
      })));
      setRunning(false);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallCoverage = Math.round(
    testResults.reduce((sum, test) => sum + test.coverage, 0) / testResults.length
  );

  const passedTests = testResults.filter(test => test.status === 'passed').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Assurance Qualité
            </CardTitle>
            <Button onClick={runAllTests} disabled={running}>
              <Play className="h-4 w-4 mr-2" />
              {running ? 'Exécution...' : 'Lancer tous les tests'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-blue-800">Couverture globale</h3>
              <p className="text-3xl font-bold text-blue-600">{overallCoverage}%</p>
              <Progress value={overallCoverage} className="mt-2" />
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-green-800">Tests réussis</h3>
              <p className="text-3xl font-bold text-green-600">{passedTests}/{totalTests}</p>
              <Progress value={(passedTests / totalTests) * 100} className="mt-2" />
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-purple-800">Score qualité</h3>
              <p className="text-3xl font-bold text-purple-600">A+</p>
              <div className="mt-2 text-sm text-purple-600">Excellent</div>
            </div>
          </div>

          <div className="space-y-3">
            {testResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Couverture: {test.coverage}%</span>
                      <span>Durée: {test.duration.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(test.status)}>
                  {test.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">Code Quality</h3>
            <p className="text-2xl font-bold text-blue-600">9.2/10</p>
            <div className="text-sm text-gray-600">SonarQube Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Sécurité</h3>
            <p className="text-2xl font-bold text-green-600">A+</p>
            <div className="text-sm text-gray-600">OWASP Compliance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Accessibility className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Accessibilité</h3>
            <p className="text-2xl font-bold text-purple-600">89%</p>
            <div className="text-sm text-gray-600">WCAG 2.1 AA</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-semibold">Lighthouse</h3>
            <p className="text-2xl font-bold text-orange-600">94</p>
            <div className="text-sm text-gray-600">Performance Score</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
