
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Crown, Users } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';

export const AdminUsersList: React.FC = () => {
  const { adminUsers, fetchAdminUsers, isLoading } = useAdminManagement();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Crown className="h-3 w-3" />;
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'moderator':
        return <Users className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrateur';
      case 'moderator':
        return 'Modérateur';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des administrateurs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Administrateurs actifs ({adminUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {adminUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun administrateur trouvé
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Créé le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.user_id}>
                  <TableCell>
                    <div className="font-medium">
                      {admin.first_name} {admin.last_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {admin.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(admin.role)}>
                      {getRoleIcon(admin.role)}
                      <span className="ml-1">{getRoleLabel(admin.role)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDate(admin.created_at)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
