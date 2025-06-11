
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountrySupportManagement } from '../CountrySupportManagement';
import { CountryGroupManager } from '../CountryGroupManager';
import { CountryTemplateManager } from '../CountryTemplateManager';
import { CountryAnalyticsDashboard } from '../CountryAnalyticsDashboard';
import { MassOperationsTab } from './MassOperationsTab';

interface EnhancedCountryTabsProps {
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

export const EnhancedCountryTabs: React.FC<EnhancedCountryTabsProps> = ({
  activeTab,
  onActiveTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange} className="space-y-4">
      <TabsList className="grid grid-cols-5 w-full max-w-3xl">
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="groups">Groupes Pays</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="mass-ops">Opérations Masse</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <CountrySupportManagement />
      </TabsContent>

      <TabsContent value="groups">
        <CountryGroupManager />
      </TabsContent>

      <TabsContent value="templates">
        <CountryTemplateManager />
      </TabsContent>

      <TabsContent value="analytics">
        <CountryAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="mass-ops">
        <MassOperationsTab />
      </TabsContent>
    </Tabs>
  );
};
