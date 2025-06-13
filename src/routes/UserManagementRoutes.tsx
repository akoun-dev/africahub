import React from "react"
import { Routes, Route } from "react-router-dom"
// Imports temporaires sans vérification d'auth pour déboguer
import { ProtectedRoute } from "@/components/auth/NoAuthProtectedRoute"
import {
    PublicRoute,
    RootRedirect,
} from "@/components/routing/RoleBasedRedirect"
import DashboardLayout from "@/components/layout/DashboardLayout"

// Import des pages utilisateur
import TestDashboard from "@/pages/TestDashboard"
import UserProfilePage from "@/pages/user/UserProfilePage"

// Import des pages marchand
import MerchantDashboardPage from "@/pages/merchant/MerchantDashboardPage"

// Import des routes gestionnaire
import ManagerRoutes from "./ManagerRoutes"

// Import des pages admin
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"

// Import de la page d'authentification améliorée
import Auth from "@/pages/Auth"

/**
 * Configuration des routes pour le système de gestion des utilisateurs
 */
export const UserManagementRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Route racine - redirection automatique */}
            <Route path="/" element={<RootRedirect />} />

            {/* Routes d'authentification */}
            <Route
                path="/auth"
                element={
                    <PublicRoute redirectIfAuthenticated={true}>
                        <Auth />
                    </PublicRoute>
                }
            />

            {/* Routes utilisateur simple */}
            <Route
                path="/user/*"
                element={
                    <Routes>
                        <Route path="dashboard" element={<TestDashboard />} />
                        <Route path="profile" element={<UserProfilePage />} />
                        {/* Redirection par défaut vers dashboard */}
                        <Route path="*" element={<RootRedirect />} />
                    </Routes>
                }
            />

            {/* Routes marchand */}
            <Route
                path="/merchant/*"
                element={
                    <ProtectedRoute allowedRoles={["merchant"]}>
                        <Routes>
                            <Route
                                path="dashboard"
                                element={
                                    <DashboardLayout
                                        allowedRoles={["merchant"]}
                                    >
                                        <MerchantDashboardPage />
                                    </DashboardLayout>
                                }
                            />
                            {/* TODO: Ajouter d'autres routes marchand */}
                            <Route path="*" element={<RootRedirect />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Routes gestionnaire */}
            <Route path="/manager/*" element={<ManagerRoutes />} />

            {/* Routes administrateur */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Routes>
                            <Route
                                path="dashboard"
                                element={
                                    <DashboardLayout allowedRoles={["admin"]}>
                                        <AdminDashboardPage />
                                    </DashboardLayout>
                                }
                            />
                            {/* TODO: Ajouter d'autres routes admin */}
                            <Route path="*" element={<RootRedirect />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Route de fallback */}
            <Route path="*" element={<RootRedirect />} />
        </Routes>
    )
}

export default UserManagementRoutes
