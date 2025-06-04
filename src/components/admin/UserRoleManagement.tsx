
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Trash2, Shield, Users } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user' | 'developer';
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export const UserRoleManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator' | 'user' | 'developer'>('user');

  const fetchUserRoles = async () => {
    try {
      // Fetch user roles with user information
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Get user emails using profiles
      const rolesWithUserInfo: UserRole[] = [];
      
      for (const role of rolesData || []) {
        try {
          // Try to get user info from profiles first
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', role.user_id)
            .single();

          const userName = profileData?.first_name && profileData?.last_name 
            ? `${profileData.first_name} ${profileData.last_name}`
            : 'Nom non disponible';

          rolesWithUserInfo.push({
            ...role,
            role: role.role as 'admin' | 'moderator' | 'user' | 'developer',
            user_name: userName,
            user_email: 'Email non disponible' // We'll display the user_id instead
          });
        } catch (error) {
          console.error('Error fetching user info for user:', role.user_id, error);
          rolesWithUserInfo.push({
            ...role,
            role: role.role as 'admin' | 'moderator' | 'user' | 'developer',
            user_name: 'Nom non disponible',
            user_email: 'Email non disponible'
          });
        }
      }

      setUserRoles(rolesWithUserInfo);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      toast.error('Erreur lors du chargement des rôles utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

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
      fetchUserRoles();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rôle:', error);
      toast.error('Erreur lors de l\'ajout du rôle');
    }
  };

  const removeUserRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success('Rôle supprimé avec succès');
      fetchUserRoles();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du rôle');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'moderator': return <Users className="h-3 w-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des rôles utilisateur...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Ajouter un rôle utilisateur
          </CardTitle>
          <p className="text-sm text-gray-600">
            Note: Pour le moment, utilisez l'ID utilisateur UUID au lieu de l'email
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="ID utilisateur (UUID)"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <Select value={newUserRole} onValueChange={(value: 'admin' | 'moderator' | 'user' | 'developer') => setNewUserRole(value)}>
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

      <Card>
        <CardHeader>
          <CardTitle>Rôles utilisateur actuels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userRoles.map((userRole) => (
              <div key={userRole.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getRoleColor(userRole.role)}>
                    {getRoleIcon(userRole.role)}
                    {userRole.role}
                  </Badge>
                  <div>
                    <p className="font-medium">
                      {userRole.user_name || 'Nom non disponible'}
                    </p>
                    <p className="text-sm text-gray-600">ID: {userRole.user_id}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeUserRole(userRole.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {userRoles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun rôle utilisateur trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
