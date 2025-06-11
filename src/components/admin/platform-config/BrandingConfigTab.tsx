
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ConfigTabProps } from './types';

export const BrandingConfigTab: React.FC<ConfigTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primaryColor">Couleur principale</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              value={config.primaryColor}
              onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
            />
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="secondaryColor">Couleur secondaire</Label>
          <div className="flex gap-2">
            <Input
              id="secondaryColor"
              value={config.secondaryColor}
              onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
            />
            <input
              type="color"
              value={config.secondaryColor}
              onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
              className="w-12 h-10 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Logo de la plateforme</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">Glissez votre logo ici ou cliquez pour sélectionner</p>
            <Button variant="outline" className="mt-2">Choisir un fichier</Button>
          </div>
        </div>

        <div>
          <Label>Favicon</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">Favicon (.ico, .png) - 32x32px recommandé</p>
            <Button variant="outline" className="mt-2">Choisir un fichier</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
