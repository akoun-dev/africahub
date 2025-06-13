/**
 * Routes dédiées pour l'interface gestionnaire/modérateur
 * Gestion complète de la modération et supervision de la plateforme
 */

import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ManagerLayout } from "@/components/manager"
import {
    ManagerDashboardPage,
    ManagerModerationPage,
    ManagerProductsPage,
    ManagerReportsPage,
    ManagerAnalyticsPage,
} from "@/pages/manager"

/**
 * Routes pour l'interface gestionnaire
 * Toutes les routes sont protégées et nécessitent le rôle "manager"
 */
const ManagerRoutes: React.FC = () => {
    return (
        <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout>
                <Routes>
                    {/* Redirection par défaut vers le dashboard */}
                    <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
                    
                    {/* Dashboard principal */}
                    <Route path="/dashboard" element={<ManagerDashboardPage />} />
                    
                    {/* Modération des contenus */}
                    <Route path="/moderation" element={<ManagerModerationPage />} />
                    
                    {/* Gestion des produits */}
                    <Route path="/products" element={<ManagerProductsPage />} />
                    
                    {/* Gestion des signalements */}
                    <Route path="/reports" element={<ManagerReportsPage />} />
                    
                    {/* Analytics et statistiques */}
                    <Route path="/analytics" element={<ManagerAnalyticsPage />} />
                    
                    {/* Route par défaut - redirection vers dashboard */}
                    <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
                </Routes>
            </ManagerLayout>
        </ProtectedRoute>
    )
}

export default ManagerRoutes
