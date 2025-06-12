
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AddUserRoleForm } from './role-management/AddUserRoleForm';
import { UserRolesList } from './role-management/UserRolesList';
import { RolePermissionsInfo } from './role-management/RolePermissionsInfo';
import { useUserRolesData } from './role-management/useUserRolesData';

export const RoleManagement = () => {
  const { usersWithRoles, isLoading, refetchUsersWithRoles } = useUserRolesData();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement de la gestion des rôles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AddUserRoleForm onRoleAdded={refetchUsersWithRoles} />
      <UserRolesList 
        usersWithRoles={usersWithRoles} 
        onRoleRemoved={refetchUsersWithRoles} 
      />
      <RolePermissionsInfo />
    </div>
  );
};
