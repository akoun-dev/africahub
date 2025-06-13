/**
 * Routes spécifiques aux marchands
 * Gestion de la navigation et des pages pour les utilisateurs marchands
 */

import React, { Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AuthGuard } from "@/components/auth/AuthGuard"

// Import des pages marchands
const MerchantDashboardPage = React.lazy(() => import("@/pages/merchant/MerchantDashboardPage"))
const MerchantProductsPage = React.lazy(() => import("@/pages/merchant/MerchantProductsPage"))
const MerchantProductFormPage = React.lazy(() => import("@/pages/merchant/MerchantProductFormPage"))
const MerchantReviewsPage = React.lazy(() => import("@/pages/merchant/MerchantReviewsPage"))
const MerchantAnalyticsPage = React.lazy(() => import("@/pages/merchant/MerchantAnalyticsPage"))

// Pages communes (réutilisées depuis les routes utilisateur)
const UserProfilePage = React.lazy(() => import("@/pages/user/UserProfilePage"))
const UserSettingsPage = React.lazy(() => import("@/pages/user/UserSettingsPage"))
const UserNotificationsPage = React.lazy(() => import("@/pages/user/UserNotificationsPage"))

// Page 404 pour les routes marchands
const NotFound = React.lazy(() => import("@/pages/NotFound"))

/**
 * Composant de routes pour les marchands
 * Gère toutes les routes sous /merchant/*
 */
const MerchantRoutes: React.FC = () => {
    return (
        <AuthGuard>
            <Routes>
                {/* Dashboard principal */}
                <Route
                    path="/"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement du dashboard..."
                                />
                            }
                        >
                            <MerchantDashboardPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement du dashboard..."
                                />
                            }
                        >
                            <MerchantDashboardPage />
                        </Suspense>
                    }
                />

                {/* Gestion des produits */}
                <Route
                    path="/products"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des produits..."
                                />
                            }
                        >
                            <MerchantProductsPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/products/new"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement du formulaire..."
                                />
                            }
                        >
                            <MerchantProductFormPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/products/:productId"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement du produit..."
                                />
                            }
                        >
                            <MerchantProductFormPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/products/:productId/edit"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement de l'éditeur..."
                                />
                            }
                        >
                            <MerchantProductFormPage />
                        </Suspense>
                    }
                />

                {/* Gestion des avis */}
                <Route
                    path="/reviews"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des avis..."
                                />
                            }
                        >
                            <MerchantReviewsPage />
                        </Suspense>
                    }
                />

                {/* Analytics et statistiques */}
                <Route
                    path="/analytics"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des analytics..."
                                />
                            }
                        >
                            <MerchantAnalyticsPage />
                        </Suspense>
                    }
                />

                {/* Gestion des commandes (à implémenter) */}
                <Route
                    path="/orders"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des commandes..."
                                />
                            }
                        >
                            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                                <div className="max-w-7xl mx-auto">
                                    <div className="text-center py-12">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                            Gestion des Commandes
                                        </h1>
                                        <p className="text-gray-600">
                                            Cette fonctionnalité sera bientôt disponible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Suspense>
                    }
                />

                {/* Gestion des promotions (à implémenter) */}
                <Route
                    path="/promotions"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des promotions..."
                                />
                            }
                        >
                            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                                <div className="max-w-7xl mx-auto">
                                    <div className="text-center py-12">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                            Gestion des Promotions
                                        </h1>
                                        <p className="text-gray-600">
                                            Cette fonctionnalité sera bientôt disponible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Suspense>
                    }
                />

                {/* Activité et historique (à implémenter) */}
                <Route
                    path="/activity"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement de l'activité..."
                                />
                            }
                        >
                            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                                <div className="max-w-7xl mx-auto">
                                    <div className="text-center py-12">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                            Activité du Compte
                                        </h1>
                                        <p className="text-gray-600">
                                            Cette fonctionnalité sera bientôt disponible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Suspense>
                    }
                />

                {/* Pages communes réutilisées */}
                <Route
                    path="/profile"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement du profil..."
                                />
                            }
                        >
                            <UserProfilePage />
                        </Suspense>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des paramètres..."
                                />
                            }
                        >
                            <UserSettingsPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des notifications..."
                                />
                            }
                        >
                            <UserNotificationsPage />
                        </Suspense>
                    }
                />

                {/* Page 404 pour les routes marchands */}
                <Route
                    path="*"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement..."
                                />
                            }
                        >
                            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
                                <div className="max-w-7xl mx-auto">
                                    <div className="text-center py-12">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                            Page non trouvée
                                        </h1>
                                        <p className="text-gray-600 mb-6">
                                            La page que vous recherchez n'existe pas dans l'espace marchand.
                                        </p>
                                        <a
                                            href="/merchant/dashboard"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Retour au dashboard
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Suspense>
                    }
                />
            </Routes>
        </AuthGuard>
    )
}

export default MerchantRoutes
