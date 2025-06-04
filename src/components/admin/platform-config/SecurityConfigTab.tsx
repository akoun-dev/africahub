
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { ConfigTabProps } from './types';

export const SecurityConfigTab: React.FC<ConfigTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-red-900 mb-2">Paramètres de sécurité</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentification à deux facteurs obligatoire</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Connexions SSL uniquement</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Limitation du taux de requêtes</span>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sessionTimeout">Expiration de session (minutes)</Label>
          <Input id="sessionTimeout" type="number" defaultValue="60" />
        </div>
        
        <div>
          <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
          <Input id="maxLoginAttempts" type="number" defaultValue="5" />
        </div>
      </div>
    </div>
  );
};
