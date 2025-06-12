
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  Globe,
  Shield,
  Settings,
  GitBranch,
  Server,
  Monitor
} from 'lucide-react';

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
  logs?: string[];
}

interface Environment {
  name: string;
  url: string;
  status: 'healthy' | 'warning' | 'error';
  version: string;
  lastDeployment: string;
  uptime: number;
}

export const ProductionDeployment: React.FC = () => {
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 'build',
      name: 'Build Application',
      description: 'Compilation et optimisation du code',
      status: 'completed',
      duration: 120,
      logs: ['✓ Dependencies installed', '✓ TypeScript compiled', '✓ Assets optimized']
    },
    {
      id: 'tests',
      name: 'Tests Automatisés',
      description: 'Exécution des tests unitaires et d\'intégration',
      status: 'completed',
      duration: 85,
      logs: ['✓ Unit tests: 156 passed', '✓ Integration tests: 42 passed', '✓ E2E tests: 18 passed']
    },
    {
      id: 'security',
      name: 'Scan de Sécurité',
      description: 'Vérification des vulnérabilités',
      status: 'completed',
      duration: 45,
      logs: ['✓ No critical vulnerabilities', '✓ Dependencies scan passed', '✓ Code quality check passed']
    },
    {
      id: 'database',
      name: 'Migration Base de Données',
      description: 'Application des migrations en production',
      status: 'running',
      logs: ['⚡ Running migration 2024_01_15_add_llm_metrics...', '⚡ Updating indexes...']
    },
    {
      id: 'deploy',
      name: 'Déploiement',
      description: 'Mise en ligne de la nouvelle version',
      status: 'pending'
    },
    {
      id: 'healthcheck',
      name: 'Vérifications',
      description: 'Tests de santé post-déploiement',
      status: 'pending'
    }
  ]);

  const [environments] = useState<Environment[]>([
    {
      name: 'Production',
      url: 'https://app.africahub.com',
      status: 'healthy',
      version: 'v2.1.3',
      lastDeployment: '2024-01-15 14:30',
      uptime: 99.94
    },
    {
      name: 'Staging',
      url: 'https://staging.africahub.com',
      status: 'healthy',
      version: 'v2.2.0-rc.1',
      lastDeployment: '2024-01-15 16:45',
      uptime: 99.89
    },
    {
      name: 'Development',
      url: 'https://dev.africahub.com',
      status: 'warning',
      version: 'v2.2.0-dev',
      lastDeployment: '2024-01-15 17:15',
      uptime: 98.76
    }
  ]);

  const [deploymentConfig] = useState({
    version: 'v2.2.0',
    branch: 'main',
    environment: 'production',
    strategy: 'blue-green',
    autoRollback: true,
    healthCheckTimeout: 300
  });

  const [isDeploying, setIsDeploying] = useState(false);

  const startDeployment = async () => {
    setIsDeploying(true);
    
    // Simuler le déploiement
    for (let i = 0; i < deploymentSteps.length; i++) {
      if (deploymentSteps[i].status !== 'completed') {
        // Marquer comme en cours
        setDeploymentSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'running' } : step
          )
        );
        
        // Simuler le temps d'exécution
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        
        // Marquer comme terminé
        setDeploymentSteps(prev => 
          prev.map((step, index) => 
            index === i ? { 
              ...step, 
              status: 'completed', 
              duration: Math.round(2 + Math.random() * 3) * 30,
              logs: step.logs || [`✓ ${step.name} completed successfully`]
            } : step
          )
        );
      }
    }
    
    setIsDeploying(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressValue = () => {
    const completed = deploymentSteps.filter(step => step.status === 'completed').length;
    return (completed / deploymentSteps.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Déploiement Production</h1>
          <p className="text-gray-600">Gestion des déploiements et environnements</p>
        </div>
        
        <Button 
          onClick={startDeployment}
          disabled={isDeploying}
          size="lg"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isDeploying ? 'Déploiement en cours...' : 'Déployer en Production'}
        </Button>
      </div>

      <Tabs defaultValue="deployment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          <TabsTrigger value="environments">Environnements</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="rollback">Rollback</TabsTrigger>
        </TabsList>

        <TabsContent value="deployment" className="space-y-6">
          {/* Progression globale */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Progression du Déploiement
                </CardTitle>
                <Badge variant={isDeploying ? "default" : "secondary"}>
                  {isDeploying ? 'En cours' : 'Prêt'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progression Globale</span>
                    <span className="text-sm">{Math.round(getProgressValue())}%</span>
                  </div>
                  <Progress value={getProgressValue()} className="h-3" />
                </div>
                
                <div className="text-sm text-gray-600">
                  Version: <strong>{deploymentConfig.version}</strong> | 
                  Branche: <strong>{deploymentConfig.branch}</strong> | 
                  Stratégie: <strong>{deploymentConfig.strategy}</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Étapes du déploiement */}
          <Card>
            <CardHeader>
              <CardTitle>Étapes du Déploiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{step.name}</h4>
                        {step.duration && (
                          <span className="text-sm text-gray-500">{step.duration}s</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      
                      {step.logs && step.logs.length > 0 && (
                        <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                          {step.logs.map((log, logIndex) => (
                            <div key={logIndex} className="font-mono">{log}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {environments.map((env) => (
              <Card key={env.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{env.name}</CardTitle>
                    <Badge className={getStatusColor(env.status)}>
                      {env.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">URL</div>
                    <a 
                      href={env.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {env.url}
                    </a>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Version</div>
                    <div className="font-mono text-sm">{env.version}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Dernier déploiement</div>
                    <div className="text-sm">{env.lastDeployment}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Uptime</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={env.uptime} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{env.uptime}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration de Déploiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Stratégies de Déploiement</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="strategy" defaultChecked />
                        <span className="text-sm">Blue-Green Deployment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="strategy" />
                        <span className="text-sm">Rolling Deployment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="strategy" />
                        <span className="text-sm">Canary Deployment</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Options</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Auto-rollback en cas d'erreur</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Tests de santé automatiques</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">Notifications Slack</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Variables d'Environnement</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>NODE_ENV</span>
                        <span className="font-mono">production</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DATABASE_URL</span>
                        <span className="font-mono">postgresql://...</span>
                      </div>
                      <div className="flex justify-between">
                        <span>REDIS_URL</span>
                        <span className="font-mono">redis://...</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LOG_LEVEL</span>
                        <span className="font-mono">info</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Limites</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Timeout déploiement</span>
                        <span>15 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health check timeout</span>
                        <span>5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max instances</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rollback" className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Le rollback restaure automatiquement la version précédente en cas de problème critique.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Versions Disponibles pour Rollback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { version: 'v2.1.3', date: '2024-01-15 14:30', status: 'current', stable: true },
                  { version: 'v2.1.2', date: '2024-01-10 09:15', status: 'available', stable: true },
                  { version: 'v2.1.1', date: '2024-01-05 16:45', status: 'available', stable: true },
                  { version: 'v2.1.0', date: '2024-01-01 12:00', status: 'available', stable: false }
                ].map((version) => (
                  <div key={version.version} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-medium">{version.version}</span>
                        {version.status === 'current' && (
                          <Badge variant="default">Actuelle</Badge>
                        )}
                        {version.stable && (
                          <Badge variant="secondary">Stable</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{version.date}</div>
                    </div>
                    
                    {version.status !== 'current' && (
                      <Button variant="outline" size="sm">
                        Rollback vers {version.version}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
