
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LLMMetricsWidget } from './LLMMetricsWidget';
import { LLMPreferencesManager } from './LLMPreferencesManager';
import { LLMExecutiveDashboard } from './LLMExecutiveDashboard';
import { LLMAdvancedMonitoring } from './LLMAdvancedMonitoring';
import { LLMProvidersConfig } from './LLMProvidersConfig';
import { Brain, BarChart3, Settings, Users, Target, Shield } from 'lucide-react';

export const LLMConfigManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuration Multi-LLM</h2>
        <p className="text-gray-600">
          Gérez et surveillez votre système d'IA multi-providers optimisé pour l'Afrique
        </p>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="executive" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Exécutif
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Préférences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <LLMProvidersConfig />
        </TabsContent>

        <TabsContent value="executive">
          <LLMExecutiveDashboard />
        </TabsContent>

        <TabsContent value="monitoring">
          <LLMAdvancedMonitoring />
        </TabsContent>

        <TabsContent value="metrics">
          <LLMMetricsWidget />
        </TabsContent>

        <TabsContent value="preferences">
          <LLMPreferencesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
