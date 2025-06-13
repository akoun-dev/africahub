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
import useMerchantProfile from "@/hooks/useMerchantProfile"
import { MerchantLayout } from "@/components/merchant"

/**
 * Dashboard principal pour les marchands
 * Affiche les statistiques de vente, produits, avis, et outils de gestion
 */
export const MerchantDashboardPage: React.FC = () => {
    const { profile } = useAuth()
    const { merchantProfile, businessInfo, displayName, sectorDescription } =
        useMerchantProfile()

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
        <MerchantLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
                <div className="p-6 space-y-6">
                    {/* En-tête de bienvenue avec design moderne */}
                    <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                        {/* Motifs décoratifs */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                        <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h1 className="text-4xl font-bold text-white">
                                            {displayName}
                                        </h1>
                                        {getVerificationStatusBadge()}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-emerald-100 text-lg">
                                            Gérez votre catalogue et suivez vos
                                            performances
                                        </p>
                                        {businessInfo && (
                                            <p className="text-emerald-200 font-medium">
                                                {sectorDescription}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 mt-6 lg:mt-0">
                                    <Link to="/merchant/products/new">
                                        <Button
                                            size="lg"
                                            className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg"
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Nouveau Produit
                                        </Button>
                                    </Link>
                                    <Link to="/merchant/settings">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-white/30 text-white hover:bg-white/10"
                                        >
                                            <Settings className="w-5 h-5 mr-2" />
                                            Paramètres
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerte profil incomplet avec design moderne */}
                    {businessInfo && !businessInfo.isComplete && (
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-l-orange-500">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-orange-800 text-lg mb-2">
                                            Complétez votre profil business
                                        </h4>
                                        <p className="text-orange-700 mb-4">
                                            Ajoutez les informations manquantes
                                            de votre entreprise pour bénéficier
                                            de recommandations personnalisées et
                                            améliorer votre visibilité.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {!businessInfo.name && (
                                                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                                                    Nom d'entreprise
                                                </Badge>
                                            )}
                                            {!businessInfo.sector && (
                                                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                                                    Secteur d'activité
                                                </Badge>
                                            )}
                                            {!businessInfo.type && (
                                                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                                                    Type d'activité
                                                </Badge>
                                            )}
                                        </div>
                                        <Link to="/merchant/profile">
                                            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                                                Compléter le profil
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Statistiques principales avec design moderne */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div className="text-3xl font-bold text-emerald-600 mb-2">
                                    {merchantStats.totalProducts}
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Produits
                                </p>
                                <p className="text-xs text-green-600 font-medium">
                                    {merchantStats.activeProducts} actifs
                                </p>
                                <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                    <div className="bg-emerald-600 h-2 rounded-full w-4/5"></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Eye className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {merchantStats.totalViews.toLocaleString()}
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Vues
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                    +12% ce mois
                                </p>
                                <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                                    <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {merchantStats.totalSales}
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Ventes
                                </p>
                                <p className="text-xs text-green-600 font-medium">
                                    +8% ce mois
                                </p>
                                <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                                    <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DollarSign className="w-8 h-8 text-emerald-700" />
                                </div>
                                <div className="text-3xl font-bold text-emerald-700 mb-2">
                                    {merchantStats.revenue.toLocaleString()}$
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Revenus
                                </p>
                                <p className="text-xs text-emerald-600 font-medium">
                                    +15% ce mois
                                </p>
                                <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                    <div className="bg-emerald-700 h-2 rounded-full w-full"></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Activité récente avec design moderne */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-emerald-800">
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
                                            success:
                                                "text-green-600 bg-green-100",
                                            info: "text-blue-600 bg-blue-100",
                                            warning:
                                                "text-yellow-600 bg-yellow-100",
                                        }

                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors"
                                            >
                                                <div
                                                    className={`p-3 rounded-lg ${
                                                        statusColors[
                                                            activity.status as keyof typeof statusColors
                                                        ]
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900">
                                                        {activity.title}
                                                    </p>
                                                    <p className="text-gray-600 mt-1">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Il y a {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-6 pt-4 border-t border-emerald-100">
                                    <Link to="/merchant/activity">
                                        <Button
                                            variant="outline"
                                            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                        >
                                            Voir toute l'activité
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Produits les plus performants avec design moderne */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-emerald-800">
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
                                            className="flex items-center space-x-4 p-4 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-700">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {product.category}
                                                </p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span className="flex items-center">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        {product.views} vues
                                                    </span>
                                                    <span className="flex items-center">
                                                        <ShoppingBag className="w-3 h-3 mr-1" />
                                                        {product.sales} ventes
                                                    </span>
                                                    <span className="flex items-center">
                                                        <DollarSign className="w-3 h-3 mr-1" />
                                                        {product.revenue.toLocaleString()}
                                                        $
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-semibold text-yellow-700">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-emerald-100">
                                    <Link to="/merchant/analytics">
                                        <Button
                                            variant="outline"
                                            className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                        >
                                            Voir toutes les statistiques
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions rapides avec design moderne */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800">
                                Actions Rapides
                            </CardTitle>
                            <CardDescription>
                                Accédez rapidement aux fonctionnalités
                                principales
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link to="/merchant/products">
                                    <Button
                                        variant="outline"
                                        className="w-full h-24 flex flex-col items-center justify-center space-y-3 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                                    >
                                        <Package className="w-8 h-8 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-700">
                                            Mes Produits
                                        </span>
                                    </Button>
                                </Link>

                                <Link to="/merchant/orders">
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            className="w-full h-24 flex flex-col items-center justify-center space-y-3 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                                        >
                                            <ShoppingBag className="w-8 h-8 text-emerald-600" />
                                            <span className="text-sm font-medium text-emerald-700">
                                                Commandes
                                            </span>
                                        </Button>
                                        {merchantStats.pendingOrders > 0 && (
                                            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">
                                                {merchantStats.pendingOrders}
                                            </Badge>
                                        )}
                                    </div>
                                </Link>

                                <Link to="/merchant/reviews">
                                    <Button
                                        variant="outline"
                                        className="w-full h-24 flex flex-col items-center justify-center space-y-3 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                                    >
                                        <MessageSquare className="w-8 h-8 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-700">
                                            Avis Clients
                                        </span>
                                    </Button>
                                </Link>

                                <Link to="/merchant/analytics">
                                    <Button
                                        variant="outline"
                                        className="w-full h-24 flex flex-col items-center justify-center space-y-3 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                                    >
                                        <BarChart3 className="w-8 h-8 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-700">
                                            Analytics
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alertes et notifications avec design moderne */}
                    {profile?.merchant_profile?.verification_status === "pending" && (
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-l-yellow-500">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-yellow-800 text-lg mb-2">
                                            Vérification en cours
                                        </h4>
                                        <p className="text-yellow-700 mb-4">
                                            Votre compte marchand est en cours de vérification.
                                            Vous recevrez une notification une fois le processus terminé.
                                        </p>
                                        <Link to="/merchant/verification">
                                            <Button
                                                variant="outline"
                                                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
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
        </MerchantLayout>
    )
}

export default MerchantDashboardPage
