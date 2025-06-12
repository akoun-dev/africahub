
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapboxConfigurationStatus } from '@/components/Map/MapboxConfigurationStatus';
import { ConfigTabProps } from './types';

export const GeneralConfigTab: React.FC<ConfigTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      {/* Mapbox Configuration Status for Admin */}
      <MapboxConfigurationStatus variant="admin" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="platformName">Nom de la plateforme</Label>
          <Input
            id="platformName"
            value={config.platformName}
            onChange={(e) => setConfig({ ...config, platformName: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="contactEmail">Email de contact</Label>
          <Input
            id="contactEmail"
            type="email"
            value={config.contactEmail}
            onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supportPhone">Téléphone support</Label>
          <Input
            id="supportPhone"
            value={config.supportPhone}
            onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
          />
        </div>
        
        <div className="flex items-center space-x-2 mt-6">
          <Switch
            id="maintenance"
            checked={config.maintenanceMode}
            onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
          />
          <Label htmlFor="maintenance">Mode maintenance</Label>
        </div>
      </div>
    </div>
  );
};
