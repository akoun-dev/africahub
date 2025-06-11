
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSector } from '@/hooks/useSectors';
import { useSectorCriteria } from '@/hooks/useSectorCriteria';
import { useCompanies } from '@/hooks/useCompanies';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SectorQuoteRequestFormProps {
  sectorSlug: string;
  preselectedProducts?: string[];
}

export const SectorQuoteRequestForm: React.FC<SectorQuoteRequestFormProps> = ({ 
  sectorSlug, 
  preselectedProducts = [] 
}) => {
  const { data: sector } = useSector(sectorSlug);
  const { data: criteria } = useSectorCriteria(sector?.id);
  const { data: companies } = useCompanies(sectorSlug);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    company_preferences: [] as string[],
    specific_data: {} as Record<string, any>,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCriteriaChange = (criteriaId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specific_data: {
        ...prev.specific_data,
        [criteriaId]: value
      }
    }));
  };

  const handleCompanyPreference = (companyId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      company_preferences: checked 
        ? [...prev.company_preferences, companyId]
        : prev.company_preferences.filter(id => id !== companyId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          ...formData,
          sector_slug: sectorSlug,
          insurance_type: sector?.name || 'Unknown',
          specific_data: {
            ...formData.specific_data,
            preselected_products: preselectedProducts,
            sector_criteria_responses: formData.specific_data
          }
        });

      if (error) throw error;

      toast.success('Demande de devis envoyée avec succès !');
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        company_preferences: [],
        specific_data: {},
      });
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCriteriaField = (criterion: any) => {
    const value = formData.specific_data[criterion.id] || '';
    
    switch (criterion.data_type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={criterion.id}
              checked={value === true}
              onCheckedChange={(checked) => 
                handleCriteriaChange(criterion.id, checked)
              }
            />
            <label htmlFor={criterion.id} className="text-sm font-medium">
              {criterion.name}
            </label>
          </div>
        );
      
      case 'number':
        return (
          <div>
            <label className="text-sm font-medium">
              {criterion.name} {criterion.unit && `(${criterion.unit})`}
              {criterion.is_required && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => handleCriteriaChange(criterion.id, parseFloat(e.target.value) || '')}
              placeholder={`Votre ${criterion.name.toLowerCase()}`}
              required={criterion.is_required}
            />
          </div>
        );
      
      case 'select':
        return (
          <div>
            <label className="text-sm font-medium">
              {criterion.name}
              {criterion.is_required && <span className="text-red-500">*</span>}
            </label>
            <Select value={value} onValueChange={(val) => handleCriteriaChange(criterion.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner ${criterion.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {criterion.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      default:
        return (
          <div>
            <label className="text-sm font-medium">
              {criterion.name}
              {criterion.is_required && <span className="text-red-500">*</span>}
            </label>
            <Input
              value={value}
              onChange={(e) => handleCriteriaChange(criterion.id, e.target.value)}
              placeholder={`Votre ${criterion.name.toLowerCase()}`}
              required={criterion.is_required}
            />
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle 
          className="text-white px-6 py-4 rounded-t-lg"
          style={{ backgroundColor: sector?.color }}
        >
          Demande de devis - {sector?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Pays <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ville</label>
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
          </div>

          {/* Sector-specific criteria */}
          {criteria && criteria.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations spécifiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criteria.map(criterion => (
                  <div key={criterion.id}>
                    {renderCriteriaField(criterion)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company preferences */}
          {companies && companies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Préférences de compagnies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map(company => (
                  <div key={company.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={company.id}
                      checked={formData.company_preferences.includes(company.id)}
                      onCheckedChange={(checked) => 
                        handleCompanyPreference(company.id, checked as boolean)
                      }
                    />
                    <label htmlFor={company.id} className="text-sm font-medium">
                      {company.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
            style={{ backgroundColor: sector?.color }}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande de devis'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
