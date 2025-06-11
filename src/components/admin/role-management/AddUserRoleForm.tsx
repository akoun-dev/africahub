
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { ValidRole, VALID_ROLES, isValidRole } from './types';

interface AddUserRoleFormProps {
  onRoleAdded: () => void;
}

export const AddUserRoleForm: React.FC<AddUserRoleFormProps> = ({ onRoleAdded }) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<ValidRole>('user');

  const handleRoleChange = (value: string) => {
    if (isValidRole(value)) {
      setNewUserRole(value);
    } else {
      console.error('Invalid role selected:', value);
      toast.error('Rôle invalide sélectionné');
    }
  };

  const addUserRole = async () => {
    if (!newUserEmail || !newUserRole) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUserEmail,
          role: newUserRole
        });

      if (error) {
        if (error.message.includes('violates foreign key constraint')) {
          toast.error('Utilisateur non trouvé. Utilisez l\'UUID de l\'utilisateur.');
        } else if (error.message.includes('duplicate key')) {
          toast.error('Cet utilisateur a déjà ce rôle.');
        } else {
          throw error;
        }
        return;
      }

      toast.success('Rôle ajouté avec succès');
      setNewUserEmail('');
      setNewUserRole('user');
      onRoleAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rôle:', error);
      toast.error('Erreur lors de l\'ajout du rôle');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Ajouter un rôle utilisateur
        </CardTitle>
        <p className="text-sm text-gray-600">
          Utilisez l'UUID de l'utilisateur (visible dans la liste ci-dessous)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="UUID de l'utilisateur"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <Select value={newUserRole} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Utilisateur</SelectItem>
              <SelectItem value="moderator">Modérateur</SelectItem>
              <SelectItem value="developer">Développeur</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addUserRole}>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
