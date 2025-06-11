
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Check, X, ExternalLink, Save, TestTube, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { validateMapboxToken } from '@/utils/mapboxConfig';
import { useToast } from '@/hooks/use-toast';

export const MapboxConfiguration = () => {
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentToken();
  }, []);

  const loadCurrentToken = async () => {
    try {
      setIsLoading(true);
      setSaveError(null);
      
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      
      if (error) {
        console.error('Error loading Mapbox token:', error);
        setSaveError('Erreur lors du chargement de la configuration');
        return;
      }
      
      if (data?.token) {
        setCurrentToken(data.token);
        setToken(data.token);
        setIsValid(validateMapboxToken(data.token));
      }
    } catch (error) {
      console.error('Error loading Mapbox token:', error);
      setSaveError('Erreur lors du chargement de la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
    setSaveError(null);
    if (value) {
      setIsValid(validateMapboxToken(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSaveToken = async () => {
    if (!token || !isValid) {
      toast({
        title: "Token invalide",
        description: "Veuillez entrer un token Mapbox valide (commençant par 'pk.' et d'au moins 50 caractères)",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setSaveError(null);
      
      console.log('💾 Saving Mapbox token...');
      
      const { data, error } = await supabase.functions.invoke('save-mapbox-token', {
        body: { token }
      });

      if (error) {
        console.error('Error saving token:', error);
        setSaveError(error.message || 'Erreur lors de la sauvegarde');
        toast({
          title: "Erreur de sauvegarde",
          description: error.message || "Impossible de sauvegarder le token Mapbox",
          variant: "destructive"
        });
        return;
      }

      if (data?.error) {
        console.error('Server error:', data.error);
        setSaveError(data.error);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Token saved successfully');
      setCurrentToken(token);
      toast({
        title: "Token sauvegardé",
        description: "Le token Mapbox a été configuré avec succès",
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      setSaveError('Erreur inattendue lors de la sauvegarde');
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!token || !isValid) {
      toast({
        title: "Token requis",
        description: "Veuillez entrer un token Mapbox valide avant de tester",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsTesting(true);
      const { data, error } = await supabase.functions.invoke('test-mapbox-token', {
        body: { token }
      });

      if (error) {
        throw error;
      }

      if (data?.valid) {
        toast({
          title: "Test réussi",
          description: "La connexion à Mapbox fonctionne correctement",
        });
      } else {
        toast({
          title: "Test échoué",
          description: data?.message || "Le token Mapbox n'est pas valide ou a expiré",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing Mapbox token:', error);
      toast({
        title: "Erreur de test",
        description: "Impossible de tester la connexion Mapbox",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Configuration Mapbox
          </CardTitle>
          <p className="text-gray-600">
            Configurez votre token Mapbox pour activer les cartes interactives
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statut actuel */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Statut de la configuration</h3>
              <p className="text-sm text-gray-600">
                {currentToken ? 'Token configuré' : 'Aucun token configuré'}
              </p>
            </div>
            <Badge variant={currentToken ? 'default' : 'secondary'}>
              {currentToken ? (
                <><Check className="h-3 w-3 mr-1" /> Configuré</>
              ) : (
                <><X className="h-3 w-3 mr-1" /> Non configuré</>
              )}
            </Badge>
          </div>

          {/* Erreur de sauvegarde */}
          {saveError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Erreur de configuration :</p>
                  <p className="text-sm">{saveError}</p>
                  <div className="text-xs mt-2 p-2 bg-red-50 rounded border">
                    <p className="font-medium">Solutions possibles :</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Vérifiez que votre token Mapbox est valide</li>
                      <li>Assurez-vous d'être connecté en tant qu'administrateur</li>
                      <li>Rechargez la page et réessayez</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Formulaire de configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token">Token Mapbox</Label>
              <div className="mt-1 space-y-2">
                <Input
                  id="mapbox-token"
                  type="password"
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG..."
                  className={isValid === false ? 'border-red-500' : isValid === true ? 'border-green-500' : ''}
                  disabled={isLoading}
                />
                {isValid === false && (
                  <p className="text-sm text-red-600">
                    Token invalide. Il doit commencer par 'pk.' et faire au moins 50 caractères.
                  </p>
                )}
                {isValid === true && (
                  <p className="text-sm text-green-600">
                    Format du token valide
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSaveToken}
                disabled={!isValid || isLoading || isTesting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleTestConnection}
                disabled={!isValid || isTesting || isLoading}
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {isTesting ? 'Test...' : 'Tester'}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Comment obtenir votre token Mapbox :</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Créez un compte sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">mapbox.com <ExternalLink className="h-3 w-3" /></a></li>
                  <li>Allez dans votre Dashboard → Access tokens</li>
                  <li>Copiez votre "Default public token" ou créez-en un nouveau</li>
                  <li>Collez-le dans le champ ci-dessus et cliquez sur "Sauvegarder"</li>
                </ol>
                <p className="text-xs text-gray-500 mt-2">
                  Le token sera automatiquement testé et sauvegardé de manière sécurisée dans la base de données.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
