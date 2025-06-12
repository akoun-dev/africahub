
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Globe, DollarSign, Clock } from 'lucide-react';

const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

const currencies = [
  { value: 'XOF', label: 'Franc CFA (XOF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar US (USD)' },
  { value: 'MAD', label: 'Dirham marocain (MAD)' },
  { value: 'TND', label: 'Dinar tunisien (TND)' },
];

const timezones = [
  { value: 'UTC', label: 'UTC (Temps universel)' },
  { value: 'Africa/Abidjan', label: 'Afrique/Abidjan (GMT)' },
  { value: 'Africa/Casablanca', label: 'Afrique/Casablanca (GMT+1)' },
  { value: 'Africa/Cairo', label: 'Afrique/Le Caire (GMT+2)' },
  { value: 'Africa/Lagos', label: 'Afrique/Lagos (GMT+1)' },
];

export const LanguageRegionSettings: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = async (field: string, value: string) => {
    try {
      await updateProfile.mutateAsync({ [field]: value });
      toast({
        title: "Préférences mises à jour",
        description: "Vos paramètres régionaux ont été sauvegardés",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Langue et région</CardTitle>
        <CardDescription>
          Configurez vos préférences de langue, devise et fuseau horaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Label>Langue préférée</Label>
            </div>
            <Select
              value={profile?.default_language || 'fr'}
              onValueChange={(value) => handleUpdate('default_language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une langue" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <Label>Devise par défaut</Label>
            </div>
            <Select
              value={profile?.default_currency || 'XOF'}
              onValueChange={(value) => handleUpdate('default_currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une devise" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <Label>Fuseau horaire</Label>
          </div>
          <Select
            value={profile?.timezone || 'UTC'}
            onValueChange={(value) => handleUpdate('timezone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un fuseau horaire" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Informations régionales
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• La langue affecte l'interface utilisateur</p>
            <p>• La devise est utilisée pour l'affichage des prix</p>
            <p>• Le fuseau horaire affecte les dates et heures</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
