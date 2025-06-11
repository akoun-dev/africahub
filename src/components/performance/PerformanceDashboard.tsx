
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePerformanceOptimizer } from '@/hooks/usePerformanceOptimizer';
import { 
  Zap, 
  Image, 
  Wifi, 
  Database, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const PerformanceDashboard: React.FC = () => {
  const {
    metrics,
    loading,
    measurePerformance,
    optimizeImages,
    enableServiceWorker,
    preloadCriticalResources
  } = usePerformanceOptimizer();

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Dashboard Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button onClick={measurePerformance} disabled={loading}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Mesurer les performances
            </Button>
            
            {metrics && (
              <Badge 
                className={`${getScoreColor(metrics.score)} text-white flex items-center gap-2`}
              >
                {getScoreIcon(metrics.score)}
                Score: {metrics.score}
              </Badge>
            )}
          </div>

          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">LCP</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {(metrics.lcp / 1000).toFixed(1)}s
                </p>
                <Progress 
                  value={Math.min((metrics.lcp / 2500) * 100, 100)} 
                  className="mt-2"
                />
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800">FID</h4>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.fid.toFixed(0)}ms
                </p>
                <Progress 
                  value={Math.min((metrics.fid / 100) * 100, 100)} 
                  className="mt-2"
                />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">CLS</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.cls.toFixed(3)}
                </p>
                <Progress 
                  value={Math.min((metrics.cls / 0.1) * 100, 100)} 
                  className="mt-2"
                />
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800">TTFB</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {metrics.ttfb.toFixed(0)}ms
                </p>
                <Progress 
                  value={Math.min((metrics.ttfb / 600) * 100, 100)} 
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={optimizeImages}>
              <Image className="h-4 w-4 mr-2" />
              Optimiser les images
            </Button>
            
            <Button variant="outline" onClick={enableServiceWorker}>
              <Wifi className="h-4 w-4 mr-2" />
              Activer le cache offline
            </Button>
            
            <Button variant="outline" onClick={preloadCriticalResources}>
              <Database className="h-4 w-4 mr-2" />
              Précharger les ressources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
