/**
 * Routes spécifiques aux marchands
 * Gestion de la navigation et des pages pour les utilisateurs marchands
 */

import React, { Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AuthGuard } from "@/components/auth/AuthGuard"

// Import des pages marchands
const MerchantDashboardPage = React.lazy(
    () => import("@/pages/merchant/MerchantDashboardPage")
)
const MerchantProductsPage = React.lazy(
    () => import("@/pages/merchant/MerchantProductsPage")
)
const MerchantProductFormPage = React.lazy(
    () => import("@/pages/merchant/MerchantProductFormPage")
)
const MerchantReviewsPage = React.lazy(
    () => import("@/pages/merchant/MerchantReviewsPage")
)
const MerchantAnalyticsPage = React.lazy(
    () => import("@/pages/merchant/MerchantAnalyticsPage")
)
const MerchantOrdersPage = React.lazy(
    () => import("@/pages/merchant/MerchantOrdersPage")
)
const MerchantPromotionsPage = React.lazy(
    () => import("@/pages/merchant/MerchantPromotionsPage")
)
const MerchantActivityPage = React.lazy(
    () => import("@/pages/merchant/MerchantActivityPage")
)

// Import du layout marchand et des vues spécialisées
import {
    MerchantLayout,
    MerchantFavoritesView,
    MerchantMyReviewsView,
    MerchantNotificationsView,
    MerchantProfileView,
    MerchantSettingsView,
} from "@/components/merchant"

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
                            <MerchantLayout>
                                <MerchantProductsPage />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantProductFormPage />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantProductFormPage />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantProductFormPage />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantReviewsPage />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantAnalyticsPage />
                            </MerchantLayout>
                        </Suspense>
                    }
                />

                {/* Gestion des commandes */}
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
                            <MerchantLayout>
                                <MerchantOrdersPage />
                            </MerchantLayout>
                        </Suspense>
                    }
                />

                {/* Gestion des promotions */}
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
                            <MerchantLayout>
                                <MerchantPromotionsPage />
                            </MerchantLayout>
                        </Suspense>
                    }
                />

                {/* Activité et historique */}
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
                            <MerchantLayout>
                                <MerchantActivityPage />
                            </MerchantLayout>
                        </Suspense>
                    }
                />

                {/* Pages communes avec vues marchands spécialisées */}
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
                            <MerchantLayout>
                                <MerchantProfileView />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantSettingsView />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <MerchantNotificationsView />
                            </MerchantLayout>
                        </Suspense>
                    }
                />

                {/* Routes vers vues utilisateur avec layout marchand */}
                <Route
                    path="/favorites"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement des favoris..."
                                />
                            }
                        >
                            <MerchantLayout>
                                <MerchantFavoritesView />
                            </MerchantLayout>
                        </Suspense>
                    }
                />
                <Route
                    path="/my-reviews"
                    element={
                        <Suspense
                            fallback={
                                <LoadingSpinner
                                    size="lg"
                                    text="Chargement de mes avis..."
                                />
                            }
                        >
                            <MerchantLayout>
                                <MerchantMyReviewsView />
                            </MerchantLayout>
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
                            <MerchantLayout>
                                <div className="p-4 lg:p-8">
                                    <div className="max-w-7xl mx-auto">
                                        <div className="text-center py-12">
                                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                                Page non trouvée
                                            </h1>
                                            <p className="text-gray-600 mb-6">
                                                La page que vous recherchez
                                                n'existe pas dans l'espace
                                                marchand.
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
                            </MerchantLayout>
                        </Suspense>
                    }
                />
            </Routes>
        </AuthGuard>
    )
}

export default MerchantRoutes
