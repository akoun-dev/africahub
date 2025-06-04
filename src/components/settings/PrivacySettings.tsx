
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Shield, Download, Trash2 } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const privacySettings = profile?.privacy_settings || {};

  const handleToggle = async (key: string, value: boolean) => {
    const newSettings = { ...privacySettings, [key]: value };
    try {
      await updateProfile.mutateAsync({ privacy_settings: newSettings });
      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences de confidentialité ont été sauvegardées",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
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
        <CardTitle>Confidentialité et sécurité</CardTitle>
        <CardDescription>
          Contrôlez vos données personnelles et votre confidentialité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <h3 className="text-sm font-medium">Paramètres de confidentialité</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="text-sm">
                Autoriser l'analyse d'utilisation
              </Label>
              <Switch
                id="analytics"
                checked={privacySettings.analytics !== false}
                onCheckedChange={(checked) => handleToggle('analytics', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility" className="text-sm">
                Profil visible par les autres utilisateurs
              </Label>
              <Switch
                id="profile-visibility"
                checked={privacySettings.profileVisibility !== false}
                onCheckedChange={(checked) => handleToggle('profileVisibility', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing" className="text-sm">
                Partager les données avec les partenaires
              </Label>
              <Switch
                id="data-sharing"
                checked={privacySettings.dataSharing === true}
                onCheckedChange={(checked) => handleToggle('dataSharing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="personalization" className="text-sm">
                Personnalisation basée sur l'activité
              </Label>
              <Switch
                id="personalization"
                checked={privacySettings.personalization !== false}
                onCheckedChange={(checked) => handleToggle('personalization', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Gestion des données</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Exporter vos données</p>
                <p className="text-xs text-gray-500">
                  Téléchargez une copie de toutes vos données
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Supprimer le compte</p>
                <p className="text-xs text-gray-500">
                  Supprime définitivement votre compte et toutes vos données
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">
            À propos de vos données
          </h4>
          <p className="text-xs text-yellow-700">
            Nous prenons votre confidentialité au sérieux. Consultez notre politique de 
            confidentialité pour en savoir plus sur la façon dont nous utilisons et 
            protégeons vos données.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
