
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleManagement } from './RoleManagement';
import { AdminManagementSection } from './AdminManagementSection';
import { Shield, Users } from 'lucide-react';

export const BackendUserManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs Backend
          </CardTitle>
          <p className="text-sm text-gray-600">
            Gérez les rôles, permissions et comptes administrateurs de la plateforme
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-800">Système de Gestion Unifié</h3>
            </div>
            <p className="text-sm text-blue-700">
              Cette section permet de créer directement de nouveaux administrateurs et de gérer 
              les rôles existants. Toutes les actions sont sécurisées et auditées.
            </p>
          </div>
        </CardContent>
      </Card>

      <AdminManagementSection />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des Rôles Avancée
          </CardTitle>
          <p className="text-sm text-gray-600">
            Attribution manuelle de rôles par UUID utilisateur
          </p>
        </CardHeader>
        <CardContent>
          <RoleManagement />
        </CardContent>
      </Card>
    </div>
  );
};
