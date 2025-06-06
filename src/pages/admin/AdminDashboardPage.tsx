/**
 * Dashboard pour les administrateurs AfricaHub
 * Fonctionnalités: gestion utilisateurs, configuration plateforme, résolution litiges, statistiques globales
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Package,
  MessageSquare,
  UserPlus,
  UserMinus,
  Database,
  Server,
  Globe,
  Lock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROFILE_LABELS, PROFILE_COLORS } from '@/types/user-profiles';

/**
 * Page principale du dashboard administrateur
 */
export const AdminDashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées pour la démonstration
  const platformStats = {
    totalUsers: 15420,
    simpleUsers: 12850,
    merchants: 2340,
    managers: 25,
    administrators: 5,
    activeUsers: 8750,
    newUsersToday: 45,
    totalProducts: 5680,
    totalReviews: 12340,
    totalRevenue: '125,000,000 FCFA',
    monthlyGrowth: 12.5
  };

  const systemHealth = {
    serverStatus: 'healthy',
    databaseStatus: 'healthy',
    apiResponseTime: '120ms',
    uptime: '99.9%',
    activeConnections: 1250,
    errorRate: '0.02%'
  };

  const recentUsers = [
    {
      id: 1,
      name: 'Kouame Yao',
      email: 'kouame@example.com',
      type: 'simple_user',
      status: 'active',
      joinDate: '2025-01-01',
      lastActivity: '2025-01-01 15:30'
    },
    {
      id: 2,
      name: 'TechStore CI',
      email: 'contact@techstore.ci',
      type: 'merchant',
      status: 'pending',
      joinDate: '2024-12-30',
      lastActivity: '2024-12-30 14:20'
    },
    {
      id: 3,
      name: 'Fatou Diallo',
      email: 'fatou@example.com',
      type: 'simple_user',
      status: 'active',
      joinDate: '2024-12-29',
      lastActivity: '2025-01-01 12:15'
    }
  ];

  const pendingActions = [
    {
      id: 1,
      type: 'user_verification',
      title: 'Vérification marchand - TechStore CI',
      description: 'Nouveau marchand en attente de vérification',
      priority: 'high',
      date: '2025-01-01'
    },
    {
      id: 2,
      type: 'dispute',
      title: 'Litige produit - iPhone 15 Pro',
      description: 'Conflit entre client et marchand',
      priority: 'critical',
      date: '2024-12-31'
    },
    {
      id: 3,
      type: 'system_alert',
      title: 'Pic de trafic détecté',
      description: 'Augmentation inhabituelle du trafic',
      priority: 'medium',
      date: '2025-01-01'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Espace disque faible',
      message: 'Le serveur principal a atteint 85% de capacité',
      time: '2025-01-01 14:30'
    },
    {
      id: 2,
      type: 'info',
      title: 'Mise à jour planifiée',
      message: 'Maintenance programmée pour ce soir à 23h',
      time: '2025-01-01 10:00'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Administration AfricaHub 👑
              </h1>
              <p className="text-gray-600">
                Contrôle total de la plateforme et gestion des utilisateurs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Super Administrateur
              </Badge>
              <Link to="/admin/settings">
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuration
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{platformStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+{platformStats.newUsersToday} aujourd'hui</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produits</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{platformStats.totalProducts.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Sur la plateforme</p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{platformStats.totalRevenue}</p>
                  <p className="text-xs text-green-600">+{platformStats.monthlyGrowth}% ce mois</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-marineBlue-600">{platformStats.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Dernières 24h</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Répartition des utilisateurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Répartition des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Utilisateurs simples</span>
                  </div>
                  <span className="font-bold">{platformStats.simpleUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Marchands</span>
                  </div>
                  <span className="font-bold">{platformStats.merchants.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Gestionnaires</span>
                  </div>
                  <span className="font-bold">{platformStats.managers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Administrateurs</span>
                  </div>
                  <span className="font-bold">{platformStats.administrators}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                État du système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Serveurs</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Opérationnels
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Base de données</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Stable
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temps de réponse API</span>
                  <span className="font-bold text-green-600">{systemHealth.apiResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disponibilité</span>
                  <span className="font-bold text-green-600">{systemHealth.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connexions actives</span>
                  <span className="font-bold">{systemHealth.activeConnections.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gérer les utilisateurs</h3>
                <p className="text-gray-600 text-sm">
                  Créer, modifier et gérer tous les comptes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
                <p className="text-gray-600 text-sm">
                  Analyser les performances globales
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuration</h3>
                <p className="text-gray-600 text-sm">
                  Paramètres de la plateforme
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/security">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sécurité</h3>
                <p className="text-gray-600 text-sm">
                  Logs et surveillance
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="actions">Actions en attente</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Actions prioritaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingActions.slice(0, 3).map((action) => (
                      <div key={action.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Badge 
                            variant={action.priority === 'critical' ? 'destructive' : 'secondary'}
                            className={
                              action.priority === 'critical' 
                                ? 'bg-red-100 text-red-800' 
                                : action.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {action.priority === 'critical' ? 'Critique' : 
                             action.priority === 'high' ? 'Élevé' : 'Moyen'}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-gray-600">{action.description}</p>
                          <p className="text-xs text-gray-500">{action.date}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Traiter
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Alertes système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                          {alert.type === 'info' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Utilisateurs récents
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Ajouter utilisateur
                    </Button>
                    <Link to="/admin/users">
                      <Button size="sm">
                        Voir tous
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge 
                            className={PROFILE_COLORS[user.type as keyof typeof PROFILE_COLORS]}
                          >
                            {PROFILE_LABELS[user.type as keyof typeof PROFILE_LABELS]}
                          </Badge>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }
                          >
                            {user.status === 'active' ? 'Actif' : 'En attente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Inscrit: {user.joinDate}</span>
                          <span>Dernière activité: {user.lastActivity}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.status === 'pending' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions en attente */}
          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Toutes les actions en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                          <p className="text-sm text-gray-500">Date: {action.date}</p>
                        </div>
                        <Badge 
                          variant={action.priority === 'critical' ? 'destructive' : 'secondary'}
                          className={
                            action.priority === 'critical' 
                              ? 'bg-red-100 text-red-800' 
                              : action.priority === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                        >
                          Priorité {action.priority === 'critical' ? 'critique' : 
                                   action.priority === 'high' ? 'élevée' : 'moyenne'}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Traiter
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Examiner
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Système */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Monitoring système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CPU</span>
                      <span className="font-bold text-green-600">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mémoire</span>
                      <span className="font-bold text-blue-600">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Disque</span>
                      <span className="font-bold text-orange-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Réseau</span>
                      <span className="font-bold text-purple-600">23 Mbps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Base de données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taille totale</span>
                      <span className="font-bold">2.4 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Connexions actives</span>
                      <span className="font-bold text-green-600">45/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Requêtes/sec</span>
                      <span className="font-bold text-blue-600">1,250</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dernière sauvegarde</span>
                      <span className="font-bold text-green-600">Il y a 2h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
