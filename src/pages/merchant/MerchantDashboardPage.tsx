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
    Package,
    Star,
    TrendingUp,
    DollarSign,
    Eye,
    MessageSquare,
    Plus,
    Settings,
    BarChart3,
    Users,
    ShoppingBag,
    AlertCircle,
    CheckCircle,
    Clock,
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Dashboard principal pour les marchands
 * Affiche les statistiques de vente, produits, avis, et outils de gestion
 */
export const MerchantDashboardPage: React.FC = () => {
    const { profile } = useAuth()

    // Données simulées - à remplacer par de vraies données
    const merchantStats = {
        totalProducts: 45,
        activeProducts: 42,
        totalViews: 12450,
        totalSales: 1250,
        revenue: 45600,
        averageRating: 4.3,
        totalReviews: 89,
        pendingOrders: 8,
    }

    const recentActivity = [
        {
            id: 1,
            type: "sale",
            title: "Nouvelle vente",
            description: "Smartphone Samsung Galaxy S24 - 650$",
            time: "2 heures",
            icon: DollarSign,
            status: "success",
        },
        {
            id: 2,
            type: "review",
            title: "Nouvel avis",
            description: "Service client - 5 étoiles",
            time: "4 heures",
            icon: Star,
            status: "info",
        },
        {
            id: 3,
            type: "product",
            title: "Produit en rupture",
            description: "iPhone 15 Pro - Stock épuisé",
            time: "1 jour",
            icon: AlertCircle,
            status: "warning",
        },
    ]

    const topProducts = [
        {
            id: 1,
            name: "Samsung Galaxy S24",
            category: "Smartphones",
            views: 1250,
            sales: 45,
            revenue: 29250,
            rating: 4.5,
        },
        {
            id: 2,
            name: "iPhone 15 Pro",
            category: "Smartphones",
            views: 980,
            sales: 32,
            revenue: 35200,
            rating: 4.7,
        },
        {
            id: 3,
            name: "MacBook Air M3",
            category: "Ordinateurs",
            views: 750,
            sales: 12,
            revenue: 18000,
            rating: 4.8,
        },
    ]

    const getVerificationStatusBadge = () => {
        const status =
            profile?.merchant_profile?.verification_status || "pending"

        switch (status) {
            case "verified":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Rejeté
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* En-tête de bienvenue */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1
                                className="text-3xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {profile?.merchant_profile?.business_name ||
                                    "Mon Commerce"}
                            </h1>
                            {getVerificationStatusBadge()}
                        </div>
                        <p className="text-slate-600">
                            Gérez votre catalogue et suivez vos performances
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <Link to="/merchant/products/new">
                            <Button
                                size="sm"
                                style={{ backgroundColor: "#2D4A6B" }}
                                className="text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nouveau Produit
                            </Button>
                        </Link>
                        <Link to="/merchant/settings">
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
                                <Package
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {merchantStats.totalProducts}
                            </div>
                            <p className="text-sm text-slate-600">Produits</p>
                            <p className="text-xs text-green-600 mt-1">
                                {merchantStats.activeProducts} actifs
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Eye
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {merchantStats.totalViews.toLocaleString()}
                            </div>
                            <p className="text-sm text-slate-600">Vues</p>
                            <p className="text-xs text-blue-600 mt-1">
                                +12% ce mois
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <ShoppingBag
                                    className="w-8 h-8"
                                    style={{ color: "#2D4A6B" }}
                                />
                            </div>
                            <div
                                className="text-2xl font-bold"
                                style={{ color: "#2D4A6B" }}
                            >
                                {merchantStats.totalSales}
                            </div>
                            <p className="text-sm text-slate-600">Ventes</p>
                            <p className="text-xs text-green-600 mt-1">
                                +8% ce mois
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
                                {merchantStats.revenue.toLocaleString()}$
                            </div>
                            <p className="text-sm text-slate-600">Revenus</p>
                            <p className="text-xs text-green-600 mt-1">
                                +15% ce mois
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
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Activité Récente
                            </CardTitle>
                            <CardDescription>
                                Dernières actions sur votre boutique
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
                                <Link to="/merchant/activity">
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

                    {/* Produits les plus performants */}
                    <Card>
                        <CardHeader>
                            <CardTitle
                                className="flex items-center"
                                style={{ color: "#2D4A6B" }}
                            >
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Top Produits
                            </CardTitle>
                            <CardDescription>
                                Vos produits les plus populaires
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center space-x-3 p-3 border rounded-lg"
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
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-900 truncate">
                                                {product.name}
                                            </h4>
                                            <p className="text-sm text-slate-600">
                                                {product.category}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                                                <span>
                                                    {product.views} vues
                                                </span>
                                                <span>
                                                    {product.sales} ventes
                                                </span>
                                                <span>
                                                    {product.revenue.toLocaleString()}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">
                                                {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/merchant/analytics">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Voir toutes les statistiques
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions rapides */}
                <Card>
                    <CardHeader>
                        <CardTitle style={{ color: "#2D4A6B" }}>
                            Actions Rapides
                        </CardTitle>
                        <CardDescription>
                            Accédez rapidement aux fonctionnalités principales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link to="/merchant/products">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Package
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">
                                        Mes Produits
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/merchant/orders">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <ShoppingBag
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Commandes</span>
                                    {merchantStats.pendingOrders > 0 && (
                                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                            {merchantStats.pendingOrders}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>

                            <Link to="/merchant/reviews">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <MessageSquare
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">
                                        Avis Clients
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/merchant/analytics">
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
                        </div>
                    </CardContent>
                </Card>

                {/* Alertes et notifications */}
                {profile?.merchant_profile?.verification_status ===
                    "pending" && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-yellow-800">
                                        Vérification en cours
                                    </h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Votre compte marchand est en cours de
                                        vérification. Vous recevrez une
                                        notification une fois le processus
                                        terminé.
                                    </p>
                                    <Link to="/merchant/verification">
                                        <Button
                                            size="sm"
                                            className="mt-3"
                                            variant="outline"
                                        >
                                            Voir le statut
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default MerchantDashboardPage
