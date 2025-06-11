
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Check, X, Settings, ExternalLink } from 'lucide-react';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { Link } from 'react-router-dom';

interface MapboxConfigurationStatusProps {
  variant?: 'admin' | 'user';
  showCard?: boolean;
}

export const MapboxConfigurationStatus: React.FC<MapboxConfigurationStatusProps> = ({ 
  variant = 'admin',
  showCard = true 
}) => {
  const { token, configured, isLoading, error } = useMapboxToken();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-afroGreen"></div>
            <span className="text-sm text-gray-600">Vérification de la configuration Mapbox...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User variant - simplified display
  if (variant === 'user') {
    if (configured) {
      return null; // Don't show anything when working
    }

    const content = (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Configuration des cartes en cours. Les cartes interactives seront bientôt disponibles.
        </AlertDescription>
      </Alert>
    );

    return showCard ? (
      <Card>
        <CardContent className="p-4">
          {content}
        </CardContent>
      </Card>
    ) : content;
  }

  // Admin variant - detailed display
  const content = (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configuration Mapbox
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Statut de la configuration</h4>
            <p className="text-sm text-gray-600">
              {configured ? 'Token configuré et validé' : 'Configuration requise'}
            </p>
          </div>
          <Badge variant={configured ? 'default' : 'secondary'}>
            {configured ? (
              <><Check className="h-3 w-3 mr-1" /> Configuré</>
            ) : (
              <><X className="h-3 w-3 mr-1" /> Non configuré</>
            )}
          </Badge>
        </div>

        {error && (
          <Alert>
            <X className="h-4 w-4" />
            <AlertDescription>
              Erreur de configuration: {error}
            </AlertDescription>
          </Alert>
        )}

        {!configured && (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>Pour activer les cartes interactives, vous devez configurer un token Mapbox.</p>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link to="/admin/mapbox">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurer
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Obtenir un token
                    </a>
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {configured && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Token Mapbox validé</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Cartes interactives disponibles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Données géographiques chargées</span>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );

  return showCard ? <Card>{content}</Card> : content;
};
