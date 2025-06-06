/**
 * Dashboard pour les utilisateurs simples AfricaHub
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Heart,
  Star,
  MessageSquare,
  Search,
  TrendingUp,
  ShoppingCart,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const userStats = {
    favoriteProducts: 12,
    reviewsWritten: 8,
    comparisonsViewed: 45,
    accountAge: '3 mois'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour, {profile?.display_name || profile?.first_name} ! 👋
              </h1>
              <p className="text-gray-600">
                Gérez vos favoris, avis et découvrez de nouveaux produits
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Utilisateur Simple
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favoris</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{userStats.favoriteProducts}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avis écrits</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{userStats.reviewsWritten}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comparaisons</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{userStats.comparisonsViewed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Membre depuis</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{userStats.accountAge}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/compare">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="w-12 h-12 text-marineBlue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Comparer des produits</h3>
                <p className="text-gray-600 text-sm">
                  Trouvez le meilleur produit selon vos critères
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Parcourir les produits</h3>
                <p className="text-gray-600 text-sm">
                  Découvrez notre catalogue complet
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/recommendations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Recommandations IA</h3>
                <p className="text-gray-600 text-sm">
                  Produits suggérés pour vous
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="favorites">Mes favoris</TabsTrigger>
            <TabsTrigger value="reviews">Mes avis</TabsTrigger>
            <TabsTrigger value="profile">Mon profil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vos dernières activités apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Mes produits favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vos produits favoris apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Mes avis et commentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Vos avis apparaîtront ici.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-lg">{profile?.first_name} {profile?.last_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p>{user?.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboardPage;