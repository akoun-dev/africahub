
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface MapboxStatusIndicatorProps {
  showOnSuccess?: boolean;
  variant?: 'minimal' | 'detailed';
  showAdminLink?: boolean;
}

export const MapboxStatusIndicator: React.FC<MapboxStatusIndicatorProps> = ({ 
  showOnSuccess = false,
  variant = 'minimal',
  showAdminLink = false
}) => {
  const { configured, isLoading, error, message } = useMapboxToken();
  const { isAdmin } = useAdminAuth();

  // Don't show anything while loading
  if (isLoading) {
    return variant === 'detailed' ? (
      <Alert>
        <MapPin className="h-4 w-4 animate-pulse" />
        <AlertDescription>
          Vérification de la configuration Mapbox...
        </AlertDescription>
      </Alert>
    ) : null;
  }

  // Show success message only if configured and requested
  if (configured && showOnSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50/50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          ✅ Cartes interactives disponibles
          {variant === 'detailed' && message && (
            <div className="text-xs mt-1 opacity-80">{message}</div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Show error/configuration needed message
  if (!configured) {
    return (
      <Alert className="border-orange-200 bg-orange-50/50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <div className="space-y-2">
            <div>
              {error ? 
                "❌ Erreur de configuration des cartes" : 
                "⚙️ Configuration Mapbox requise"
              }
            </div>
            {variant === 'detailed' && (
              <div className="text-sm">
                {message || "Veuillez configurer votre token Mapbox pour activer cette magnifique carte interactive de l'Afrique."}
              </div>
            )}
            {(showAdminLink || (isAdmin && variant === 'detailed')) && (
              <div className="flex gap-2 mt-3">
                <Button asChild size="sm" variant="outline">
                  <Link to="/admin/mapbox">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurer Mapbox
                  </Link>
                </Button>
              </div>
            )}
            {variant === 'minimal' && !isAdmin && (
              <div className="text-xs mt-1">
                💡 Allez dans Admin → Mapbox pour configurer le token
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
