
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Shield, Users } from 'lucide-react';
import { AdminCreationForm } from './AdminCreationForm';
import { AdminUsersList } from './AdminUsersList';

export const AdminManagementSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');

  const handleAdminCreated = () => {
    // Switch to list tab to show the newly created admin
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des Administrateurs
          </CardTitle>
          <p className="text-sm text-gray-600">
            Créez et gérez les comptes administrateurs de la plateforme
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Sécurité Administrative</h3>
            </div>
            <p className="text-sm text-yellow-700">
              Seuls les administrateurs existants peuvent créer de nouveaux comptes admin. 
              Chaque création est enregistrée dans les logs d'audit pour la traçabilité.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Liste des Admins
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Créer un Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <AdminUsersList />
            </TabsContent>

            <TabsContent value="create" className="mt-6">
              <div className="flex justify-center">
                <AdminCreationForm onAdminCreated={handleAdminCreated} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
