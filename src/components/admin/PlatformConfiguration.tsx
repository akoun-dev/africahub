
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Globe, Palette, Shield, Save, FileText } from 'lucide-react';
import { ContentManagement } from './ContentManagement';
import { GeneralConfigTab } from './platform-config/GeneralConfigTab';
import { LocalizationConfigTab } from './platform-config/LocalizationConfigTab';
import { BrandingConfigTab } from './platform-config/BrandingConfigTab';
import { SecurityConfigTab } from './platform-config/SecurityConfigTab';
import { PlatformConfig } from './platform-config/types';

export const PlatformConfiguration: React.FC = () => {
  const [config, setConfig] = useState<PlatformConfig>({
    platformName: 'AfricaHub',
    defaultLanguage: 'fr',
    defaultCurrency: 'XOF',
    maintenanceMode: false,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    contactEmail: 'contact@africahub.com',
    supportPhone: '+225 XX XX XX XX'
  });

  const handleSave = () => {
    console.log('Saving configuration:', config);
    // Ici vous pouvez appeler votre API pour sauvegarder
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration de la plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                Général
              </TabsTrigger>
              <TabsTrigger value="localization">
                <Globe className="h-4 w-4 mr-2" />
                Localisation
              </TabsTrigger>
              <TabsTrigger value="branding">
                <Palette className="h-4 w-4 mr-2" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText className="h-4 w-4 mr-2" />
                Contenu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <GeneralConfigTab config={config} setConfig={setConfig} />
            </TabsContent>

            <TabsContent value="localization">
              <LocalizationConfigTab config={config} setConfig={setConfig} />
            </TabsContent>

            <TabsContent value="branding">
              <BrandingConfigTab config={config} setConfig={setConfig} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityConfigTab config={config} setConfig={setConfig} />
            </TabsContent>

            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder la configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
