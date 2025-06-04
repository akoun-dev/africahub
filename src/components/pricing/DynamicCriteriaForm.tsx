
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Car, Shield, Heart, Home, Plane } from 'lucide-react';
import { DynamicPriceDisplay } from './DynamicPriceDisplay';
import type { Product } from '@/types/core/Product';

interface CriteriaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  required: boolean;
  placeholder?: string;
  unit?: string;
}

interface DynamicCriteriaFormProps {
  product: Product;
  onCriteriaChange?: (criteria: Record<string, any>) => void;
  autoCalculate?: boolean;
}

const getCriteriaFields = (category: string): CriteriaField[] => {
  switch (category) {
    case 'auto':
      return [
        { key: 'vehicle_power', label: 'Puissance du véhicule', type: 'number', required: true, unit: 'CV', placeholder: 'Ex: 120' },
        { key: 'purchase_year', label: 'Année d\'achat', type: 'number', required: true, placeholder: 'Ex: 2020' },
        { key: 'vehicle_value', label: 'Valeur vénale', type: 'number', required: true, unit: 'XOF', placeholder: 'Ex: 15000000' },
        { key: 'coverage_type', label: 'Type de couverture', type: 'select', required: true, options: ['Tiers simple', 'Tiers étendu', 'Tous risques'] },
        { key: 'driver_age', label: 'Âge du conducteur', type: 'number', required: true, unit: 'ans', placeholder: 'Ex: 35' },
        { key: 'driving_experience', label: 'Années de conduite', type: 'number', required: false, unit: 'ans', placeholder: 'Ex: 10' },
        { key: 'accident_history', label: 'Historique d\'accidents', type: 'select', required: false, options: ['Aucun', '1 accident', '2+ accidents'] }
      ];
    
    case 'health':
      return [
        { key: 'age', label: 'Âge', type: 'number', required: true, unit: 'ans', placeholder: 'Ex: 30' },
        { key: 'family_size', label: 'Taille famille', type: 'number', required: true, placeholder: 'Ex: 4' },
        { key: 'coverage_level', label: 'Niveau de couverture', type: 'select', required: true, options: ['Base', 'Intermédiaire', 'Premium'] },
        { key: 'chronic_conditions', label: 'Conditions chroniques', type: 'boolean', required: false },
        { key: 'smoking_status', label: 'Statut fumeur', type: 'select', required: false, options: ['Non-fumeur', 'Fumeur occasionnel', 'Fumeur régulier'] }
      ];
    
    case 'home':
      return [
        { key: 'property_value', label: 'Valeur du bien', type: 'number', required: true, unit: 'XOF', placeholder: 'Ex: 50000000' },
        { key: 'property_type', label: 'Type de bien', type: 'select', required: true, options: ['Appartement', 'Maison', 'Villa', 'Duplex'] },
        { key: 'construction_year', label: 'Année de construction', type: 'number', required: true, placeholder: 'Ex: 2015' },
        { key: 'security_level', label: 'Niveau de sécurité', type: 'select', required: false, options: ['Standard', 'Renforcé', 'Maximum'] },
        { key: 'location_risk', label: 'Zone à risque', type: 'select', required: true, options: ['Faible', 'Moyen', 'Élevé'] }
      ];
    
    case 'travel':
      return [
        { key: 'trip_duration', label: 'Durée du voyage', type: 'number', required: true, unit: 'jours', placeholder: 'Ex: 14' },
        { key: 'destination', label: 'Destination', type: 'select', required: true, options: ['Afrique', 'Europe', 'Amérique', 'Asie', 'Océanie'] },
        { key: 'traveler_age', label: 'Âge du voyageur', type: 'number', required: true, unit: 'ans', placeholder: 'Ex: 28' },
        { key: 'trip_type', label: 'Type de voyage', type: 'select', required: true, options: ['Touristique', 'Professionnel', 'Étudiant', 'Médical'] },
        { key: 'coverage_amount', label: 'Montant de couverture', type: 'select', required: true, options: ['50000€', '100000€', '200000€', '500000€'] }
      ];
    
    default:
      return [
        { key: 'coverage_amount', label: 'Montant de couverture', type: 'number', required: true, unit: 'XOF' },
        { key: 'risk_level', label: 'Niveau de risque', type: 'select', required: true, options: ['Faible', 'Moyen', 'Élevé'] }
      ];
  }
};

const getIcon = (category: string) => {
  switch (category) {
    case 'auto': return Car;
    case 'health': return Heart;
    case 'home': return Home;
    case 'travel': return Plane;
    default: return Shield;
  }
};

export const DynamicCriteriaForm: React.FC<DynamicCriteriaFormProps> = ({
  product,
  onCriteriaChange,
  autoCalculate = false
}) => {
  const [criteria, setCriteria] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const criteriaFields = getCriteriaFields(product.category);
  const Icon = getIcon(product.category);

  useEffect(() => {
    validateForm();
  }, [criteria]);

  useEffect(() => {
    if (onCriteriaChange) {
      onCriteriaChange(criteria);
    }
  }, [criteria, onCriteriaChange]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let valid = true;

    criteriaFields.forEach(field => {
      if (field.required && (!criteria[field.key] || criteria[field.key] === '')) {
        errors[field.key] = `${field.label} est requis`;
        valid = false;
      }

      if (field.type === 'number' && criteria[field.key] && isNaN(Number(criteria[field.key]))) {
        errors[field.key] = `${field.label} doit être un nombre valide`;
        valid = false;
      }
    });

    setValidationErrors(errors);
    setIsFormValid(valid);
  };

  const handleFieldChange = (key: string, value: any) => {
    setCriteria(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderField = (field: CriteriaField) => {
    const hasError = validationErrors[field.key];

    switch (field.type) {
      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="flex items-center gap-2">
              {field.label}
              {field.required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
            </Label>
            <Select onValueChange={(value) => handleFieldChange(field.key, value)}>
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-red-500 text-xs">{hasError}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.key} className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
            </Label>
            <Select onValueChange={(value) => handleFieldChange(field.key, value === 'true')}>
              <SelectTrigger className={hasError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Non</SelectItem>
                <SelectItem value="true">Oui</SelectItem>
              </SelectContent>
            </Select>
            {hasError && <p className="text-red-500 text-xs">{hasError}</p>}
          </div>
        );

      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="flex items-center gap-2">
              {field.label}
              {field.unit && <span className="text-sm text-gray-500">({field.unit})</span>}
              {field.required && <Badge variant="secondary" className="text-xs">Requis</Badge>}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={criteria[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && <p className="text-red-500 text-xs">{hasError}</p>}
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-brandBlue" />
          Critères de calcul - {product.name}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Renseignez vos informations pour obtenir un prix personnalisé
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteriaFields.map(renderField)}
        </div>

        {isFormValid && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <DynamicPriceDisplay
              product={product}
              userCriteria={criteria}
              autoCalculate={autoCalculate}
            />
          </div>
        )}

        {!isFormValid && Object.keys(criteria).length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-700">
                Veuillez remplir tous les champs requis pour calculer le prix
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
