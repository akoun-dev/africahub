import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ListChecks, 
  MessageSquare, 
  Smartphone, 
  ShoppingCart, 
  CheckCircle,
  Settings,
  Users,
  Monitor,
  BookOpen,
  TrendingUp,
  Shield,
  Globe,
  Zap
} from 'lucide-react';

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'active' | 'maintenance' | 'new';
  category: 'core' | 'content' | 'integration' | 'analytics';
}

export const AdminBrandedDashboard: React.FC = () => {
  const adminSections: AdminSection[] = [
    {
      id: 'platform-config',
      title: 'Configuration Plateforme',
      description: 'Paramètres généraux, pays, branding et sécurité',
      icon: <Settings className="h-6 w-6" />,
      color: 'from-afroGreen to-emerald-600',
      status: 'active',
      category: 'core'
    },
    {
      id: 'country-support',
      title: 'Pays Supportés',
      description: 'Gestion complète des 54 pays africains et configurations régionales',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-afroGold to-yellow-600',
      status: 'new',
      category: 'core'
    },
    {
      id: 'backend-users',
      title: 'Utilisateurs Backend',
      description: 'Gestion des administrateurs et modérateurs',
      icon: <Shield className="h-6 w-6" />,
      color: 'from-afroRed to-red-600',
      status: 'active',
      category: 'core'
    },
    {
      id: 'public-users',
      title: 'Utilisateurs Publics',
      description: 'Gestion des utilisateurs de l\'application grand public',
      icon: <Users className="h-6 w-6" />,
      color: 'from-afroGold to-yellow-600',
      status: 'active',
      category: 'core'
    },
    {
      id: 'advertisements',
      title: 'Gestion Publicité',
      description: 'Campagnes publicitaires et analytics',
      icon: <Monitor className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-700',
      status: 'active',
      category: 'analytics'
    },
    {
      id: 'documentation',
      title: 'Documentation Publique',
      description: 'Guides, FAQ et tutoriels pour les utilisateurs',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-700',
      status: 'active',
      category: 'content'
    },
    {
      id: 'data-migration',
      title: 'Migration des Données',
      description: 'Initialisation et mise à jour des données de la base',
      icon: <ListChecks className="h-6 w-6" />,
      color: 'from-teal-500 to-teal-700',
      status: 'active',
      category: 'core'
    },
    {
      id: 'review-management',
      title: 'Gestion des Avis',
      description: 'Modération et vérification des avis utilisateurs',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-700',
      status: 'active',
      category: 'content'
    },
    {
      id: 'mobile-payments',
      title: 'Paiements Mobile',
      description: 'Intégrations Mobile Money et API de paiement',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'from-green-500 to-green-700',
      status: 'new',
      category: 'integration'
    },
    {
      id: 'ecommerce-integrations',
      title: 'Intégrations E-commerce',
      description: 'Partenaires et redirections vers sites marchands',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'from-indigo-500 to-indigo-700',
      status: 'active',
      category: 'integration'
    },
    {
      id: 'quality-assurance',
      title: 'Assurance Qualité',
      description: 'Tests automatisés et monitoring de la plateforme',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-700',
      status: 'active',
      category: 'analytics'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-afroGold text-white">Nouveau</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return <Badge className="bg-afroGreen text-white">Actif</Badge>;
    }
  };

  const categories = {
    core: { name: 'Fonctions Principales', icon: <Globe className="h-5 w-5" /> },
    content: { name: 'Gestion de Contenu', icon: <BookOpen className="h-5 w-5" /> },
    integration: { name: 'Intégrations', icon: <Zap className="h-5 w-5" /> },
    analytics: { name: 'Analytics & Monitoring', icon: <TrendingUp className="h-5 w-5" /> }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-afroGreen">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modules Actifs</p>
                <p className="text-3xl font-bold text-afroGreen">
                  {adminSections.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-afroGreen" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-afroGold">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux Modules</p>
                <p className="text-3xl font-bold text-afroGold">
                  {adminSections.filter(s => s.status === 'new').length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-afroGold" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Intégrations</p>
                <p className="text-3xl font-bold text-blue-500">
                  {adminSections.filter(s => s.category === 'integration').length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Analytics</p>
                <p className="text-3xl font-bold text-purple-500">
                  {adminSections.filter(s => s.category === 'analytics').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categorized Modules */}
      {Object.entries(categories).map(([categoryKey, categoryInfo]) => (
        <div key={categoryKey} className="space-y-4">
          <div className="flex items-center space-x-2">
            {categoryInfo.icon}
            <h2 className="text-xl font-semibold text-gray-800">{categoryInfo.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections
              .filter(section => section.category === categoryKey)
              .map(section => (
                <Card 
                  key={section.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {section.icon}
                      </div>
                      {getStatusBadge(section.status)}
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-afroGreen transition-colors">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-afroGreen to-emerald-600 hover:from-afroGreen/90 hover:to-emerald-600/90 text-white border-0 shadow-md"
                      onClick={() => {
                        // For now, just scroll to the original component
                        const element = document.getElementById(section.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Gérer {section.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
