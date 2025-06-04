
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComparisonCriteria } from '@/hooks/useComparisonCriteria';
import { useProductTypes } from '@/hooks/useProductTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const CriteriaManagement = () => {
  const { data: productTypes } = useProductTypes();
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const { data: criteria, refetch } = useComparisonCriteria(selectedProductType);
  
  const [formData, setFormData] = useState({
    name: '',
    data_type: 'text' as 'text' | 'number' | 'boolean' | 'select',
    unit: '',
    product_type_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('comparison_criteria')
        .insert([{
          ...formData,
          product_type_id: selectedProductType
        }]);
      
      if (error) throw error;
      
      toast.success('Critère ajouté avec succès');
      setFormData({
        name: '',
        data_type: 'text',
        unit: '',
        product_type_id: ''
      });
      refetch();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du critère');
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des critères de comparaison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedProductType} onValueChange={setSelectedProductType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de produit" />
              </SelectTrigger>
              <SelectContent>
                {productTypes?.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProductType && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nom du critère"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  
                  <Select value={formData.data_type} onValueChange={(value: any) => setFormData({ ...formData, data_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de données" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="number">Nombre</SelectItem>
                      <SelectItem value="boolean">Oui/Non</SelectItem>
                      <SelectItem value="select">Liste</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Unité (optionnel)"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
                
                <Button type="submit">Ajouter le critère</Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedProductType && criteria && (
        <Card>
          <CardHeader>
            <CardTitle>Critères existants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criteria.map(criterion => (
                <div key={criterion.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <span className="font-medium">{criterion.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({criterion.data_type}{criterion.unit && ` - ${criterion.unit}`})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
