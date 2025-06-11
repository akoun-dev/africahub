import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Store,
    Package,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Shield,
    Settings,
    BarChart3,
    UserCheck,
    MessageSquare,
    Activity,
    Globe,
    Database,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Dashboard principal pour les administrateurs
 * Vue d'ensemble complète de la plateforme avec statistiques et outils de gestion
 */
export const AdminDashboardPage: React.FC = () => {
    const { profile } = useAuth()

    // Données simulées - à remplacer par de vraies données
    const platformStats = {
        totalUsers: 15420,
        activeUsers: 12350,
        newUsersToday: 45,
        totalMerchants: 1250,
        activeMerchants: 980,
        pendingMerchants: 23,
        totalProducts: 45600,
        activeProducts: 42100,
        pendingProducts: 156,
        totalRevenue: 2450000,
        monthlyGrowth: 12.5,
        platformHealth: 98.5,
    }

    const recentActivity = [
        {
            id: 1,
            type: "user_registration",
            title: "Nouvel utilisateur",
            description: "Jean Kouassi s'est inscrit",
            time: "5 min",
            icon: Users,
            status: "info",
        },
        {
            id: 2,
            type: "merchant_verification",
            title: "Marchand vérifié",
            description: "TechStore CI - Vérification approuvée",
            time: "15 min",
            icon: CheckCircle,
            status: "success",
        },
        {
            id: 3,
            type: "product_reported",
            title: "Produit signalé",
            description: "iPhone 15 - Contenu inapproprié",
            time: "1 heure",
            icon: AlertTriangle,
            status: "warning",
        },
        {
            id: 4,
            type: "system_alert",
            title: "Alerte système",
            description: "Pic de trafic détecté",
            time: "2 heures",
            icon: Activity,
            status: "info",
        },
    ]

    const pendingActions = [
        {
            id: 1,
            type: "merchant_verification",
            title: "Vérifications marchands",
            count: 23,
            priority: "high",
            link: "/admin/merchants/pending",
        },
        {
            id: 2,
            type: "product_moderation",
            title: "Modération produits",
            count: 156,
            priority: "medium",
            link: "/admin/products/pending",
        },
        {
            id: 3,
            type: "user_reports",
            title: "Signalements utilisateurs",
            count: 8,
            priority: "high",
            link: "/admin/reports",
        },
        {
            id: 4,
            type: "system_maintenance",
            title: "Maintenance système",
            count: 3,
            priority: "low",
            link: "/admin/system",
        },
    ]

    const topCountries = [
        { name: "Côte d'Ivoire", users: 4250, growth: "+8%" },
        { name: "Sénégal", users: 3100, growth: "+12%" },
        { name: "Mali", users: 2800, growth: "+5%" },
        { name: "Ghana", users: 2400, growth: "+15%" },
        { name: "Nigeria", users: 1900, growth: "+20%" },
    ]

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800"
            case "medium":
                return "bg-yellow-100 text-yellow-800"
            case "low":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* En-tête de bienvenue */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1
                            className="text-3xl font-bold"
                            style={{ color: "#2D4A6B" }}
                        >
                            Administration AfricaHub
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Vue d'ensemble de la plateforme et outils de gestion
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-slate-600">
                                Système opérationnel
                            </span>
                        </div>
                        <Link to="/admin/settings">
                            <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Paramètres
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistiques principales */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Users
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {platformStats.totalUsers.toLocaleString()}
                            </div>
                            <p className="text-sm text-slate-600">
                                Utilisateurs
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                +{platformStats.newUsersToday} aujourd'hui
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Store
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {platformStats.totalMerchants.toLocaleString()}
                            </div>
                            <p className="text-sm text-slate-600">Marchands</p>
                            <p className="text-xs text-yellow-600 mt-1">
                                {platformStats.pendingMerchants} en attente
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Package
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {platformStats.totalProducts.toLocaleString()}
                            </div>
                            <p className="text-sm text-slate-600">Produits</p>
                            <p className="text-xs text-blue-600 mt-1">
                                {platformStats.activeProducts.toLocaleString()}{" "}
                                actifs
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <DollarSign
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {(platformStats.totalRevenue / 1000000).toFixed(
                                    1
                                )}
                                M$
                            </div>
                            <p className="text-sm text-slate-600">Revenus</p>
                            <p className="text-xs text-green-600 mt-1">
                                +{platformStats.monthlyGrowth}% ce mois
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Activité récente */}
                    <Card>
                        <CardHeader>
                            <CardTitle
                                className="flex items-center"
                                style={{ color: "#2D4A6B" }}
                            >
                                <Activity className="w-5 h-5 mr-2" />
                                Activité Récente
                            </CardTitle>
                            <CardDescription>
                                Derniers événements sur la plateforme
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map(activity => {
                                    const Icon = activity.icon
                                    const statusColors = {
                                        success: "text-green-600 bg-green-100",
                                        info: "text-blue-600 bg-blue-100",
                                        warning:
                                            "text-yellow-600 bg-yellow-100",
                                        error: "text-red-600 bg-red-100",
                                    }

                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start space-x-3"
                                        >
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    statusColors[
                                                        activity.status as keyof typeof statusColors
                                                    ]
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-slate-600 truncate">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Il y a {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/admin/activity">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Voir toute l'activité
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions en attente */}
                    <Card>
                        <CardHeader>
                            <CardTitle
                                className="flex items-center"
                                style={{ color: "#2D4A6B" }}
                            >
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                Actions Requises
                            </CardTitle>
                            <CardDescription>
                                Éléments nécessitant votre attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingActions.map(action => (
                                    <div
                                        key={action.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900">
                                                {action.title}
                                            </h4>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span
                                                    className="text-lg font-bold"
                                                    style={{ color: "#2D4A6B" }}
                                                >
                                                    {action.count}
                                                </span>
                                                <Badge
                                                    className={getPriorityColor(
                                                        action.priority
                                                    )}
                                                >
                                                    {action.priority === "high"
                                                        ? "Urgent"
                                                        : action.priority ===
                                                          "medium"
                                                        ? "Moyen"
                                                        : "Faible"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Link to={action.link}>
                                            <Button size="sm" variant="outline">
                                                Traiter
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistiques par pays */}
                <Card>
                    <CardHeader>
                        <CardTitle
                            className="flex items-center"
                            style={{ color: "#2D4A6B" }}
                        >
                            <Globe className="w-5 h-5 mr-2" />
                            Répartition Géographique
                        </CardTitle>
                        <CardDescription>
                            Top 5 des pays par nombre d'utilisateurs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCountries.map((country, index) => (
                                <div
                                    key={country.name}
                                    className="flex items-center space-x-4"
                                >
                                    <div
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                        style={{
                                            backgroundColor: "#2D4A6B20",
                                            color: "#2D4A6B",
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                {country.name}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-slate-600">
                                                    {country.users.toLocaleString()}{" "}
                                                    utilisateurs
                                                </span>
                                                <span className="text-sm text-green-600 font-medium">
                                                    {country.growth}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    backgroundColor: "#2D4A6B",
                                                    width: `${
                                                        (country.users /
                                                            topCountries[0]
                                                                .users) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: "#2D4A6B" }}>
                            Outils d'Administration
                        </CardTitle>
                        <CardDescription>
                            Accès rapide aux fonctionnalités de gestion
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link to="/admin/users">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Users
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">
                                        Utilisateurs
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/admin/merchants">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Store
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Marchands</span>
                                    {platformStats.pendingMerchants > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                            {platformStats.pendingMerchants}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            <Link to="/admin/products">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Package
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Produits</span>
                                </Button>
                            </Link>

                            <Link to="/admin/analytics">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <BarChart3
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Analytiques</span>
                                </Button>
                            </Link>

                            <Link to="/admin/reports">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <MessageSquare
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">
                                        Signalements
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/admin/security">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Shield
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Sécurité</span>
                                </Button>
                            </Link>

                            <Link to="/admin/system">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Database
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Système</span>
                                </Button>
                            </Link>

                            <Link to="/admin/settings">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Settings
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Paramètres</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboardPage
