
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Users, DollarSign } from 'lucide-react';
import { CountryGroup } from './types';

interface CountriesManagementProps {
  group: CountryGroup;
}

export const CountriesManagement: React.FC<CountriesManagementProps> = ({ group }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pays du Groupe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Countries */}
        <div className="space-y-2">
          <Label>Pays inclus ({group.countries.length})</Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {group.countries.map(country => (
              <Badge
                key={country}
                variant="outline"
                className="cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-700"
              >
                {country} ✕
              </Badge>
            ))}
          </div>
        </div>

        {/* Add Countries */}
        <div className="space-y-2">
          <Label>Ajouter des pays</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AO">Angola (AO)</SelectItem>
              <SelectItem value="BW">Botswana (BW)</SelectItem>
              <SelectItem value="BI">Burundi (BI)</SelectItem>
              <SelectItem value="DJ">Djibouti (DJ)</SelectItem>
              <SelectItem value="ER">Érythrée (ER)</SelectItem>
              <SelectItem value="ET">Éthiopie (ET)</SelectItem>
              <SelectItem value="KE">Kenya (KE)</SelectItem>
              <SelectItem value="LS">Lesotho (LS)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-4">
          <Label>Actions rapides</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              + Afrique de l'Ouest
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              + Afrique Centrale
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              + Afrique de l'Est
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              + Afrique du Nord
            </Button>
          </div>
        </div>

        {/* Group Stats */}
        <div className="space-y-3 pt-4 border-t">
          <Label>Statistiques du groupe</Label>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pays actifs:</span>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-green-600" />
                <span className="font-medium">{group.activeCountries}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Utilisateurs:</span>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="font-medium">{group.totalUsers.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between col-span-2">
              <span className="text-gray-600">Revenus moyens:</span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-yellow-600" />
                <span className="font-medium">{group.avgRevenue.toLocaleString()} {group.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
