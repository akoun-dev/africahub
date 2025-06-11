
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { CountryGroup } from './types';

interface GroupConfigurationProps {
  group: CountryGroup;
}

export const GroupConfiguration: React.FC<GroupConfigurationProps> = ({ group }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Configuration du Groupe</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="groupName">Nom du groupe</Label>
          <Input
            id="groupName"
            defaultValue={group.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            defaultValue={group.description}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Devise principale</Label>
          <Select defaultValue={group.currency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XOF">XOF (Franc CFA Ouest)</SelectItem>
              <SelectItem value="XAF">XAF (Franc CFA Central)</SelectItem>
              <SelectItem value="USD">USD (Dollar US)</SelectItem>
              <SelectItem value="EUR">EUR (Euro)</SelectItem>
              <SelectItem value="MAD">MAD (Dirham)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Couleur du groupe</Label>
          <div className="flex gap-2">
            {['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'].map(color => (
              <div
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  group.color === color ? 'border-gray-800' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active">Groupe actif</Label>
            <p className="text-sm text-gray-600">Active les configurations pour tous les pays</p>
          </div>
          <Switch id="active" defaultChecked={group.isActive} />
        </div>

        <div className="flex gap-2 pt-4">
          <Button className="bg-afroGreen hover:bg-afroGreen/90">
            Sauvegarder
          </Button>
          <Button variant="outline">
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
