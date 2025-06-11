
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CriteriaField {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  required: boolean;
  placeholder?: string;
  unit?: string;
  validation_rules?: Record<string, any>;
}

interface PricingCriteriaManagerProps {
  productTypeId: string;
  category: string;
}

export const PricingCriteriaManager: React.FC<PricingCriteriaManagerProps> = ({
  productTypeId,
  category
}) => {
  const [criteriaFields, setCriteriaFields] = useState<CriteriaField[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newField, setNewField] = useState<Partial<CriteriaField>>({
    type: 'text',
    required: false
  });

  const addNewField = () => {
    if (!newField.key || !newField.label) {
      toast.error('La clé et le libellé sont requis');
      return;
    }

    const field: CriteriaField = {
      id: `field_${Date.now()}`,
      key: newField.key!,
      label: newField.label!,
      type: newField.type || 'text',
      required: newField.required || false,
      placeholder: newField.placeholder,
      unit: newField.unit,
      options: newField.options,
      validation_rules: newField.validation_rules || {}
    };

    setCriteriaFields([...criteriaFields, field]);
    setNewField({ type: 'text', required: false });
    toast.success('Critère ajouté avec succès');
  };

  const removeField = (id: string) => {
    setCriteriaFields(criteriaFields.filter(field => field.id !== id));
    toast.success('Critère supprimé');
  };

  const updateField = (id: string, updates: Partial<CriteriaField>) => {
    setCriteriaFields(criteriaFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const saveConfiguration = async () => {
    try {
      // Ici, on sauvegarderait la configuration en base
      console.log('Saving criteria configuration:', {
        productTypeId,
        category,
        criteriaFields
      });
      toast.success('Configuration sauvegardée avec succès');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-brandBlue" />
              Gestion des critères de pricing - {category}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                size="sm"
              >
                {isEditing ? 'Terminer' : 'Modifier'}
              </Button>
              {isEditing && (
                <Button onClick={saveConfiguration} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Liste des critères existants */}
          <div className="space-y-4">
            <h3 className="font-medium">Critères configurés</h3>
            {criteriaFields.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun critère configuré</p>
            ) : (
              <div className="space-y-3">
                {criteriaFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{field.label}</span>
                        <Badge variant="outline">{field.type}</Badge>
                        {field.required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">Clé: {field.key}</p>
                      {field.unit && <p className="text-sm text-gray-600">Unité: {field.unit}</p>}
                      {field.options && (
                        <p className="text-sm text-gray-600">
                          Options: {field.options.join(', ')}
                        </p>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulaire d'ajout de nouveau critère */}
          {isEditing && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Ajouter un nouveau critère</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field-key">Clé du champ *</Label>
                    <Input
                      id="field-key"
                      placeholder="Ex: vehicle_power"
                      value={newField.key || ''}
                      onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="field-label">Libellé *</Label>
                    <Input
                      id="field-label"
                      placeholder="Ex: Puissance du véhicule"
                      value={newField.label || ''}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field-type">Type de champ</Label>
                    <Select
                      value={newField.type}
                      onValueChange={(value: any) => setNewField({ ...newField, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texte</SelectItem>
                        <SelectItem value="number">Nombre</SelectItem>
                        <SelectItem value="select">Liste déroulante</SelectItem>
                        <SelectItem value="boolean">Oui/Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="field-unit">Unité (optionnel)</Label>
                    <Input
                      id="field-unit"
                      placeholder="Ex: CV, ans, XOF"
                      value={newField.unit || ''}
                      onChange={(e) => setNewField({ ...newField, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    placeholder="Ex: Entrez la puissance en CV"
                    value={newField.placeholder || ''}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                  />
                </div>

                {newField.type === 'select' && (
                  <div>
                    <Label htmlFor="field-options">Options (une par ligne)</Label>
                    <Textarea
                      id="field-options"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      onChange={(e) => setNewField({
                        ...newField,
                        options: e.target.value.split('\n').filter(opt => opt.trim())
                      })}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="field-required"
                    checked={newField.required}
                    onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                  />
                  <Label htmlFor="field-required">Champ requis</Label>
                </div>

                <Button onClick={addNewField} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le critère
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
