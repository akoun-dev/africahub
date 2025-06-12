
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
  Globe,
  Package,
  Shield
} from 'lucide-react';

import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { AdminBrandedHeader } from '@/components/admin/AdminBrandedHeader';
import { AdminBrandedDashboard } from '@/components/admin/AdminBrandedDashboard';
import { DataMigrationRunner } from '@/components/admin/DataMigrationRunner';
import { ReviewManagement } from '@/components/admin/ReviewManagement';
import { MobilePaymentIntegrations } from '@/components/admin/MobilePaymentIntegrations';
import { EcommerceIntegrations } from '@/components/admin/EcommerceIntegrations';
import { QualityAssurance } from '@/components/admin/QualityAssurance';
import { PlatformConfiguration } from '@/components/admin/PlatformConfiguration';
import { BackendUserManagement } from '@/components/admin/BackendUserManagement';
import { AdvertisementManager } from '@/components/admin/AdvertisementManager';
import { PublicDocumentationManager } from '@/components/admin/PublicDocumentationManager';
import { PublicUserManagement } from '@/components/admin/PublicUserManagement';
import { EnhancedCountryManagement } from '@/components/admin/EnhancedCountryManagement';
import { ProductManagementEnhanced } from '@/components/admin/ProductManagementEnhanced';
import { SystematicTestingSuite } from '@/components/testing/SystematicTestingSuite';
import { ParametricRoleManager } from '@/components/admin/ParametricRoleManager';
import { RoleCompatibilityLayer } from '@/components/admin/RoleCompatibilityLayer';

const Admin = () => {
  const adminSections = [
    {
      id: 'systematic-testing',
      title: 'Tests Systématiques',
      description: 'Diagnostic et validation complète de toutes les fonctionnalités',
      icon: <CheckCircle className="h-5 w-5" />,
      component: <SystematicTestingSuite />
    },
    {
      id: 'parametric-roles',
      title: 'Rôles Paramétrables',
      description: 'Gestion dynamique des rôles et permissions',
      icon: <Shield className="h-5 w-5" />,
      component: (
        <div className="space-y-6">
          <RoleCompatibilityLayer />
          <ParametricRoleManager />
        </div>
      )
    },
    {
      id: 'platform-config',
      title: 'Configuration Plateforme',
      description: 'Paramètres généraux, pays, branding et sécurité',
      icon: <Settings className="h-5 w-5" />,
      component: <PlatformConfiguration />
    },
    {
      id: 'country-support',
      title: 'Pays Supportés',
      description: 'Gestion complète des 54 pays africains et configurations régionales',
      icon: <Globe className="h-5 w-5" />,
      component: <EnhancedCountryManagement />
    },
    {
      id: 'backend-users',
      title: 'Utilisateurs Backend',
      description: 'Gestion des administrateurs et modérateurs',
      icon: <Users className="h-5 w-5" />,
      component: <BackendUserManagement />
    },
    {
      id: 'public-users',
      title: 'Utilisateurs Publics',
      description: 'Gestion des utilisateurs de l\'application grand public',
      icon: <Users className="h-5 w-5" />,
      component: <PublicUserManagement />
    },
    {
      id: 'advertisements',
      title: 'Gestion Publicité',
      description: 'Campagnes publicitaires et analytics',
      icon: <Monitor className="h-5 w-5" />,
      component: <AdvertisementManager />
    },
    {
      id: 'documentation',
      title: 'Documentation Publique',
      description: 'Guides, FAQ et tutoriels pour les utilisateurs',
      icon: <BookOpen className="h-5 w-5" />,
      component: <PublicDocumentationManager />
    },
    {
      id: 'data-migration',
      title: 'Migration des Données',
      description: 'Initialisation et mise à jour des données de la base',
      icon: <ListChecks className="h-5 w-5" />,
      component: <DataMigrationRunner />
    },
    {
      id: 'review-management',
      title: 'Gestion des Avis',
      description: 'Modération et vérification des avis utilisateurs',
      icon: <MessageSquare className="h-5 w-5" />,
      component: <ReviewManagement />
    },
    {
      id: 'mobile-payments',
      title: 'Paiements Mobile',
      description: 'Intégrations Mobile Money et API de paiement',
      icon: <Smartphone className="h-5 w-5" />,
      component: <MobilePaymentIntegrations />
    },
    {
      id: 'ecommerce-integrations',
      title: 'Intégrations E-commerce',
      description: 'Partenaires et redirections vers sites marchands',
      icon: <ShoppingCart className="h-5 w-5" />,
      component: <EcommerceIntegrations />
    },
    {
      id: 'quality-assurance',
      title: 'Assurance Qualité',
      description: 'Tests automatisés et monitoring de la plateforme',
      icon: <CheckCircle className="h-5 w-5" />,
      component: <QualityAssurance />
    },
    {
      id: 'product-management',
      title: 'Gestion des Produits',
      description: 'Gestion des produits et catégories',
      icon: <Package className="h-5 w-5" />,
      component: <ProductManagementEnhanced />
    }
  ];

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <AdminBrandedHeader />
        
        <div className="container mx-auto py-8 px-4">
          {/* Main Dashboard */}
          <div className="mb-12">
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent">
                Tableau de bord Administration AfricaHub
              </h1>
              <p className="text-gray-600 mt-2">Gérez tous les aspects de la plateforme multi-sectorielle</p>
            </div>
            
            <AdminBrandedDashboard />
          </div>

          {/* Individual Components */}
          <div className="space-y-12">
            {adminSections.map(section => (
              <div key={section.id} id={section.id} className="scroll-mt-8">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      {section.icon}
                      <span>{section.title}</span>
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    {section.component}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default Admin;
