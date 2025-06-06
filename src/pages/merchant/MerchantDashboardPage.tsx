/**
 * Dashboard pour les marchands AfricaHub
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Store,
  Package,
  Star,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  BarChart3,
  ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MerchantDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const merchantStats = {
    totalProducts: 24,
    activeProducts: 20,
    totalViews: 1250,
    totalSales: 45,
    averageRating: 4.3,
    monthlyRevenue: '2,450,000 FCFA'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord marchand 🏪
              </h1>
              <p className="text-gray-600">
                {profile?.company_name || 'Votre boutique'} - Gérez votre activité commerciale
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Marchand Vérifié
              </Badge>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produits actifs</p>
                  <p className="text-2xl font-bold text-marineBlue-600">
                    {merchantStats.activeProducts}/{merchantStats.totalProducts}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues ce mois</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{merchantStats.totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventes</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{merchantStats.totalSales}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{merchantStats.averageRating}/5</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gérer les produits</h3>
              <p className="text-gray-600 text-sm">
                Ajouter, modifier ou supprimer des produits
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Commandes</h3>
              <p className="text-gray-600 text-sm">
                Suivre et gérer vos commandes
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Avis clients</h3>
              <p className="text-gray-600 text-sm">
                Répondre aux avis et commentaires
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
              <p className="text-gray-600 text-sm">
                Analyser vos performances
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="products">Mes produits</TabsTrigger>
            <TabsTrigger value="reviews">Avis clients</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 mb-2">{merchantStats.monthlyRevenue}</p>
                <p className="text-sm text-gray-600">Ce mois-ci</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes produits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vos produits apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avis clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Les avis clients apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vos statistiques apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MerchantDashboardPage;