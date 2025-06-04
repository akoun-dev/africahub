
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items = [], 
  showHome = true 
}) => {
  const location = useLocation();

  // Générer automatiquement les breadcrumbs basés sur l'URL si aucun item fourni
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs: BreadcrumbItem[] = [];
    
    pathnames.forEach((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      // Mapper certains paths vers des labels plus lisibles
      const labelMap: Record<string, string> = {
        'dashboard': 'Tableau de bord',
        'profile': 'Profil',
        'favorites': 'Favoris',
        'history': 'Historique',
        'notifications': 'Notifications',
        'admin': 'Administration',
        'secteur': 'Secteur',
        'search': 'Recherche',
        'compare': 'Comparaison'
      };
      
      breadcrumbs.push({
        label: labelMap[pathname] || label,
        path: index === pathnames.length - 1 ? undefined : path
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  if (breadcrumbItems.length === 0 && !showHome) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      {showHome && (
        <>
          <Link 
            to="/" 
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight className="h-4 w-4" />
          )}
        </>
      )}
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.path ? (
            <Link 
              to={item.path}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
