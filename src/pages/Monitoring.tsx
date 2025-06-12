
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemHealthDashboard } from '@/components/monitoring/SystemHealthDashboard';
import { AlertsManager } from '@/components/monitoring/AlertsManager';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, BarChart3, Settings } from 'lucide-react';

export const Monitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Centre de Monitoring</h1>
          <p className="text-gray-600">
            Observabilité et surveillance temps réel de la plateforme de comparaison
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alertes</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SystemHealthDashboard />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Avancées</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Les analytics avancées seront implémentées dans la prochaine phase.
                  Incluront les tendances, prédictions et analyses comportementales.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="py-12 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Paramètres de Monitoring</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Configuration des seuils d'alertes, notifications, et paramètres 
                  de monitoring personnalisés.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Monitoring;
