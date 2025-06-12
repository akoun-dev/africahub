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
    Heart,
    Star,
    ShoppingCart,
    TrendingUp,
    Bell,
    Settings,
    User,
    MapPin,
    Calendar,
    Activity,
    Search,
    LogOut,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

/**
 * Dashboard principal pour les utilisateurs simples
 * Affiche un aperçu de l'activité, favoris, avis, recommandations
 * Design cohérent avec SimplifiedHome.tsx
 */
export const UserDashboardPage: React.FC = () => {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success("Déconnexion réussie")
            navigate("/")
        } catch (error) {
            toast.error("Erreur lors de la déconnexion")
        }
    }

    // Données simulées - à remplacer par de vraies données
    const userStats = {
        favorites: 12,
        reviews: 8,
        comparisons: 24,
        savings: 450,
    }

    const recentActivity = [
        {
            id: 1,
            type: "favorite",
            title: "Ajouté aux favoris",
            description: "Smartphone Samsung Galaxy S24",
            time: "2 heures",
            icon: Heart,
        },
        {
            id: 2,
            type: "review",
            title: "Avis publié",
            description: "Banque Ecobank - Service client",
            time: "1 jour",
            icon: Star,
        },
        {
            id: 3,
            type: "comparison",
            title: "Comparaison effectuée",
            description: "Assurances auto - 5 offres",
            time: "3 jours",
            icon: TrendingUp,
        },
    ]

    const recommendations = [
        {
            id: 1,
            title: "Nouvelle offre bancaire",
            description: "Compte épargne avec 5% d'intérêt",
            category: "Banque",
            savings: "120 $/an",
        },
        {
            id: 2,
            title: "Assurance santé familiale",
            description: "Couverture complète à prix réduit",
            category: "Assurance",
            savings: "200 $/an",
        },
    ]

    return (
        <div className="min-h-screen p-4 lg:p-8 bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* En-tête de bienvenue */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Bonjour, {profile?.first_name} ! 👋
                        </h1>
                        <p className="text-slate-200 mt-2">
                            Découvrez les meilleures offres et gérez vos
                            préférences
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Notifications
                        </Button>
                        <Link to="/user/profile">
                            <Button
                                size="sm"
                                className="bg-white/20 text-white hover:bg-white/30 border-white/20"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Paramètres
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSignOut}
                            className="border-white/20 text-white hover:bg-red-500/20 hover:border-red-300/40"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                        </Button>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        className="text-center backdrop-blur-sm border-white/20 shadow-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Heart className="w-8 h-8 text-marineBlue-600" />
                            </div>
                            <div className="text-2xl font-bold text-marineBlue-600">
                                {userStats.favorites}
                            </div>
                            <p className="text-sm text-slate-600">Favoris</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="text-center backdrop-blur-sm border-white/20 shadow-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="w-8 h-8 text-marineBlue-600" />
                            </div>
                            <div className="text-2xl font-bold text-marineBlue-600">
                                {userStats.reviews}
                            </div>
                            <p className="text-sm text-slate-600">Avis</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="text-center backdrop-blur-sm border-white/20 shadow-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="w-8 h-8 text-marineBlue-600" />
                            </div>
                            <div className="text-2xl font-bold text-marineBlue-600">
                                {userStats.comparisons}
                            </div>
                            <p className="text-sm text-slate-600">
                                Comparaisons
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="text-center backdrop-blur-sm border-white/20 shadow-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center mb-2">
                                <ShoppingCart className="w-8 h-8 text-marineBlue-600" />
                            </div>
                            <div className="text-2xl font-bold text-marineBlue-600">
                                {userStats.savings}$
                            </div>
                            <p className="text-sm text-slate-600">Économies</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Activité récente */}
                    <Card
                        className="backdrop-blur-sm border-white/20 shadow-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center text-marineBlue-600">
                                <Activity className="w-5 h-5 mr-2" />
                                Activité Récente
                            </CardTitle>
                            <CardDescription>
                                Vos dernières actions sur la plateforme
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map(activity => {
                                    const Icon = activity.icon
                                    return (
                                        <div
                                            key={activity.id}
                                            className="flex items-start space-x-3"
                                        >
                                            <div className="p-2 rounded-lg bg-marineBlue-100">
                                                <Icon className="w-4 h-4 text-marineBlue-600" />
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
                                <Link to="/user/activity">
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

                    {/* Recommandations personnalisées */}
                    <Card
                        className="backdrop-blur-sm border-white/20 shadow-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center text-marineBlue-600">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Recommandations
                            </CardTitle>
                            <CardDescription>
                                Offres personnalisées pour vous
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recommendations.map(rec => (
                                    <div
                                        key={rec.id}
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-900">
                                                    {rec.title}
                                                </h4>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {rec.description}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge variant="secondary">
                                                        {rec.category}
                                                    </Badge>
                                                    <span className="text-sm font-medium text-marineBlue-600">
                                                        Économie: {rec.savings}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full mt-3 bg-marineBlue-600 hover:bg-marineBlue-700 text-white"
                                        >
                                            Voir l'offre
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/recommendations">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Toutes les recommandations
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Explorer les Produits */}
                <Card
                    className="backdrop-blur-sm border-white/20 shadow-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center text-marineBlue-600">
                            <Search className="w-5 h-5 mr-2" />
                            Explorer les Produits
                        </CardTitle>
                        <CardDescription>
                            Découvrez des milliers de produits dans différentes
                            catégories.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/secteurs" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 flex items-center justify-start space-x-3 hover:bg-marineBlue-50 border-marineBlue-200 hover:border-marineBlue-300"
                                >
                                    <MapPin className="w-5 h-5 text-marineBlue-600" />
                                    <span className="text-sm font-medium text-marineBlue-700">
                                        Parcourir les Catégories
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/trending" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 flex items-center justify-start space-x-3 hover:bg-marineBlue-50 border-marineBlue-200 hover:border-marineBlue-300"
                                >
                                    <TrendingUp className="w-5 h-5 text-marineBlue-600" />
                                    <span className="text-sm font-medium text-marineBlue-700">
                                        Produits Tendance
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/favorites" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 flex items-center justify-start space-x-3 hover:bg-marineBlue-50 border-marineBlue-200 hover:border-marineBlue-300"
                                >
                                    <Star className="w-5 h-5 text-marineBlue-600" />
                                    <span className="text-sm font-medium text-marineBlue-700">
                                        Mieux Notés
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Services Locaux */}
                <Card
                    className="backdrop-blur-sm border-white/20 shadow-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center text-marineBlue-600">
                            <MapPin className="w-5 h-5 mr-2" />
                            Services Locaux
                        </CardTitle>
                        <CardDescription>
                            Trouvez des services et commerces près de chez vous.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/local/nearby" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 flex items-center justify-start space-x-3 hover:bg-marineBlue-50 border-marineBlue-200 hover:border-marineBlue-300"
                                >
                                    <MapPin className="w-5 h-5 text-marineBlue-600" />
                                    <span className="text-sm font-medium text-marineBlue-700">
                                        Commerces à Proximité
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/local/delivery" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 flex items-center justify-start space-x-3 hover:bg-marineBlue-50 border-marineBlue-200 hover:border-marineBlue-300"
                                >
                                    <ShoppingCart className="w-5 h-5 text-marineBlue-600" />
                                    <span className="text-sm font-medium text-marineBlue-700">
                                        Services de Livraison
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/local/reservations" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full h-16 flex items-center justify-start space-x-3 hover:bg-marineBlue-50 border-marineBlue-200 hover:border-marineBlue-300"
                                >
                                    <Calendar className="w-5 h-5 text-marineBlue-600" />
                                    <span className="text-sm font-medium text-marineBlue-700">
                                        Réservations
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card
                    className="backdrop-blur-sm border-white/20 shadow-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
                >
                    <CardHeader>
                        <CardTitle className="text-marineBlue-600">
                            Actions Rapides
                        </CardTitle>
                        <CardDescription>
                            Accédez rapidement aux fonctionnalités principales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link to="/secteurs">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <MapPin
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Explorer</span>
                                </Button>
                            </Link>

                            <Link to="/favorites">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Heart
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Favoris</span>
                                </Button>
                            </Link>

                            <Link to="/my-reviews">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <Star
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Mes Avis</span>
                                </Button>
                            </Link>

                            <Link to="/compare">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <TrendingUp
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Comparer</span>
                                </Button>
                            </Link>

                            <Link to="/user/profile">
                                <Button
                                    variant="outline"
                                    className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                                >
                                    <User
                                        className="w-6 h-6"
                                        style={{ color: "#2D4A6B" }}
                                    />
                                    <span className="text-sm">Profil</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UserDashboardPage
