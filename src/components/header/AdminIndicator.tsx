
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Crown, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { AdminUser } from '@/types';

const getRoleIcon = (adminUser: AdminUser) => {
  if (adminUser.roles.includes('super-admin')) {
    return <Crown className="h-3 w-3" />;
  }
  if (adminUser.roles.includes('admin')) {
    return <Shield className="h-3 w-3" />;
  }
  if (adminUser.roles.includes('moderator')) {
    return <UserCog className="h-3 w-3" />;
  }
  return <Shield className="h-3 w-3" />;
};

const getRoleColor = (adminUser: AdminUser): "default" | "secondary" | "destructive" | "outline" => {
  if (adminUser.roles.includes('super-admin')) {
    return 'destructive';
  }
  if (adminUser.roles.includes('admin')) {
    return 'default';
  }
  if (adminUser.roles.includes('moderator')) {
    return 'secondary';
  }
  return 'outline';
};

const getRoleLabel = (adminUser: AdminUser): string => {
  if (adminUser.roles.includes('super-admin')) {
    return 'Super Admin';
  }
  if (adminUser.roles.includes('admin')) {
    return 'Admin';
  }
  if (adminUser.roles.includes('moderator')) {
    return 'Modérateur';
  }
  return adminUser.roles[0] || 'Utilisateur';
};

export const AdminIndicator: React.FC = () => {
  const { adminUser, isAdmin, loading } = useAdminAuth();

  console.log('AdminIndicator render:', { isAdmin, adminUser: adminUser?.email, loading });

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!isAdmin || !adminUser) {
    console.log('AdminIndicator: Not showing - user is not admin');
    return null;
  }

  const handleAdminClick = (e: React.MouseEvent) => {
    console.log('Admin button clicked, navigating to /admin');
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={getRoleColor(adminUser)} className="flex items-center space-x-1">
        {getRoleIcon(adminUser)}
        <span className="text-xs">{getRoleLabel(adminUser)}</span>
      </Badge>
      <Link to="/admin" onClick={handleAdminClick}>
        <Button variant="outline" size="sm" className="flex items-center space-x-1">
          <Shield className="h-3 w-3" />
          <span className="hidden sm:inline">Admin</span>
        </Button>
      </Link>
    </div>
  );
};
