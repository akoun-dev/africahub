
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { useProductTypes } from '@/hooks/useProductTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Criterion {
  id: string;
  name: string;
  data_type: string;
  unit?: string;
  product_type_id: string;
}

export const ProductCriteriaManager = () => {
  const { data: productTypes } = useProductTypes();
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCriterion, setNewCriterion] = useState({
    name: '',
    data_type: 'text',
    unit: '',
    product_type_id: ''
  });

  const fetchCriteria = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('comparison_criteria')
        .select('*')
        .order('name');

      if (error) throw error;
      setCriteria(data || []);
    } catch (error) {
      console.error('Error fetching criteria:', error);
      toast.error('Erreur lors du chargement des critères');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCriteria();
  }, []);

  const addCriterion = async () => {
    if (!newCriterion.name || !newCriterion.product_type_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('comparison_criteria')
        .insert([newCriterion]);

      if (error) throw error;

      toast.success('Critère ajouté avec succès');
      setNewCriterion({ name: '', data_type: 'text', unit: '', product_type_id: '' });
      fetchCriteria();
    } catch (error) {
      console.error('Error adding criterion:', error);
      toast.error('Erreur lors de l\'ajout du critère');
    }
  };

  const deleteCriterion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comparison_criteria')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Critère supprimé avec succès');
      fetchCriteria();
    } catch (error) {
      console.error('Error deleting criterion:', error);
      toast.error('Erreur lors de la suppression du critère');
    }
  };

  const getProductTypeName = (productTypeId: string) => {
    return productTypes?.find(pt => pt.id === productTypeId)?.name || 'Type inconnu';
  };

  if (isLoading) {
    return <div>Chargement des critères...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau critère</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du critère</Label>
              <Input
                id="name"
                value={newCriterion.name}
                onChange={(e) => setNewCriterion(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Autonomie de la batterie"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_type">Type de données</Label>
              <Select 
                value={newCriterion.data_type} 
                onValueChange={(value) => setNewCriterion(prev => ({ ...prev, data_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="number">Nombre</SelectItem>
                  <SelectItem value="boolean">Oui/Non</SelectItem>
                  <SelectItem value="select">Liste de choix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unité (optionnel)</Label>
              <Input
                id="unit"
                value={newCriterion.unit}
                onChange={(e) => setNewCriterion(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="Ex: heures, km, %"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type">Type de produit</Label>
              <Select 
                value={newCriterion.product_type_id} 
                onValueChange={(value) => setNewCriterion(prev => ({ ...prev, product_type_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes?.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addCriterion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le critère
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critères existants ({criteria.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium">{criterion.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getProductTypeName(criterion.product_type_id)} • {criterion.data_type}
                      {criterion.unit && ` • ${criterion.unit}`}
                    </p>
                  </div>
                  <Badge variant="outline">{criterion.data_type}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteCriterion(criterion.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {criteria.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun critère trouvé. Ajoutez un critère pour commencer.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
