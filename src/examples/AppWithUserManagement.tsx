import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

// Contextes d'authentification
import { AuthProvider } from "@/contexts/AuthContext" // Ancien système (à garder pour compatibilité)

// Routes et composants
import UserManagementRoutes from "@/routes/UserManagementRoutes"
import { PublicRoute } from "@/components/routing/RoleBasedRedirect"

// Pages publiques existantes
import Home from "@/pages/Home"
import About from "@/pages/About"
import Contact from "@/pages/Contact"
import Secteurs from "@/pages/Secteurs"
import Transport from "@/pages/Transport"
import Banque from "@/pages/Banque"
import Sante from "@/pages/Sante"
import Energie from "@/pages/Energie"
import Telecoms from "@/pages/Telecoms"
import Immobilier from "@/pages/Immobilier"
import Education from "@/pages/Education"
import Commerce from "@/pages/Commerce"

/**
 * Application principale avec système de gestion des utilisateurs intégré
 *
 * Cette version montre comment intégrer le nouveau système de gestion des utilisateurs
 * avec l'application existante tout en maintenant la compatibilité.
 */
function AppWithUserManagement() {
    return (
        <Router>
            {/* Double contexte pour transition progressive */}
            <AuthProvider>
                <div className="App">
                    <Routes>
                        {/* Routes publiques - accessibles sans authentification */}
                        <Route
                            path="/home"
                            element={
                                <PublicRoute>
                                    <Home />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/about"
                            element={
                                <PublicRoute>
                                    <About />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/contact"
                            element={
                                <PublicRoute>
                                    <Contact />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/secteurs"
                            element={
                                <PublicRoute>
                                    <Secteurs />
                                </PublicRoute>
                            }
                        />

                        {/* Pages sectorielles publiques */}
                        <Route
                            path="/transport"
                            element={
                                <PublicRoute>
                                    <Transport />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/banque"
                            element={
                                <PublicRoute>
                                    <Banque />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/sante"
                            element={
                                <PublicRoute>
                                    <Sante />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/energie"
                            element={
                                <PublicRoute>
                                    <Energie />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/telecoms"
                            element={
                                <PublicRoute>
                                    <Telecoms />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/immobilier"
                            element={
                                <PublicRoute>
                                    <Immobilier />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/education"
                            element={
                                <PublicRoute>
                                    <Education />
                                </PublicRoute>
                            }
                        />

                        <Route
                            path="/commerce"
                            element={
                                <PublicRoute>
                                    <Commerce />
                                </PublicRoute>
                            }
                        />

                        {/* Système de gestion des utilisateurs - toutes les routes protégées */}
                        <Route path="/*" element={<UserManagementRoutes />} />
                    </Routes>

                    {/* Notifications toast */}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: "#2D4A6B",
                                color: "white",
                                border: "none",
                            },
                        }}
                    />
                </div>
            </AuthProvider>
        </Router>
    )
}

export default AppWithUserManagement

/**
 * GUIDE D'INTÉGRATION
 *
 * 1. REMPLACER L'APP ACTUELLE :
 *    - Sauvegarder votre App.tsx actuel
 *    - Remplacer par ce fichier
 *    - Ajuster les imports selon votre structure
 *
 * 2. EXÉCUTER LE SCRIPT SQL :
 *    - Aller dans Supabase Dashboard
 *    - SQL Editor
 *    - Coller le contenu de src/sql/user_management_schema.sql
 *    - Exécuter
 *
 * 3. TESTER LE SYSTÈME :
 *    - Aller sur /auth
 *    - Créer un compte utilisateur
 *    - Créer un compte marchand
 *    - Vérifier les redirections automatiques
 *
 * 4. CONFIGURATION ADMIN :
 *    - Créer un compte avec email admin
 *    - Changer le rôle en 'admin' via SQL :
 *      UPDATE user_profiles SET role = 'admin' WHERE email = 'votre@email.com';
 *
 * 5. PERSONNALISATION :
 *    - Modifier les couleurs dans les composants
 *    - Ajouter vos propres pages
 *    - Configurer les permissions selon vos besoins
 *
 * FONCTIONNALITÉS DISPONIBLES :
 * ✅ Authentification complète
 * ✅ 4 types d'utilisateurs
 * ✅ Dashboards spécialisés
 * ✅ Protection des routes
 * ✅ Navigation adaptative
 * ✅ Gestion des permissions
 * ✅ Interface responsive
 * ✅ Logging des activités
 * ✅ Statistiques en temps réel
 *
 * ROUTES PRINCIPALES :
 * - / : Redirection automatique selon le rôle
 * - /auth : Page d'authentification
 * - /user/dashboard : Dashboard utilisateur
 * - /merchant/dashboard : Dashboard marchand
 * - /manager/dashboard : Dashboard gestionnaire
 * - /admin/dashboard : Dashboard administrateur
 *
 * HOOKS UTILES :
 * - useEnhancedAuth() : Authentification complète
 * - useRoleCheck() : Vérification des permissions
 * - useRoleDashboard() : Navigation intelligente
 *
 * COMPOSANTS UTILES :
 * - <ProtectedRoute> : Protection par rôle
 * - <RoleBasedContent> : Contenu conditionnel
 * - <DashboardLayout> : Layout avec navigation
 * - <RoleBasedNavigation> : Navigation adaptative
 */
