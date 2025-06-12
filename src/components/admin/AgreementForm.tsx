
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCompanies } from '@/hooks/useCompanies';
import { useSectors } from '@/hooks/useSectors';
import { useCreateAgreement, PartnerAgreement } from '@/hooks/usePartnerAgreements';

const AFRICAN_COUNTRIES = [
  { code: 'SN', name: 'Sénégal' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'MA', name: 'Maroc' },
  { code: 'EG', name: 'Égypte' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'ET', name: 'Éthiopie' }
];

interface AgreementFormProps {
  onSuccess?: () => void;
}

type FormData = Omit<PartnerAgreement, 'id' | 'created_at' | 'updated_at' | 'companies'>;

export const AgreementForm: React.FC<AgreementFormProps> = ({ onSuccess }) => {
  const { data: companies } = useCompanies();
  const { data: sectors } = useSectors();
  const createAgreement = useCreateAgreement();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      agreement_type: 'standard',
      status: 'draft',
      commission_rate: 0,
      revenue_share: 0,
      minimum_volume: 0,
      auto_activate: true,
      sector_ids: [],
      product_type_ids: []
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createAgreement.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating agreement:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_id">Société</Label>
          <Select onValueChange={(value) => setValue('company_id', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une société" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country_code">Pays</Label>
          <Select onValueChange={(value) => setValue('country_code', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              {AFRICAN_COUNTRIES.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agreement_type">Type d'accord</Label>
          <Select onValueChange={(value) => setValue('agreement_type', value as any)} defaultValue="standard">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="exclusive">Exclusif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission_rate">Taux de commission (%)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('commission_rate', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue_share">Partage de revenus (%)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('revenue_share', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signature_date">Date de signature</Label>
          <Input
            type="date"
            {...register('signature_date', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            type="date"
            {...register('start_date', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            type="date"
            {...register('end_date')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signed_by">Signé par</Label>
          <Input {...register('signed_by')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_reference">Référence contrat</Label>
          <Input {...register('contract_reference')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minimum_volume">Volume minimum</Label>
        <Input
          type="number"
          min="0"
          {...register('minimum_volume', { valueAsNumber: true })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          onCheckedChange={(checked) => setValue('auto_activate', checked)}
          defaultChecked={true}
        />
        <Label>Activation automatique</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea {...register('notes')} rows={3} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit" disabled={createAgreement.isPending}>
          {createAgreement.isPending ? 'Création...' : 'Créer l\'accord'}
        </Button>
      </div>
    </form>
  );
};
