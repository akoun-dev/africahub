
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalyticsOverview } from './analytics/AnalyticsOverview';
import { AnalyticsCharts } from './analytics/AnalyticsCharts';
import { AnalyticsGeography } from './analytics/AnalyticsGeography';
import { AnalyticsInsuranceTypes } from './analytics/AnalyticsInsuranceTypes';
import { AnalyticsAdvanced } from './analytics/AnalyticsAdvanced';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Analysez les performances de votre plateforme d'assurance
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner la période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 derniers jours</SelectItem>
            <SelectItem value="30">30 derniers jours</SelectItem>
            <SelectItem value="90">3 derniers mois</SelectItem>
            <SelectItem value="365">12 derniers mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
          <TabsTrigger value="insurance">Types d'assurance</TabsTrigger>
          <TabsTrigger value="advanced">BI Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AnalyticsOverview timeRange={parseInt(timeRange)} />
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <AnalyticsCharts timeRange={parseInt(timeRange)} />
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <AnalyticsGeography />
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <AnalyticsInsuranceTypes />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AnalyticsAdvanced />
        </TabsContent>
      </Tabs>
    </div>
  );
};
