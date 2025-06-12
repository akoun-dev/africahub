
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const PermissionsDisplay = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Permissions par Rôle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Super Administrateur</h4>
            <div className="space-y-1 text-sm">
              <div>✅ Accès complet</div>
              <div>✅ Gestion des utilisateurs</div>
              <div>✅ Configuration plateforme</div>
              <div>✅ Analytics avancées</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Administrateur</h4>
            <div className="space-y-1 text-sm">
              <div>✅ Gestion des contenus</div>
              <div>✅ Gestion des utilisateurs publics</div>
              <div>✅ Analytics de base</div>
              <div>❌ Configuration système</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Modérateur</h4>
            <div className="space-y-1 text-sm">
              <div>✅ Modération des avis</div>
              <div>✅ Support utilisateur</div>
              <div>❌ Gestion des utilisateurs</div>
              <div>❌ Configuration</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
