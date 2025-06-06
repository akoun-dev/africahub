/**
 * Dashboard pour les gestionnaires AfricaHub
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Flag,
  MessageSquare,
  Package,
  Clock,
  FileText,
  XCircle
} from 'lucide-react';

export const ManagerDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const moderationStats = {
    pendingReviews: 15,
    pendingProducts: 8,
    reportedContent: 5,
    resolvedToday: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Centre de modération 🛡️
              </h1>
              <p className="text-gray-600">
                Gérez la qualité du contenu et assurez la conformité de la plateforme
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Gestionnaire
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {moderationStats.pendingReviews + moderationStats.pendingProducts}
                  </p>
                  <p className="text-xs text-gray-500">
                    {moderationStats.pendingReviews} avis, {moderationStats.pendingProducts} produits
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Signalements</p>
                  <p className="text-2xl font-bold text-red-600">{moderationStats.reportedContent}</p>
                  <p className="text-xs text-gray-500">À traiter</p>
                </div>
                <Flag className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Traités aujourd'hui</p>
                  <p className="text-2xl font-bold text-green-600">{moderationStats.resolvedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Modérer les avis</h3>
              <p className="text-gray-600 text-sm mb-4">
                {moderationStats.pendingReviews} avis en attente
              </p>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Urgent
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vérifier les produits</h3>
              <p className="text-gray-600 text-sm mb-4">
                {moderationStats.pendingProducts} produits à vérifier
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Normal
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Flag className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Signalements</h3>
              <p className="text-gray-600 text-sm mb-4">
                {moderationStats.reportedContent} contenus signalés
              </p>
              <Badge variant="destructive">
                Critique
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rapports</h3>
              <p className="text-gray-600 text-sm">
                Générer des rapports de modération
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="reviews">Avis à modérer</TabsTrigger>
            <TabsTrigger value="products">Produits à vérifier</TabsTrigger>
            <TabsTrigger value="reports">Signalements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vos actions de modération récentes apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avis en attente de modération</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Les avis à modérer apparaîtront ici.</p>
                <div className="flex gap-3 mt-4">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Examiner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produits en attente de vérification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Les produits à vérifier apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenus signalés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Les signalements apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;