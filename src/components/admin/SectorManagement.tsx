
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useSectors } from '@/hooks/useSectors';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const SectorManagement = () => {
  const { data: sectors, refetch } = useSectors();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSector, setEditingSector] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Shield',
    color: '#3B82F6',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Shield',
      color: '#3B82F6',
      is_active: true
    });
    setIsEditing(false);
    setEditingSector(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && editingSector) {
        const { error } = await supabase
          .from('sectors')
          .update(formData)
          .eq('id', editingSector.id);
        
        if (error) throw error;
        toast.success('Secteur mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('sectors')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Secteur créé avec succès');
      }
      
      resetForm();
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error('Error:', error);
    }
  };

  const handleEdit = (sector: any) => {
    setFormData({
      name: sector.name,
      slug: sector.slug,
      description: sector.description || '',
      icon: sector.icon || 'Shield',
      color: sector.color || '#3B82F6',
      is_active: sector.is_active
    });
    setEditingSector(sector);
    setIsEditing(true);
  };

  const handleDelete = async (sectorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) return;
    
    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', sectorId);
      
      if (error) throw error;
      toast.success('Secteur supprimé');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Modifier le secteur' : 'Ajouter un secteur'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nom du secteur"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <Input
                placeholder="Slug (ex: assurance)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
              
              <Input
                placeholder="Icône (ex: Shield)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
              
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <label>Secteur actif</label>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des secteurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectors?.map(sector => (
              <div key={sector.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  ></div>
                  <div>
                    <h3 className="font-semibold">{sector.name}</h3>
                    <p className="text-sm text-gray-500">{sector.slug} • {sector.is_active ? 'Actif' : 'Inactif'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(sector)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(sector.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
