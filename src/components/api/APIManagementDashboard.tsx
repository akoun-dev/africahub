
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIKeyManagement } from './APIKeyManagement';
import { APIDocumentation } from './APIDocumentation';
import { APIAnalytics } from './APIAnalytics';
import { APIWebhooks } from './APIWebhooks';
import { 
  Key, 
  FileText, 
  BarChart3, 
  Webhook,
  Shield
} from 'lucide-react';

export const APIManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('keys');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion API</h1>
        <p className="text-gray-600 mt-2">
          Gérez l'accès API pour les partenaires et développeurs tiers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Clés API
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <APIKeyManagement />
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <APIDocumentation />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <APIAnalytics />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <APIWebhooks />
        </TabsContent>
      </Tabs>
    </div>
  );
};
