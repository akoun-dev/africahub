import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Store,
    Package,
    TrendingUp,
    Users,
    Settings,
    Bell,
    CheckCircle,
    Clock,
    AlertCircle,
    Plus,
    BarChart3,
    MapPin,
} from "lucide-react"

/**
 * Dashboard pour les marchands
 * Affiche les informations du business et les outils de gestion
 */
const MerchantDashboard: React.FC = () => {
    const { user, userProfile, merchantProfile } = useAuth()

    if (!user || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Chargement de votre dashboard marchand...
                    </p>
                </div>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "verified":
                return "bg-green-100 text-green-800 border-green-200"
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "verified":
                return <CheckCircle className="w-4 h-4" />
            case "pending":
                return <Clock className="w-4 h-4" />
            case "rejected":
                return <AlertCircle className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header du Dashboard */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                <Store className="w-8 h-8 text-amber-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {merchantProfile?.business_name ||
                                        "Mon Commerce"}
                                </h1>
                                <p className="text-gray-600">
                                    {userProfile.first_name}{" "}
                                    {userProfile.last_name}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Badge
                                        variant="secondary"
                                        className="bg-amber-100 text-amber-800"
                                    >
                                        <Store className="w-3 h-3 mr-1" />
                                        Marchand
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={getStatusColor(
                                            merchantProfile?.verification_status ||
                                                "pending"
                                        )}
                                    >
                                        {getStatusIcon(
                                            merchantProfile?.verification_status ||
                                                "pending"
                                        )}
                                        <span className="ml-1">
                                            {merchantProfile?.verification_status ===
                                                "verified" && "Vérifié"}
                                            {merchantProfile?.verification_status ===
                                                "pending" && "En attente"}
                                            {merchantProfile?.verification_status ===
                                                "rejected" && "Rejeté"}
                                            {!merchantProfile?.verification_status &&
                                                "En attente"}
                                        </span>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Paramètres
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenu Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message de Bienvenue */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-6 text-white mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                        🏪 Bienvenue sur votre espace marchand !
                    </h2>
                    <p className="text-amber-100">
                        {merchantProfile?.verification_status === "pending"
                            ? "Votre compte est en cours de vérification. Vous recevrez un email une fois la vérification terminée."
                            : "Gérez votre commerce, ajoutez vos produits et développez votre activité sur AfricaHub."}
                    </p>
                </div>

                {/* Statistiques Rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Produits
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <Package className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Vues
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Clients
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <Users className="w-8 h-8 text-purple-500" />
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
                                        2
                                    </p>
                                </div>
                                <Bell className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Rapides */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                Gestion des Produits
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Ajoutez et gérez vos produits pour les rendre
                                visibles aux clients.
                            </p>
                            <div className="space-y-2">
                                <Button className="w-full justify-start">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter un Produit
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Gérer l'Inventaire
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Statistiques de Vente
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Store className="w-5 h-5 mr-2 text-amber-600" />
                                Mon Commerce
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Gérez les informations de votre commerce et
                                votre présence en ligne.
                            </p>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Modifier le Profil
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Localisation
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Informations du Commerce */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Store className="w-5 h-5 mr-2 text-gray-600" />
                            Informations du Commerce
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Détails du Commerce
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Nom du commerce :
                                        </span>
                                        <span className="font-medium">
                                            {merchantProfile?.business_name ||
                                                "Non défini"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Secteur :
                                        </span>
                                        <span className="font-medium">
                                            {merchantProfile?.business_sector ||
                                                "Non défini"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Type :
                                        </span>
                                        <span className="font-medium">
                                            {merchantProfile?.business_type ||
                                                "Non défini"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Statut :
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={getStatusColor(
                                                merchantProfile?.verification_status ||
                                                    "pending"
                                            )}
                                        >
                                            {merchantProfile?.verification_status ||
                                                "pending"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Contact
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email principal :
                                        </span>
                                        <span className="font-medium">
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email business :
                                        </span>
                                        <span className="font-medium">
                                            {merchantProfile?.business_email ||
                                                "Non défini"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Téléphone :
                                        </span>
                                        <span className="font-medium">
                                            {merchantProfile?.business_phone ||
                                                "Non défini"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Adresse :
                                        </span>
                                        <span className="font-medium">
                                            {merchantProfile?.business_address ||
                                                "Non définie"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {merchantProfile?.business_description && (
                            <div className="mt-6">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Description
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {merchantProfile.business_description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MerchantDashboard
