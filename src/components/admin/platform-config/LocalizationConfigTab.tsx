
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ConfigTabProps } from './types';

export const LocalizationConfigTab: React.FC<ConfigTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="defaultLanguage">Langue par défaut</Label>
          <select
            id="defaultLanguage"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={config.defaultLanguage}
            onChange={(e) => setConfig({ ...config, defaultLanguage: e.target.value })}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="defaultCurrency">Devise par défaut</Label>
          <select
            id="defaultCurrency"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={config.defaultCurrency}
            onChange={(e) => setConfig({ ...config, defaultCurrency: e.target.value })}
          >
            <option value="XOF">Franc CFA (XOF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar US (USD)</option>
            <option value="MAD">Dirham marocain (MAD)</option>
          </select>
        </div>
      </div>

      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Pays supportés</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div>🇨🇮 Côte d'Ivoire</div>
            <div>🇸🇳 Sénégal</div>
            <div>🇧🇫 Burkina Faso</div>
            <div>🇲🇦 Maroc</div>
            <div>🇹🇳 Tunisie</div>
            <div>🇳🇬 Nigeria</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
