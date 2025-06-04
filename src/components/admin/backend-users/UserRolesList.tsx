
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { BackendUser } from '@/types';

interface UserRolesListProps {
  users: BackendUser[];
  onToggleStatus: (userId: string) => void;
  onUpdateUser: (userId: string, updates: Partial<BackendUser>) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserRolesList = ({ users, onToggleStatus, onUpdateUser, onDeleteUser }: UserRolesListProps) => {
  const getRoleBadge = (role: string) => {
    const variants = {
      'super-admin': 'bg-red-100 text-red-800',
      'admin': 'bg-blue-100 text-blue-800',
      'moderator': 'bg-green-100 text-green-800'
    };
    return variants[role as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Pays</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Dernière connexion</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getRoleBadge(user.role)}>
                {user.role === 'super-admin' ? 'Super Admin' : 
                 user.role === 'admin' ? 'Admin' : 'Modérateur'}
              </Badge>
            </TableCell>
            <TableCell>{user.country_code || 'Tous'}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={user.is_active}
                  onCheckedChange={() => onToggleStatus(user.id)}
                />
                <span className="text-sm">
                  {user.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-sm">
              {user.last_login ? formatDate(user.last_login) : 'Jamais'}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600"
                  onClick={() => onDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
