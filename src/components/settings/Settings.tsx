
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Globe, Shield, Eye, Palette } from 'lucide-react';

import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { LanguageRegionSettings } from './LanguageRegionSettings';
import { PrivacySettings } from './PrivacySettings';
import { AccessibilitySettings } from './AccessibilitySettings';
import { ThemeSettings } from './ThemeSettings';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-600 mt-2">Gérez vos préférences et paramètres</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Région</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Confidentialité</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Accessibilité</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Thème</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="language">
              <LanguageRegionSettings />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettings />
            </TabsContent>

            <TabsContent value="accessibility">
              <AccessibilitySettings />
            </TabsContent>

            <TabsContent value="theme">
              <ThemeSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
