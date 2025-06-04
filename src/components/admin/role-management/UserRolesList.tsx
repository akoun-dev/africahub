
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Crown, Shield, Users, Code } from 'lucide-react';
import { UserWithRoles, ValidRole, isValidRole } from './types';
import { getRoleColor, getRoleIconName } from './utils';

interface UserRolesListProps {
  usersWithRoles: UserWithRoles[];
  onRoleRemoved: () => void;
}

const iconComponents = {
  Crown,
  Shield,
  Users,
  Code
};

export const UserRolesList: React.FC<UserRolesListProps> = ({ usersWithRoles, onRoleRemoved }) => {
  const removeUserRole = async (userId: string, role: string) => {
    // Validation du rôle avant suppression
    if (!isValidRole(role)) {
      toast.error('Rôle invalide');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role as ValidRole);

      if (error) throw error;

      toast.success('Rôle supprimé avec succès');
      onRoleRemoved();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du rôle');
    }
  };

  const getRoleIcon = (role: string) => {
    const iconName = getRoleIconName(role);
    if (!iconName || !(iconName in iconComponents)) return null;
    
    const IconComponent = iconComponents[iconName as keyof typeof iconComponents];
    return <IconComponent className="h-3 w-3" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs avec rôles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {usersWithRoles.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} className={getRoleColor(role)}>
                      {getRoleIcon(role)}
                      {role}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="font-medium">
                    {user.email || 'Nom non disponible'}
                  </p>
                  <p className="text-sm text-gray-600">UUID: {user.id}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {user.roles.map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    onClick={() => removeUserRole(user.id, role)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          {usersWithRoles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur avec des rôles trouvé
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
