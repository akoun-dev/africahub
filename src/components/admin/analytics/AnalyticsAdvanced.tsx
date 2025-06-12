
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { AfricaRegionalDashboard } from './AfricaRegionalDashboard';
import { BusinessReports } from './BusinessReports';
import { AnalyticsIntegration } from './AnalyticsIntegration';
import { ProductionDashboard } from './ProductionDashboard';
import { SecurityCompliance } from './SecurityCompliance';
import { SectorLLMDashboard } from './SectorLLMDashboard';

export const AnalyticsAdvanced: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Avancés & BI Multi-Sectoriels</h2>
        <p className="text-muted-foreground">
          Tableaux de bord exécutifs, prédictions et monitoring production pour l'écosystème africain multi-secteurs
        </p>
      </div>

      <Tabs defaultValue="executive" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="executive">Dashboard Exécutif</TabsTrigger>
          <TabsTrigger value="sector-llm">LLM Multi-Secteurs</TabsTrigger>
          <TabsTrigger value="predictive">Analytics Prédictifs</TabsTrigger>
          <TabsTrigger value="regional">Dashboard Régional</TabsTrigger>
          <TabsTrigger value="reports">Rapports BI</TabsTrigger>
          <TabsTrigger value="integration">Intégrations</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-4">
          <ExecutiveDashboard />
        </TabsContent>

        <TabsContent value="sector-llm" className="space-y-4">
          <SectorLLMDashboard />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <AfricaRegionalDashboard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <BusinessReports />
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <AnalyticsIntegration />
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <ProductionDashboard />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
};
