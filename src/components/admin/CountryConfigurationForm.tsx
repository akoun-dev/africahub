
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CountryConfiguration, 
  useCreateCountryConfiguration, 
  useUpdateCountryConfiguration,
  usePricingZones 
} from '@/hooks/useGeographicManagement';

interface CountryConfigurationFormProps {
  country?: CountryConfiguration | null;
  onSuccess: () => void;
}

const CURRENCIES = [
  { code: 'USD', name: 'Dollar américain' },
  { code: 'EUR', name: 'Euro' },
  { code: 'NGN', name: 'Naira nigérian' },
  { code: 'ZAR', name: 'Rand sud-africain' },
  { code: 'KES', name: 'Shilling kényan' },
  { code: 'GHS', name: 'Cedi ghanéen' },
  { code: 'XOF', name: 'Franc CFA (BCEAO)' },
  { code: 'XAF', name: 'Franc CFA (BEAC)' },
  { code: 'EGP', name: 'Livre égyptienne' },
  { code: 'MAD', name: 'Dirham marocain' },
  { code: 'TZS', name: 'Shilling tanzanien' },
  { code: 'ETB', name: 'Birr éthiopien' }
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'am', name: 'አማርኛ' }
];

export const CountryConfigurationForm: React.FC<CountryConfigurationFormProps> = ({
  country,
  onSuccess
}) => {
  const { data: pricingZones } = usePricingZones();
  const createCountry = useCreateCountryConfiguration();
  const updateCountry = useUpdateCountryConfiguration();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      country_code: country?.country_code || '',
      country_name: country?.country_name || '',
      is_active: country?.is_active || false,
      currency_code: country?.currency_code || 'USD',
      timezone: country?.timezone || '',
      language_code: country?.language_code || 'en',
      pricing_zone: country?.pricing_zone || 'STANDARD',
      date_format: country?.date_format || 'DD/MM/YYYY',
      number_format: country?.number_format || 'en-US',
      regulatory_requirements: JSON.stringify(country?.regulatory_requirements || {}, null, 2),
      commission_rates: JSON.stringify(country?.commission_rates || {}, null, 2),
      email_templates: JSON.stringify(country?.email_templates || {}, null, 2),
      form_configurations: JSON.stringify(country?.form_configurations || {}, null, 2)
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        regulatory_requirements: JSON.parse(data.regulatory_requirements || '{}'),
        commission_rates: JSON.parse(data.commission_rates || '{}'),
        email_templates: JSON.parse(data.email_templates || '{}'),
        form_configurations: JSON.parse(data.form_configurations || '{}')
      };

      if (country) {
        await updateCountry.mutateAsync({ id: country.id, ...formData });
      } else {
        await createCountry.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving country configuration:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country_code">Code pays</Label>
          <Input
            id="country_code"
            {...register('country_code', { required: 'Code pays requis' })}
            placeholder="NG, SN, ZA..."
            maxLength={2}
          />
          {errors.country_code && (
            <p className="text-sm text-red-600">{errors.country_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country_name">Nom du pays</Label>
          <Input
            id="country_name"
            {...register('country_name', { required: 'Nom du pays requis' })}
            placeholder="Nigeria, Sénégal..."
          />
          {errors.country_name && (
            <p className="text-sm text-red-600">{errors.country_name.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={watch('is_active')}
          onCheckedChange={(checked) => setValue('is_active', checked)}
        />
        <Label>Pays actif</Label>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration régionale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise</Label>
              <Select value={watch('currency_code')} onValueChange={(value) => setValue('currency_code', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={watch('language_code')} onValueChange={(value) => setValue('language_code', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(language => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Input
                id="timezone"
                {...register('timezone')}
                placeholder="Africa/Lagos, Africa/Dakar..."
              />
            </div>

            <div className="space-y-2">
              <Label>Zone de tarification</Label>
              <Select value={watch('pricing_zone')} onValueChange={(value) => setValue('pricing_zone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pricingZones?.map(zone => (
                    <SelectItem key={zone.zone_code} value={zone.zone_code}>
                      {zone.zone_name} (x{zone.base_multiplier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration avancée</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="regulatory_requirements">Exigences réglementaires (JSON)</Label>
            <Textarea
              id="regulatory_requirements"
              {...register('regulatory_requirements')}
              placeholder='{"insurance_license_required": true, "minimum_capital": 1000000}'
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commission_rates">Taux de commission (JSON)</Label>
            <Textarea
              id="commission_rates"
              {...register('commission_rates')}
              placeholder='{"auto": 5.0, "health": 7.5, "life": 10.0}'
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          {country ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
