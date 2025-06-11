
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Crown, Users, Code } from 'lucide-react';

export const RolePermissionsInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Permissions par Rôle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-1">
              <Crown className="h-4 w-4" />
              Super Admin
            </h4>
            <div className="space-y-1 text-sm">
              <div>✅ Accès complet</div>
              <div>✅ Gestion des rôles</div>
              <div>✅ Configuration plateforme</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Administrateur
            </h4>
            <div className="space-y-1 text-sm">
              <div>✅ Interface admin</div>
              <div>✅ Gestion contenus</div>
              <div>✅ Analytics</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-1">
              <Users className="h-4 w-4" />
              Modérateur
            </h4>
            <div className="space-y-1 text-sm">
              <div>✅ Modération avis</div>
              <div>✅ Support utilisateur</div>
              <div>❌ Configuration</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-1">
              <Code className="h-4 w-4" />
              Développeur
            </h4>
            <div className="space-y-1 text-sm">
              <div>✅ Accès API</div>
              <div>✅ Debugging</div>
              <div>✅ Logs techniques</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
