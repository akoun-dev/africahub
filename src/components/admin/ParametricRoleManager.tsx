
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit3, Trash2, Shield, Key, Users, Save, X } from 'lucide-react';

interface RoleDefinition {
  id: string;
  name: string;
  display_name: string;
  description: string;
  level: number;
  color: string;
  is_system_role: boolean;
  is_active: boolean;
  permissions?: PermissionDefinition[];
}

interface PermissionDefinition {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: string;
  is_active: boolean;
}

export const ParametricRoleManager: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<PermissionDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [editingPermission, setEditingPermission] = useState<PermissionDefinition | null>(null);
  const [showNewRole, setShowNewRole] = useState(false);
  const [showNewPermission, setShowNewPermission] = useState(false);

  const fetchRoles = async () => {
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('role_definitions')
        .select('*')
        .order('level', { ascending: false });

      if (rolesError) throw rolesError;

      // Récupérer les permissions pour chaque rôle
      const rolesWithPermissions = await Promise.all(
        (rolesData || []).map(async (role) => {
          const { data: permissionsData } = await supabase
            .from('role_permissions')
            .select(`
              permission_definitions (
                id, name, display_name, description, category, is_active
              )
            `)
            .eq('role_id', role.id);

          return {
            ...role,
            permissions: permissionsData?.map(p => p.permission_definitions).flat() || []
          };
        })
      );

      setRoles(rolesWithPermissions);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      toast.error('Erreur lors du chargement des rôles');
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permission_definitions')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error);
      toast.error('Erreur lors du chargement des permissions');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRoles(), fetchPermissions()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const saveRole = async (roleData: Partial<RoleDefinition>) => {
    try {
      // Validation des champs requis
      if (!roleData.name || !roleData.display_name) {
        toast.error('Le nom et le nom d\'affichage sont requis');
        return;
      }

      // Préparer les données pour l'insertion/mise à jour
      const insertData = {
        name: roleData.name,
        display_name: roleData.display_name,
        description: roleData.description || '',
        level: roleData.level || 0,
        color: roleData.color || '#3B82F6',
        is_active: roleData.is_active ?? true
      };

      if (editingRole) {
        const { error } = await supabase
          .from('role_definitions')
          .update(insertData)
          .eq('id', editingRole.id);
        
        if (error) throw error;
        toast.success('Rôle mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('role_definitions')
          .insert(insertData);
        
        if (error) throw error;
        toast.success('Rôle créé avec succès');
      }
      
      setEditingRole(null);
      setShowNewRole(false);
      fetchRoles();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du rôle');
    }
  };

  const savePermission = async (permissionData: Partial<PermissionDefinition>) => {
    try {
      // Validation des champs requis
      if (!permissionData.name || !permissionData.display_name) {
        toast.error('Le nom et le nom d\'affichage sont requis');
        return;
      }

      // Préparer les données pour l'insertion/mise à jour
      const insertData = {
        name: permissionData.name,
        display_name: permissionData.display_name,
        description: permissionData.description || '',
        category: permissionData.category || 'general',
        is_active: permissionData.is_active ?? true
      };

      if (editingPermission) {
        const { error } = await supabase
          .from('permission_definitions')
          .update(insertData)
          .eq('id', editingPermission.id);
        
        if (error) throw error;
        toast.success('Permission mise à jour avec succès');
      } else {
        const { error } = await supabase
          .from('permission_definitions')
          .insert(insertData);
        
        if (error) throw error;
        toast.success('Permission créée avec succès');
      }
      
      setEditingPermission(null);
      setShowNewPermission(false);
      fetchPermissions();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la permission');
    }
  };

  const toggleRolePermission = async (roleId: string, permissionId: string, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permissionId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_permissions')
          .insert({ role_id: roleId, permission_id: permissionId });
        
        if (error) throw error;
      }
      
      fetchRoles();
    } catch (error) {
      console.error('Erreur lors de la modification des permissions:', error);
      toast.error('Erreur lors de la modification des permissions');
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;
    
    try {
      const { error } = await supabase
        .from('role_definitions')
        .delete()
        .eq('id', roleId);
      
      if (error) throw error;
      toast.success('Rôle supprimé avec succès');
      fetchRoles();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du rôle');
    }
  };

  const RoleForm = ({ role, onSave, onCancel }: {
    role?: RoleDefinition;
    onSave: (data: Partial<RoleDefinition>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: role?.name || '',
      display_name: role?.display_name || '',
      description: role?.description || '',
      level: role?.level || 0,
      color: role?.color || '#3B82F6',
      is_active: role?.is_active ?? true
    });

    const handleSubmit = () => {
      if (!formData.name.trim() || !formData.display_name.trim()) {
        toast.error('Le nom et le nom d\'affichage sont requis');
        return;
      }
      onSave(formData);
    };

    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nom du rôle *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="admin, moderator..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nom d'affichage *</label>
            <Input
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Administrateur, Modérateur..."
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description du rôle..."
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Niveau (0-100)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Couleur</label>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <label className="text-sm">Actif</label>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      </div>
    );
  };

  const PermissionForm = ({ permission, onSave, onCancel }: {
    permission?: PermissionDefinition;
    onSave: (data: Partial<PermissionDefinition>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: permission?.name || '',
      display_name: permission?.display_name || '',
      description: permission?.description || '',
      category: permission?.category || 'general',
      is_active: permission?.is_active ?? true
    });

    const handleSubmit = () => {
      if (!formData.name.trim() || !formData.display_name.trim()) {
        toast.error('Le nom et le nom d\'affichage sont requis');
        return;
      }
      onSave(formData);
    };

    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nom de la permission *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="manage_users, view_analytics..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nom d'affichage *</label>
            <Input
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Gérer les utilisateurs..."
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la permission..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Utilisateurs</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="analytics">Analyses</SelectItem>
                <SelectItem value="content">Contenu</SelectItem>
                <SelectItem value="technical">Technique</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="general">Général</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <label className="text-sm">Actif</label>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      </div>
    );
  };

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des Rôles Paramétrables
          </CardTitle>
          <p className="text-sm text-gray-600">
            Créez et gérez des rôles personnalisés avec des permissions spécifiques
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">Rôles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Rôles disponibles</h3>
                <Button onClick={() => setShowNewRole(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau rôle
                </Button>
              </div>

              {showNewRole && (
                <RoleForm
                  onSave={saveRole}
                  onCancel={() => setShowNewRole(false)}
                />
              )}

              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    {editingRole?.id === role.id ? (
                      <RoleForm
                        role={editingRole}
                        onSave={saveRole}
                        onCancel={() => setEditingRole(null)}
                      />
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Badge 
                              style={{ backgroundColor: role.color }}
                              className="text-white"
                            >
                              {role.display_name}
                            </Badge>
                            <div>
                              <p className="font-medium">{role.name}</p>
                              <p className="text-sm text-gray-600">{role.description}</p>
                              <p className="text-xs text-gray-500">Niveau: {role.level}</p>
                            </div>
                            {role.is_system_role && (
                              <Badge variant="secondary">Système</Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRole(role)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            {!role.is_system_role && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteRole(role.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Permissions assignées:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {permissions.map((permission) => {
                              const hasPermission = role.permissions?.some(p => p.id === permission.id);
                              return (
                                <label key={permission.id} className="flex items-center space-x-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={hasPermission}
                                    onChange={() => toggleRolePermission(role.id, permission.id, hasPermission || false)}
                                  />
                                  <span>{permission.display_name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Permissions disponibles</h3>
                <Button onClick={() => setShowNewPermission(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle permission
                </Button>
              </div>

              {showNewPermission && (
                <PermissionForm
                  onSave={savePermission}
                  onCancel={() => setShowNewPermission(false)}
                />
              )}

              <div className="grid gap-4">
                {Object.entries(
                  permissions.reduce((acc, permission) => {
                    const category = permission.category || 'general';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(permission);
                    return acc;
                  }, {} as Record<string, PermissionDefinition[]>)
                ).map(([category, categoryPermissions]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 capitalize">{category}</h4>
                    <div className="space-y-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{permission.display_name}</p>
                            <p className="text-sm text-gray-600">{permission.description}</p>
                            <p className="text-xs text-gray-500">Code: {permission.name}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPermission(permission)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
