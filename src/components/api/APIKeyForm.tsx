
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAPIKey } from '@/hooks/useAPIManagement';
import { X, Key, Shield } from 'lucide-react';

interface APIKeyFormProps {
  onClose: () => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'read:products', label: 'Lecture des produits', description: 'Accès en lecture aux données produits' },
  { id: 'read:companies', label: 'Lecture des entreprises', description: 'Accès en lecture aux données entreprises' },
  { id: 'read:sectors', label: 'Lecture des secteurs', description: 'Accès en lecture aux secteurs' },
  { id: 'write:quotes', label: 'Création de devis', description: 'Création de demandes de devis' },
  { id: 'read:analytics', label: 'Lecture analytics', description: 'Accès aux données analytiques' },
  { id: 'admin:all', label: 'Accès administrateur', description: 'Accès complet (admin uniquement)' }
];

const RATE_LIMITS = [
  { value: 100, label: '100 requêtes/min' },
  { value: 500, label: '500 requêtes/min' },
  { value: 1000, label: '1000 requêtes/min' },
  { value: 5000, label: '5000 requêtes/min' },
  { value: 10000, label: '10000 requêtes/min' }
];

export const APIKeyForm: React.FC<APIKeyFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [rateLimit, setRateLimit] = useState(1000);
  
  const createMutation = useCreateAPIKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    if (selectedPermissions.length === 0) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        permissions: selectedPermissions,
        rate_limit: rateLimit
      });
      onClose();
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Créer une nouvelle clé API
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de la clé */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la clé API</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: API Production, Test Integration..."
                required
              />
            </div>

            {/* Limite de débit */}
            <div className="space-y-2">
              <Label>Limite de débit</Label>
              <Select value={rateLimit.toString()} onValueChange={(value) => setRateLimit(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RATE_LIMITS.map((limit) => (
                    <SelectItem key={limit.value} value={limit.value.toString()}>
                      {limit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissions
              </Label>
              <div className="space-y-3 border rounded-lg p-4">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {permission.label}
                      </label>
                      <p className="text-xs text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedPermissions.length === 0 && (
                <p className="text-sm text-red-600">
                  Veuillez sélectionner au moins une permission
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={!name.trim() || selectedPermissions.length === 0 || createMutation.isPending}
                className="bg-afroGreen hover:bg-afroGreen/90"
              >
                {createMutation.isPending ? 'Création...' : 'Créer la clé API'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
