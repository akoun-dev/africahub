
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  {
    value: 'light',
    label: 'Clair',
    icon: Sun,
    description: 'Thème clair pour une meilleure lisibilité en journée'
  },
  {
    value: 'dark',
    label: 'Sombre',
    icon: Moon,
    description: 'Thème sombre pour réduire la fatigue oculaire'
  },
  {
    value: 'system',
    label: 'Système',
    icon: Monitor,
    description: 'Suit automatiquement les préférences de votre système'
  }
];

export const ThemeSettings: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const currentTheme = profile?.theme || 'light';

  const handleThemeChange = async (theme: string) => {
    try {
      await updateProfile.mutateAsync({ theme });
      toast({
        title: "Thème mis à jour",
        description: `Le thème ${theme === 'light' ? 'clair' : theme === 'dark' ? 'sombre' : 'système'} a été appliqué`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le thème",
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
        <CardTitle>Apparence</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'interface
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Choisir un thème</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.value;
              
              return (
                <Card 
                  key={theme.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleThemeChange(theme.value)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <h4 className={`font-medium mb-1 ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {theme.label}
                    </h4>
                    <p className={`text-xs ${
                      isSelected ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {theme.description}
                    </p>
                    {isSelected && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Sélectionné
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Aperçu du thème actuel
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-16 h-10 bg-white border rounded shadow-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Thème: <span className="font-medium">
                  {themes.find(t => t.value === currentTheme)?.label}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {themes.find(t => t.value === currentTheme)?.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
