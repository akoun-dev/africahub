import React from "react"
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
    User,
    Heart,
    ShoppingCart,
    Star,
    Settings,
    Bell,
    TrendingUp,
    Package,
    MapPin,
    Calendar,
    LogOut,
} from "lucide-react"

/**
 * Dashboard pour les utilisateurs simples
 * Affiche les informations du profil et les actions disponibles
 */
const UserDashboard: React.FC = () => {
    const { user, userProfile, profile, loading, logout } = useEnhancedAuth()
    const navigate = useNavigate()

    // Utiliser profile ou userProfile selon ce qui est disponible
    const currentProfile = userProfile || profile

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Déconnexion réussie")
            navigate("/auth")
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error)
            toast.error("Erreur lors de la déconnexion")
        }
    }

    // Fonctions de navigation
    const handleNavigation = (path: string) => {
        navigate(path)
    }

    console.log("🔍 UserDashboard: Debug info", {
        hasUser: !!user,
        hasUserProfile: !!userProfile,
        hasProfile: !!profile,
        loading,
        currentProfile,
    })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Chargement de votre dashboard...
                    </p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        Erreur: Utilisateur non connecté
                    </p>
                    <button
                        onClick={() => (window.location.href = "/auth")}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        )
    }

    // Si pas de profil, afficher un message d'erreur avec option de création
    if (!currentProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                            Profil en cours de création
                        </h2>
                        <p className="text-yellow-700 mb-4">
                            Votre profil utilisateur est en cours de
                            configuration. Veuillez rafraîchir la page dans
                            quelques instants.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            Rafraîchir la page
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header du Dashboard */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-[#2D4A6B]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Bienvenue, {currentProfile.first_name} !
                                </h1>
                                <p className="text-gray-600">
                                    {currentProfile.first_name}{" "}
                                    {currentProfile.last_name}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-[#2D4A6B]"
                                    >
                                        <User className="w-3 h-3 mr-1" />
                                        Utilisateur
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-[#2D4A6B] border-[#2D4A6B]"
                                    >
                                        Actif
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white transition-all duration-200 group"
                            >
                                <Settings className="w-4 h-4 mr-2 group-hover:text-white transition-colors duration-200" />
                                Paramètres
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-600 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 group"
                            >
                                <LogOut className="w-4 h-4 mr-2 group-hover:text-white transition-colors duration-200" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message de Bienvenue */}
                <div className="bg-gradient-to-r from-[#2D4A6B] to-[#3A5A7A] rounded-lg p-6 text-white mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                        🎉 Félicitations ! Votre compte a été créé avec succès
                    </h2>
                    <p className="text-blue-100">
                        Vous pouvez maintenant explorer les produits, comparer
                        les prix et découvrir les meilleures offres sur
                        AfricaHub.
                    </p>
                </div>

                {/* Statistiques Rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Favoris
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <Heart className="w-8 h-8 text-[#2D4A6B]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Comparaisons
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-[#2D4A6B]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Avis donnés
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <Star className="w-8 h-8 text-[#2D4A6B]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Notifications
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        3
                                    </p>
                                </div>
                                <Bell className="w-8 h-8 text-[#2D4A6B]" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Rapides */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="w-5 h-5 mr-2 text-[#2D4A6B] hover:text-white" />
                                Explorer les Produits
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Découvrez des milliers de produits dans
                                différentes catégories.
                            </p>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white hover:border-[#2D4A6B] transition-all duration-200 [&:hover_svg]:text-white [&:hover_span]:text-white"
                                    onClick={() =>
                                        handleNavigation("/secteurs")
                                    }
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                    <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                        Parcourir les Catégories
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white hover:border-[#2D4A6B] transition-all duration-200 [&:hover_svg]:text-white [&:hover_span]:text-white"
                                    onClick={() =>
                                        handleNavigation("/trending")
                                    }
                                >
                                    <TrendingUp className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                    <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                        Produits Tendance
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white hover:border-[#2D4A6B] transition-all duration-200 [&:hover_svg]:text-white [&:hover_span]:text-white"
                                    onClick={() =>
                                        handleNavigation("/top-rated")
                                    }
                                >
                                    <Star className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                    <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                        Mieux Notés
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-[#2D4A6B] hover:text-white" />
                                Services Locaux
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Trouvez des services et commerces près de chez
                                vous.
                            </p>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white hover:border-[#2D4A6B] transition-all duration-200 [&:hover_svg]:text-white [&:hover_span]:text-white"
                                    onClick={() =>
                                        handleNavigation("/local/nearby")
                                    }
                                >
                                    <MapPin className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                    <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                        Commerces à Proximité
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white hover:border-[#2D4A6B] transition-all duration-200 [&:hover_svg]:text-white [&:hover_span]:text-white"
                                    onClick={() =>
                                        handleNavigation("/local/delivery")
                                    }
                                >
                                    <Package className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                    <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                        Services de Livraison
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-[#2D4A6B] text-[#2D4A6B] hover:bg-[#2D4A6B] hover:text-white hover:border-[#2D4A6B] transition-all duration-200 [&:hover_svg]:text-white [&:hover_span]:text-white"
                                    onClick={() =>
                                        handleNavigation("/local/reservations")
                                    }
                                >
                                    <Calendar className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                    <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                        Réservations
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Informations du Compte */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-[#2D4A6B] hover:text-white" />
                            Informations du Compte
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Informations Personnelles
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Nom complet :
                                        </span>
                                        <span className="font-medium">
                                            {currentProfile.first_name}{" "}
                                            {currentProfile.last_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email :
                                        </span>
                                        <span className="font-medium">
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Type de compte :
                                        </span>
                                        <Badge variant="secondary">
                                            Utilisateur
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Statut :
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="text-[#2D4A6B] border-[#2D4A6B]"
                                        >
                                            {currentProfile.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Activité du Compte
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Membre depuis :
                                        </span>
                                        <span className="font-medium">
                                            {new Date(
                                                currentProfile.created_at
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Dernière connexion :
                                        </span>
                                        <span className="font-medium">
                                            {currentProfile.last_login
                                                ? new Date(
                                                      currentProfile.last_login
                                                  ).toLocaleDateString("fr-FR")
                                                : "Première connexion"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UserDashboard
