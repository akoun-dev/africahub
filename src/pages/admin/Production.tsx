
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExecutiveDashboard } from '@/components/admin/monitoring/ExecutiveDashboard';
import { SecurityAuditDashboard } from '@/components/admin/security/SecurityAuditDashboard';
import { PerformanceOptimizer } from '@/components/admin/performance/PerformanceOptimizer';
import { PublicAPIManager } from '@/components/admin/api/PublicAPIManager';
import { ProductionDeployment } from '@/components/admin/deployment/ProductionDeployment';
import { ProductionDashboard } from '@/components/admin/analytics/ProductionDashboard';
import { 
  BarChart3, 
  Shield, 
  Zap, 
  Globe, 
  Rocket,
  Monitor
} from 'lucide-react';

const Production = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Production & Monitoring
          </h1>
          <p className="text-gray-600">
            Phase 4 - Surveillance avancée et optimisation de la production
          </p>
        </div>

        <Tabs defaultValue="executive" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="executive" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Exécutif
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Déploiement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="executive">
            <ExecutiveDashboard />
          </TabsContent>

          <TabsContent value="production">
            <ProductionDashboard />
          </TabsContent>

          <TabsContent value="security">
            <SecurityAuditDashboard />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceOptimizer />
          </TabsContent>

          <TabsContent value="api">
            <PublicAPIManager />
          </TabsContent>

          <TabsContent value="deployment">
            <ProductionDeployment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Production;
