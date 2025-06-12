
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Eye, Type, Volume2 } from 'lucide-react';

export const AccessibilitySettings: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const accessibilitySettings = profile?.accessibility_settings || {};

  const handleToggle = async (key: string, value: boolean) => {
    const newSettings = { ...accessibilitySettings, [key]: value };
    try {
      await updateProfile.mutateAsync({ accessibility_settings: newSettings });
      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences d'accessibilité ont été sauvegardées",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleSelect = async (key: string, value: string) => {
    const newSettings = { ...accessibilitySettings, [key]: value };
    try {
      await updateProfile.mutateAsync({ accessibility_settings: newSettings });
      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences d'accessibilité ont été sauvegardées",
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
        <CardTitle>Accessibilité</CardTitle>
        <CardDescription>
          Personnalisez l'interface pour une meilleure accessibilité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <h3 className="text-sm font-medium">Options visuelles</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-sm">
                Mode contraste élevé
              </Label>
              <Switch
                id="high-contrast"
                checked={accessibilitySettings.highContrast === true}
                onCheckedChange={(checked) => handleToggle('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="text-sm">
                Texte agrandi
              </Label>
              <Switch
                id="large-text"
                checked={accessibilitySettings.largeText === true}
                onCheckedChange={(checked) => handleToggle('largeText', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion" className="text-sm">
                Réduire les animations
              </Label>
              <Switch
                id="reduce-motion"
                checked={accessibilitySettings.reduceMotion === true}
                onCheckedChange={(checked) => handleToggle('reduceMotion', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <h3 className="text-sm font-medium">Taille de police</h3>
          </div>
          
          <div className="ml-6">
            <Select
              value={accessibilitySettings.fontSize || 'normal'}
              onValueChange={(value) => handleSelect('fontSize', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
                <SelectItem value="extra-large">Très grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <h3 className="text-sm font-medium">Options audio</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="text-sm">
                Support lecteur d'écran
              </Label>
              <Switch
                id="screen-reader"
                checked={accessibilitySettings.screenReader === true}
                onCheckedChange={(checked) => handleToggle('screenReader', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="audio-descriptions" className="text-sm">
                Descriptions audio
              </Label>
              <Switch
                id="audio-descriptions"
                checked={accessibilitySettings.audioDescriptions === true}
                onCheckedChange={(checked) => handleToggle('audioDescriptions', checked)}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            À propos de l'accessibilité
          </h4>
          <p className="text-xs text-blue-700">
            Nous nous engageons à rendre notre plateforme accessible à tous. 
            Ces paramètres vous aident à personnaliser votre expérience selon vos besoins.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
