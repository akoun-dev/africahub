// 🧪 Page de test pour toutes les fonctionnalités utilisateur
// Permet de vérifier que les migrations et hooks fonctionnent correctement

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    Bug,
    Heart,
    Star,
    Bell,
    History,
    Settings,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import useFavorites from "@/hooks/useFavorites"
import useUserReviews from "@/hooks/useUserReviews"
import useUserNotifications from "@/hooks/useUserNotifications"
import useUserHistory from "@/hooks/useUserHistory"
import useUserSettings from "@/hooks/useUserSettings"
import { toast } from "sonner"

export const UserFeaturesTestPage: React.FC = () => {
    const { user, profile } = useAuth()
    const [testResults, setTestResults] = useState<
        Record<string, "loading" | "success" | "error">
    >({})

    // Hooks pour les fonctionnalités
    const favorites = useFavorites()
    const reviews = useUserReviews()
    const notifications = useUserNotifications()
    const history = useUserHistory()
    const settings = useUserSettings()

    const getStatusIcon = (status?: "loading" | "success" | "error") => {
        switch (status) {
            case "loading":
                return (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                )
            case "success":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "error":
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />
        }
    }

    const testFavorites = async () => {
        setTestResults(prev => ({ ...prev, favorites: "loading" }))
        try {
            // Test d'ajout d'un favori
            await favorites.addFavorite({
                productId: "test-product-1",
                productName: "Produit de test",
                productBrand: "Marque Test",
                productPrice: 25000,
                productCurrency: "XOF",
                productCategory: "Électronique",
                productSector: "Technologie",
                productCountry: "Côte d'Ivoire",
            })

            setTestResults(prev => ({ ...prev, favorites: "success" }))
            toast.success("Test favoris réussi !")
        } catch (error) {
            console.error("Test favoris échoué:", error)
            setTestResults(prev => ({ ...prev, favorites: "error" }))
            toast.error("Test favoris échoué")
        }
    }

    const testReviews = async () => {
        setTestResults(prev => ({ ...prev, reviews: "loading" }))
        try {
            // Test de création d'un avis
            await reviews.createReview({
                product_id: "test-product-2",
                product_name: "Produit Test Avis",
                product_brand: "Marque Test",
                product_category: "Électronique",
                rating: 5,
                title: "Excellent produit !",
                content:
                    "Je recommande vivement ce produit. Très bonne qualité.",
                metadata: { test: true },
            })

            setTestResults(prev => ({ ...prev, reviews: "success" }))
            toast.success("Test avis réussi !")
        } catch (error) {
            console.error("Test avis échoué:", error)
            setTestResults(prev => ({ ...prev, reviews: "error" }))
            toast.error("Test avis échoué")
        }
    }

    const testHistory = async () => {
        setTestResults(prev => ({ ...prev, history: "loading" }))
        try {
            // Test d'ajout à l'historique
            await history.trackView(
                "test-product-3",
                "Produit Test Historique",
                "Marque Test"
            )
            await history.trackSearch(
                "smartphone",
                "Électronique",
                "Technologie"
            )

            setTestResults(prev => ({ ...prev, history: "success" }))
            toast.success("Test historique réussi !")
        } catch (error) {
            console.error("Test historique échoué:", error)
            setTestResults(prev => ({ ...prev, history: "error" }))
            toast.error("Test historique échoué")
        }
    }

    const testSettings = async () => {
        setTestResults(prev => ({ ...prev, settings: "loading" }))
        try {
            // Test de mise à jour des paramètres
            await settings.updateSettings({
                email_notifications: true,
                theme: "light",
                language: "fr",
                currency: "XOF",
            })

            setTestResults(prev => ({ ...prev, settings: "success" }))
            toast.success("Test paramètres réussi !")
        } catch (error) {
            console.error("Test paramètres échoué:", error)
            setTestResults(prev => ({ ...prev, settings: "error" }))
            toast.error("Test paramètres échoué")
        }
    }

    const runAllTests = async () => {
        toast.info("Lancement de tous les tests...")
        await testFavorites()
        await testReviews()
        await testHistory()
        await testSettings()
        toast.success("Tous les tests terminés !")
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bug className="w-5 h-5" />
                                Test des fonctionnalités utilisateur
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Vous devez être connecté pour tester les
                                fonctionnalités utilisateur.
                            </p>
                            <Link
                                to="/auth?mode=login"
                                className="mt-4 inline-block"
                            >
                                <Button>Se connecter</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/user/dashboard">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Bug className="w-8 h-8 text-blue-600" />
                                Test des fonctionnalités utilisateur
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Vérification des migrations et fonctionnalités
                                d'AfricaHub
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={runAllTests}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Lancer tous les tests
                    </Button>
                </div>

                {/* Informations utilisateur */}
                <Card>
                    <CardHeader>
                        <CardTitle>Utilisateur connecté</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                    <strong>ID:</strong> {user.id}
                                </p>
                            </div>
                            {profile && (
                                <div>
                                    <p>
                                        <strong>Nom:</strong>{" "}
                                        {profile.first_name} {profile.last_name}
                                    </p>
                                    <p>
                                        <strong>Rôle:</strong> {profile.role}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tests des fonctionnalités */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview">
                            Vue d'ensemble
                        </TabsTrigger>
                        <TabsTrigger value="favorites">Favoris</TabsTrigger>
                        <TabsTrigger value="reviews">Avis</TabsTrigger>
                        <TabsTrigger value="notifications">
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="history">Historique</TabsTrigger>
                        <TabsTrigger value="settings">Paramètres</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Test Favoris */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        Favoris
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">État:</span>
                                        {getStatusIcon(testResults.favorites)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total:</span>
                                        <Badge variant="secondary">
                                            {favorites.favorites.length}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={testFavorites}
                                        size="sm"
                                        className="w-full"
                                        disabled={favorites.isLoading}
                                    >
                                        {favorites.isLoading
                                            ? "Test..."
                                            : "Tester"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Test Avis */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        Avis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">État:</span>
                                        {getStatusIcon(testResults.reviews)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total:</span>
                                        <Badge variant="secondary">
                                            {reviews.stats.total}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={testReviews}
                                        size="sm"
                                        className="w-full"
                                        disabled={reviews.isLoading}
                                    >
                                        {reviews.isLoading
                                            ? "Test..."
                                            : "Tester"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Test Notifications */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bell className="w-5 h-5 text-blue-500" />
                                        Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">État:</span>
                                        {getStatusIcon(
                                            testResults.notifications
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                            Non lues:
                                        </span>
                                        <Badge variant="secondary">
                                            {notifications.stats.unread}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => notifications.refetch()}
                                        size="sm"
                                        className="w-full"
                                        disabled={notifications.isLoading}
                                    >
                                        {notifications.isLoading
                                            ? "Chargement..."
                                            : "Actualiser"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Test Historique */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <History className="w-5 h-5 text-green-500" />
                                        Historique
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">État:</span>
                                        {getStatusIcon(testResults.history)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total:</span>
                                        <Badge variant="secondary">
                                            {history.stats.total}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={testHistory}
                                        size="sm"
                                        className="w-full"
                                        disabled={history.isLoading}
                                    >
                                        {history.isLoading
                                            ? "Test..."
                                            : "Tester"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="favorites">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test des favoris</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {favorites.favorites.length}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total favoris
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {favorites.stats.byCategory
                                                    .Électronique || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Électronique
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {favorites.stats.byCountry[
                                                    "Côte d'Ivoire"
                                                ] || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Côte d'Ivoire
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {favorites.stats.bySector
                                                    .Technologie || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Technologie
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={testFavorites}
                                        disabled={favorites.isLoading}
                                    >
                                        {favorites.isLoading
                                            ? "Test en cours..."
                                            : "Tester l'ajout d'un favori"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test des avis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {reviews.stats.total}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total avis
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {reviews.stats.published}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Publiés
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {reviews.stats.pending}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                En attente
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {reviews.stats.averageRating.toFixed(
                                                    1
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Note moyenne
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={testReviews}
                                        disabled={reviews.isLoading}
                                    >
                                        {reviews.isLoading
                                            ? "Test en cours..."
                                            : "Tester la création d'un avis"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test des notifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {notifications.stats.total}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                                {notifications.stats.unread}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Non lues
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {notifications.stats.read}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Lues
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {notifications.stats.today}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Aujourd'hui
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => notifications.refetch()}
                                        disabled={notifications.isLoading}
                                    >
                                        {notifications.isLoading
                                            ? "Chargement..."
                                            : "Actualiser les notifications"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test de l'historique</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {history.stats.total}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total actions
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {history.stats.searches}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Recherches
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {history.stats.views}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Consultations
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {history.stats.today}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Aujourd'hui
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={testHistory}
                                        disabled={history.isLoading}
                                    >
                                        {history.isLoading
                                            ? "Test en cours..."
                                            : "Tester l'ajout à l'historique"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test des paramètres</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {settings.settings ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">
                                                    Notifications
                                                </h4>
                                                <ul className="text-sm space-y-1">
                                                    <li>
                                                        Email:{" "}
                                                        {settings.settings
                                                            .email_notifications
                                                            ? "✅"
                                                            : "❌"}
                                                    </li>
                                                    <li>
                                                        Push:{" "}
                                                        {settings.settings
                                                            .push_notifications
                                                            ? "✅"
                                                            : "❌"}
                                                    </li>
                                                    <li>
                                                        Alertes prix:{" "}
                                                        {settings.settings
                                                            .price_alerts
                                                            ? "✅"
                                                            : "❌"}
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">
                                                    Préférences
                                                </h4>
                                                <ul className="text-sm space-y-1">
                                                    <li>
                                                        Langue:{" "}
                                                        {
                                                            settings.settings
                                                                .language
                                                        }
                                                    </li>
                                                    <li>
                                                        Devise:{" "}
                                                        {
                                                            settings.settings
                                                                .currency
                                                        }
                                                    </li>
                                                    <li>
                                                        Thème:{" "}
                                                        {
                                                            settings.settings
                                                                .theme
                                                        }
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">
                                            Chargement des paramètres...
                                        </p>
                                    )}

                                    <Button
                                        onClick={testSettings}
                                        disabled={settings.isLoading}
                                    >
                                        {settings.isLoading
                                            ? "Test en cours..."
                                            : "Tester la mise à jour des paramètres"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default UserFeaturesTestPage
