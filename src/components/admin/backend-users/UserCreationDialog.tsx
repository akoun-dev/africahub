
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BackendUser } from '@/types';

interface UserCreationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: Omit<BackendUser, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const UserCreationDialog = ({ isOpen, onOpenChange, onCreateUser }: UserCreationDialogProps) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '' as 'super-admin' | 'admin' | 'moderator' | '',
    country_code: '',
    permissions: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.role) return;

    setLoading(true);
    try {
      await onCreateUser({
        email: formData.email,
        name: formData.name,
        role: formData.role as 'super-admin' | 'admin' | 'moderator',
        country_code: formData.country_code || undefined,
        is_active: true,
        permissions: formData.permissions
      });
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        role: '' as any,
        country_code: '',
        permissions: []
      });
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un utilisateur backend</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email *</Label>
            <Input 
              id="user-email" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="admin@africahub.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-name">Nom complet *</Label>
            <Input 
              id="user-name" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nom de l'utilisateur"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Rôle *</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super-admin">Super Administrateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="moderator">Modérateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Pays d'attribution</Label>
            <Select value={formData.country_code} onValueChange={(value) => setFormData(prev => ({ ...prev, country_code: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les pays</SelectItem>
                <SelectItem value="SN">Sénégal</SelectItem>
                <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                <SelectItem value="MA">Maroc</SelectItem>
                <SelectItem value="NG">Nigeria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer l\'utilisateur'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
