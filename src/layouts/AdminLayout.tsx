import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UnifiedHeader } from '@/components/UnifiedHeader';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Settings, 
  Code, 
  BarChart3, 
  Monitor, 
  Database,
  Users,
  Shield,
  Globe
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
  showBreadcrumbs?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Layout pour les pages d'administration
 * Vérifie les permissions admin et fournit une navigation spécialisée
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  requiresAdmin = true,
  showBreadcrumbs = true,
  title,
  description,
  className = ''
}) => {
  const { user, loading } = useAuth();
  const { isAdmin, adminUser, loading: adminLoading } = useAdminAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Affichage du loader pendant la vérification
  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.checking', 'Vérification des permissions administrateur...')}</p>
        </div>
      </div>
    );
  }

  // Redirection si pas connecté
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirection si pas admin
  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Génération des breadcrumbs admin
  const generateAdminBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: t('nav.home', 'Accueil'), href: '/' },
      { label: t('nav.admin', 'Administration'), href: '/admin' }
    ];

    const adminLabels: Record<string, string> = {
      'admin': t('nav.admin', 'Administration'),
      'mapbox': t('admin.mapbox', 'Configuration Mapbox'),
      'production': t('admin.production', 'Production'),
      'api': t('admin.api', 'Gestion API'),
      'search-analytics': t('admin.analytics', 'Analyses de recherche'),
      'monitoring': t('admin.monitoring', 'Surveillance')
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = adminLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (index === pathSegments.length - 1) {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  // Navigation admin
  const adminNavigation = [
    {
      label: t('admin.dashboard', 'Tableau de bord Admin'),
      href: '/admin',
      icon: Settings,
      description: 'Vue d\'ensemble de l\'administration'
    },
    {
      label: t('admin.api', 'Gestion API'),
      href: '/api',
      icon: Code,
      description: 'Gestion des APIs et intégrations'
    },
    {
      label: t('admin.analytics', 'Analyses'),
      href: '/search-analytics',
      icon: BarChart3,
      description: 'Analyses de recherche et statistiques'
    },
    {
      label: t('admin.monitoring', 'Surveillance'),
      href: '/monitoring',
      icon: Monitor,
      description: 'Surveillance système et performances'
    },
    {
      label: t('admin.mapbox', 'Mapbox'),
      href: '/admin/mapbox',
      icon: Globe,
      description: 'Configuration des cartes'
    },
    {
      label: t('admin.production', 'Production'),
      href: '/admin/production',
      icon: Database,
      description: 'Gestion de la production'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      {/* Header avec indicateur admin */}
      <UnifiedHeader />
      
      {/* Barre d'alerte admin */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t('admin.mode', 'Mode Administration')} - {adminUser?.email || user.email}
          </span>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb items={generateAdminBreadcrumbs()} />
          </div>
        </div>
      )}
      
      {/* Titre et description */}
      {(title || description) && (
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="container mx-auto px-4">
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Shield className="h-8 w-8 text-red-600" />
                {title}
              </h1>
            )}
            {description && (
              <p className="text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation admin */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-red-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  {t('admin.navigation', 'Navigation Admin')}
                </h3>
                <nav className="space-y-2">
                  {adminNavigation.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-red-600 text-white' 
                            : 'text-gray-700 hover:bg-red-50'
                        }`}
                        title={item.description}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </a>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <UnifiedFooter />
    </div>
  );
};
