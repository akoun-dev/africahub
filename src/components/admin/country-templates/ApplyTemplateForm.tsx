
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Globe, Settings } from 'lucide-react';
import { mockTemplates } from './mockData';

export const ApplyTemplateForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appliquer Templates aux Pays</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Template à appliquer</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner template" />
              </SelectTrigger>
              <SelectContent>
                {mockTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.usageCount} utilisations)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mode d'application</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overwrite">Remplacer complètement</SelectItem>
                <SelectItem value="merge">Fusionner avec existant</SelectItem>
                <SelectItem value="preview">Aperçu uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Country Selection */}
        <div className="space-y-4">
          <Label>Pays cibles</Label>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {['SN', 'CI', 'ML', 'BF', 'NG', 'GH', 'KE', 'ZA', 'EG', 'MA', 'DZ', 'TN'].map(country => (
              <div key={country} className="flex items-center space-x-2">
                <input type="checkbox" id={country} className="rounded" />
                <label htmlFor={country} className="text-sm cursor-pointer">
                  {country}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aperçu des Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>12 pays seront mis à jour</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>Configuration devise: XOF → USD pour 5 pays</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <span>Taux commission: 8% → 15% pour 12 pays</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button className="bg-afroGreen hover:bg-afroGreen/90">
            Appliquer aux 12 Pays
          </Button>
          <Button variant="outline">
            Planifier Application
          </Button>
          <Button variant="outline">
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
