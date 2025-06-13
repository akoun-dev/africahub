/**
 * Composants wrapper pour réutiliser les vues utilisateur dans l'espace marchand
 * Ces composants extraient seulement le contenu des pages utilisateur sans leur layout
 */

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
    Bell,
    User,
    Settings,
    Package,
    MessageSquare,
    Plus,
} from "lucide-react"

/**
 * Vue Favoris pour les marchands
 * Réutilise la logique des favoris utilisateur mais avec le layout marchand
 */
export const MerchantFavoritesView: React.FC = () => {
    const { profile } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec gradient assorti à la navigation */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-3">
                                Mes Favoris
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Gérez vos produits favoris et explorez
                                facilement
                            </p>
                        </div>
                        <Heart className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Statistiques avec design amélioré */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                                0
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Total favoris
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-600 h-2 rounded-full w-0"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-700 mb-2">
                                0
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Catégories
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-700 h-2 rounded-full w-0"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-800 mb-2">
                                0
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Sélectionnés
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-800 h-2 rounded-full w-0"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                0
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Cette semaine
                            </div>
                            <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                                <div className="bg-green-600 h-2 rounded-full w-0"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Zone de recherche améliorée */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans vos favoris..."
                                        className="w-full px-6 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg"
                                    />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                            <Heart className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-4"
                                >
                                    Toutes les catégories
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-4"
                                >
                                    Plus récent
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* État vide avec design amélioré */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm min-h-[400px] flex items-center justify-center">
                    <CardContent className="p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Aucun favori pour le moment
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                            Commencez à explorer et ajoutez vos produits
                            préférés à vos favoris pour les retrouver facilement
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 text-lg shadow-lg">
                                <Package className="h-5 w-5 mr-2" />
                                Découvrir des produits
                            </Button>
                            <Button
                                variant="outline"
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-lg"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Ajouter un produit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

/**
 * Vue Avis pour les marchands
 * Affiche les avis donnés par le marchand en tant que client
 */
export const MerchantMyReviewsView: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec gradient assorti */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-3">
                                Mes Avis Clients
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Vos avis en tant que client sur AfricaHub
                            </p>
                        </div>
                        <MessageSquare className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Statistiques avec design amélioré */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                                0
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Avis donnés
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-600 h-2 rounded-full w-0"></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <div className="text-3xl font-bold text-emerald-700">
                                    0.0
                                </div>
                                <Star className="h-6 w-6 text-yellow-500 fill-current" />
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Note moyenne
                            </div>
                            <div className="flex justify-center mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className="h-4 w-4 text-gray-300"
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-emerald-800 mb-2">
                                0
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                Ce mois-ci
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2 mt-3">
                                <div className="bg-emerald-800 h-2 rounded-full w-0"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* État vide avec design amélioré */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm min-h-[400px] flex items-center justify-center">
                    <CardContent className="p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Aucun avis donné pour le moment
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                            Commencez à explorer les produits et partagez votre
                            expérience avec la communauté
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 text-lg shadow-lg">
                                <Package className="h-5 w-5 mr-2" />
                                Explorer les produits
                            </Button>
                            <Button
                                variant="outline"
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-lg"
                            >
                                <Star className="h-5 w-5 mr-2" />
                                Mes achats
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

/**
 * Vue Notifications pour les marchands
 * Affiche les notifications dans le contexte marchand
 */
export const MerchantNotificationsView: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec gradient assorti */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-3">
                                Centre de Notifications
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Restez informé de toute l'activité sur votre
                                compte
                            </p>
                        </div>
                        <div className="relative">
                            <Bell className="h-16 w-16 text-emerald-200" />
                            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-sm px-2 py-1">
                                3
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Filtres améliorés */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2"
                    >
                        Toutes
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-2"
                    >
                        Commandes
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-2"
                    >
                        Avis
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-2"
                    >
                        Système
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-6 py-2"
                    >
                        Promotions
                    </Button>
                </div>

                {/* État vide avec design amélioré */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm min-h-[400px] flex items-center justify-center">
                    <CardContent className="p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="h-12 w-12 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Aucune notification pour le moment
                        </h3>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            Vous êtes à jour ! Aucune nouvelle notification à
                            afficher.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

/**
 * Vue Profil pour les marchands
 * Gestion du profil dans le contexte marchand
 */
export const MerchantProfileView: React.FC = () => {
    const { profile } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec gradient assorti */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-3">
                                Mon Profil Marchand
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Gérez vos informations personnelles et
                                professionnelles
                            </p>
                        </div>
                        <User className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Informations de base avec design amélioré */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800">
                                Informations Personnelles
                            </CardTitle>
                            <CardDescription>
                                Vos données de base
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-emerald-700 mb-2 block">
                                    Nom complet
                                </label>
                                <p className="text-xl font-semibold text-gray-900">
                                    {profile?.first_name} {profile?.last_name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700 mb-2 block">
                                    Email
                                </label>
                                <p className="text-lg text-gray-700">
                                    {profile?.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-emerald-700 mb-2 block">
                                    Rôle
                                </label>
                                <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 px-4 py-2 text-sm">
                                    {profile?.role === "merchant"
                                        ? "Marchand Certifié"
                                        : profile?.role}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800">
                                Actions Rapides
                            </CardTitle>
                            <CardDescription>
                                Gérer votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                className="w-full justify-start bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                                size="lg"
                            >
                                <User className="h-5 w-5 mr-3" />
                                Modifier le profil
                            </Button>
                            <Button
                                className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                variant="outline"
                                size="lg"
                            >
                                <Settings className="h-5 w-5 mr-3" />
                                Paramètres du compte
                            </Button>
                            <Button
                                className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                variant="outline"
                                size="lg"
                            >
                                <Package className="h-5 w-5 mr-3" />
                                Gérer mes produits
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

/**
 * Vue Paramètres pour les marchands
 */
export const MerchantSettingsView: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="p-6 space-y-6">
                {/* En-tête avec gradient assorti */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
                    {/* Motifs décoratifs */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-5 -bottom-5 w-24 h-24 bg-emerald-400/20 rounded-full"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-3">
                                Paramètres
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Configurez vos préférences et paramètres de
                                compte
                            </p>
                        </div>
                        <Settings className="h-16 w-16 text-emerald-200" />
                    </div>
                </div>

                {/* Sections de paramètres avec design amélioré */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center">
                                <Bell className="h-5 w-5 mr-2" />
                                Notifications
                            </CardTitle>
                            <CardDescription>
                                Gérer vos préférences de notification
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-emerald-800">
                                        Notifications par email
                                    </p>
                                    <p className="text-sm text-emerald-600">
                                        Recevoir les mises à jour importantes
                                    </p>
                                </div>
                                <div className="w-12 h-6 bg-emerald-200 rounded-full relative">
                                    <div className="w-5 h-5 bg-emerald-600 rounded-full absolute top-0.5 right-0.5"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Notifications push
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Alertes en temps réel
                                    </p>
                                </div>
                                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center">
                                <Settings className="h-5 w-5 mr-2" />
                                Sécurité
                            </CardTitle>
                            <CardDescription>
                                Paramètres de sécurité du compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                variant="outline"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Changer le mot de passe
                            </Button>
                            <Button
                                className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                variant="outline"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Authentification à deux facteurs
                            </Button>
                            <Button
                                className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                variant="outline"
                            >
                                <Bell className="h-4 w-4 mr-2" />
                                Sessions actives
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
