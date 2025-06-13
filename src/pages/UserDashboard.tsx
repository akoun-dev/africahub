import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserLayout } from "@/components/layout/UserLayout"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AuthGuard, useAuthGuard } from "@/components/auth/AuthGuard"
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
    const { user, userProfile, profile, loading, logout } = useAuth()
    const { isAuthenticated, userEmail } = useAuthGuard()
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

    // TEMPORAIRE: Désactiver toutes les vérifications pour déboguer
    console.log(
        "🔓 UserDashboard: Toutes les vérifications désactivées pour déboguer"
    )

    // Utiliser le vrai profil du AuthContext ou un profil de secours
    const displayProfile = currentProfile ||
        profile || {
            first_name: user?.user_metadata?.first_name || "Utilisateur",
            last_name: user?.user_metadata?.last_name || "AfricaHub",
            email: user?.email || "test@example.com",
            status: "active",
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
        }

    console.log("🔍 UserDashboard: Profil utilisé:", {
        source: currentProfile
            ? "currentProfile"
            : profile
            ? "profile"
            : "fallback",
        displayProfile,
    })

    return (
        <AuthGuard>
            <UserLayout>
                {/* Header du Dashboard avec gradient bleu */}
                <div className="relative overflow-hidden bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-500 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold">
                                        Bienvenue, {displayProfile.first_name} !
                                    </h1>
                                    <p className="text-marineBlue-100 text-lg">
                                        {displayProfile.first_name}{" "}
                                        {displayProfile.last_name}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/20 text-white border-white/30"
                                        >
                                            <User className="w-3 h-3 mr-1" />
                                            Utilisateur
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-white border-white/30"
                                        >
                                            Actif
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                                    onClick={() =>
                                        handleNavigation("/user/settings")
                                    }
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Paramètres
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="border-red-300/50 text-red-200 hover:bg-red-500/20 hover:text-white backdrop-blur-sm"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Déconnexion
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Motif décoratif */}
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-brandSky/20 rounded-full"></div>
                </div>

                {/* Contenu Principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Message de Bienvenue */}
                    <div className="bg-gradient-to-r from-marineBlue-600 to-brandSky rounded-xl p-6 lg:p-8 text-white mb-8 shadow-lg">
                        <h2 className="text-xl lg:text-2xl font-bold mb-3">
                            🎉 Félicitations ! Votre compte a été créé avec
                            succès
                        </h2>
                        <p className="text-marineBlue-100 text-base lg:text-lg">
                            Vous pouvez maintenant explorer les produits,
                            comparer les prix et découvrir les meilleures offres
                            sur AfricaHub.
                        </p>
                    </div>

                    {/* Statistiques Rapides */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        <Card className="border-marineBlue-200 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-marineBlue-600">
                                            Favoris
                                        </p>
                                        <p className="text-2xl font-bold text-marineBlue-700">
                                            0
                                        </p>
                                    </div>
                                    <div className="p-3 bg-marineBlue-50 rounded-full">
                                        <Heart className="w-6 h-6 text-marineBlue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-marineBlue-200 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-marineBlue-600">
                                            Comparaisons
                                        </p>
                                        <p className="text-2xl font-bold text-marineBlue-700">
                                            0
                                        </p>
                                    </div>
                                    <div className="p-3 bg-marineBlue-50 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-marineBlue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-marineBlue-200 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-marineBlue-600">
                                            Avis donnés
                                        </p>
                                        <p className="text-2xl font-bold text-marineBlue-700">
                                            0
                                        </p>
                                    </div>
                                    <div className="p-3 bg-marineBlue-50 rounded-full">
                                        <Star className="w-6 h-6 text-marineBlue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-marineBlue-200 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-marineBlue-600">
                                            Notifications
                                        </p>
                                        <p className="text-2xl font-bold text-marineBlue-700">
                                            3
                                        </p>
                                    </div>
                                    <div className="p-3 bg-marineBlue-50 rounded-full">
                                        <Bell className="w-6 h-6 text-marineBlue-600" />
                                    </div>
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
                                    Trouvez des services et commerces près de
                                    chez vous.
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
                                            handleNavigation(
                                                "/local/reservations"
                                            )
                                        }
                                    >
                                        <Calendar className="w-4 h-4 mr-2 text-[#2D4A6B] hover:text-white transition-colors duration-200" />
                                        <span className="text-[#2D4A6B] hover:text-white transition-colors duration-200">
                                            Réservations
                                        </span>
                                    </Button>

                                    {/* Bouton de test de déconnexion (debug) */}
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200"
                                        onClick={() =>
                                            handleNavigation(
                                                "/debug/logout-test"
                                            )
                                        }
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>🧪 Test de déconnexion</span>
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
                                                {displayProfile.first_name}{" "}
                                                {displayProfile.last_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Email :
                                            </span>
                                            <span className="font-medium">
                                                {displayProfile.email ||
                                                    userEmail ||
                                                    "Email non disponible"}
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
                                                {displayProfile.status}
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
                                                    displayProfile.created_at
                                                ).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Dernière connexion :
                                            </span>
                                            <span className="font-medium">
                                                {displayProfile.last_login
                                                    ? new Date(
                                                          displayProfile.last_login
                                                      ).toLocaleDateString(
                                                          "fr-FR"
                                                      )
                                                    : "Première connexion"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </UserLayout>
        </AuthGuard>
    )
}

export default UserDashboard
