import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Server, 
  Home, 
  ArrowLeft, 
  RefreshCw, 
  Mail,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface ErrorPageProps {
  type: '403' | '500' | 'maintenance';
  title?: string;
  message?: string;
  showActions?: boolean;
}

/**
 * Composant générique pour les pages d'erreur
 * Supporte 403 (Forbidden), 500 (Server Error), et maintenance
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({
  type,
  title,
  message,
  showActions = true
}) => {
  const navigate = useNavigate();

  const errorConfig = {
    '403': {
      icon: Lock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      defaultTitle: 'Accès refusé',
      defaultMessage: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
      code: '403'
    },
    '500': {
      icon: Server,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      defaultTitle: 'Erreur serveur',
      defaultMessage: 'Une erreur interne s\'est produite. Nos équipes ont été notifiées.',
      code: '500'
    },
    'maintenance': {
      icon: AlertTriangle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      defaultTitle: 'Maintenance en cours',
      defaultMessage: 'Le site est temporairement indisponible pour maintenance. Veuillez réessayer plus tard.',
      code: 'MAINT'
    }
  };

  const config = errorConfig[type];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
            <IconComponent className={`h-8 w-8 ${config.color}`} />
          </div>
          <div className="mb-4">
            <span className={`text-4xl font-bold ${config.color}`}>
              {config.code}
            </span>
          </div>
          <CardTitle className="text-2xl md:text-3xl text-gray-900">
            {title || config.defaultTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-6">
              {message || config.defaultMessage}
            </p>
            
            {/* Conseils spécifiques selon le type d'erreur */}
            {type === '403' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-yellow-800 mb-2">Que faire ?</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Vérifiez que vous êtes connecté avec le bon compte</li>
                  <li>• Contactez un administrateur si vous pensez avoir les droits</li>
                  <li>• Retournez à la page précédente</li>
                </ul>
              </div>
            )}
            
            {type === '500' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-orange-800 mb-2">Que faire ?</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Actualisez la page dans quelques minutes</li>
                  <li>• Vérifiez votre connexion internet</li>
                  <li>• Contactez le support si le problème persiste</li>
                </ul>
              </div>
            )}
            
            {type === 'maintenance' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Maintenance programmée</h4>
                <p className="text-sm text-blue-700">
                  Nous améliorons nos services pour vous offrir une meilleure expérience. 
                  La maintenance devrait se terminer sous peu.
                </p>
              </div>
            )}
          </div>
          
          {/* Actions de récupération */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Page précédente
              </Button>
              
              <Button asChild className="bg-afroGreen hover:bg-afroGreen/90">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
              
              {type === '500' && (
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualiser
                </Button>
              )}
            </div>
          )}
          
          {/* Contact support */}
          <div className="text-center pt-6 border-t">
            <p className="text-sm text-gray-500 mb-4">
              Besoin d'aide ? Notre équipe support est là pour vous.
            </p>
            <Button variant="ghost" size="sm" asChild>
              <a href="mailto:support@africahub.com" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contacter le support
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Page 403 - Accès refusé
 */
export const Forbidden: React.FC = () => (
  <ErrorPage type="403" />
);

/**
 * Page 500 - Erreur serveur
 */
export const ServerError: React.FC = () => (
  <ErrorPage type="500" />
);

/**
 * Page de maintenance
 */
export const Maintenance: React.FC = () => (
  <ErrorPage type="maintenance" />
);

export default ErrorPage;
