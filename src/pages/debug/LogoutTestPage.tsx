// 🧪 Page de test pour la déconnexion
// Accessible via /debug/logout-test

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bug, LogOut, User, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { AuthGuard, useAuthGuard } from "@/components/auth/AuthGuard"
import { toast } from "sonner"

export const LogoutTestPage: React.FC = () => {
    const { user, profile, signOut, logout } = useAuth()
    const { isAuthenticated, userEmail, userId } = useAuthGuard()
    const navigate = useNavigate()
    const [testResults, setTestResults] = useState<{
        signOutTest?: "success" | "error" | "loading"
        logoutTest?: "success" | "error" | "loading"
        error?: string
    }>({})

    const getStatusIcon = (status?: "success" | "error" | "loading") => {
        switch (status) {
            case "success":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "error":
                return <XCircle className="w-4 h-4 text-red-500" />
            case "loading":
                return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />
        }
    }

    // Test de la fonction signOut
    const testSignOut = async () => {
        setTestResults(prev => ({ ...prev, signOutTest: "loading" }))
        
        try {
            console.log("🧪 Test signOut: Début du test...")
            toast.loading("Test signOut en cours...", { id: "test-signout" })
            
            await signOut()
            
            setTestResults(prev => ({ ...prev, signOutTest: "success" }))
            toast.success("Test signOut réussi !", { id: "test-signout" })
            
            // Redirection après succès
            setTimeout(() => {
                navigate("/", { replace: true })
            }, 1000)
            
        } catch (error) {
            console.error("🧪 Test signOut: Erreur:", error)
            setTestResults(prev => ({ 
                ...prev, 
                signOutTest: "error",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            }))
            toast.error("Test signOut échoué", { id: "test-signout" })
        }
    }

    // Test de la fonction logout (alias)
    const testLogout = async () => {
        setTestResults(prev => ({ ...prev, logoutTest: "loading" }))
        
        try {
            console.log("🧪 Test logout: Début du test...")
            toast.loading("Test logout en cours...", { id: "test-logout" })
            
            await logout()
            
            setTestResults(prev => ({ ...prev, logoutTest: "success" }))
            toast.success("Test logout réussi !", { id: "test-logout" })
            
            // Redirection après succès
            setTimeout(() => {
                navigate("/", { replace: true })
            }, 1000)
            
        } catch (error) {
            console.error("🧪 Test logout: Erreur:", error)
            setTestResults(prev => ({ 
                ...prev, 
                logoutTest: "error",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            }))
            toast.error("Test logout échoué", { id: "test-logout" })
        }
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="max-w-4xl mx-auto space-y-8">
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
                                    Test de déconnexion
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Diagnostiquer et tester les fonctions de déconnexion d'AfricaHub
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informations utilisateur */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Utilisateur connecté
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-blue-700 space-y-1">
                                    <p><strong>Authentifié:</strong> {isAuthenticated ? "✅ Oui" : "❌ Non"}</p>
                                    <p><strong>Email:</strong> {userEmail || "Non disponible"}</p>
                                    <p><strong>ID:</strong> {userId || "Non disponible"}</p>
                                    {profile && (
                                        <>
                                            <p><strong>Nom:</strong> {profile.first_name} {profile.last_name}</p>
                                            <p><strong>Rôle:</strong> {profile.role}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tests de déconnexion */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LogOut className="w-5 h-5" />
                                Tests de déconnexion
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Test signOut */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(testResults.signOutTest)}
                                    <div>
                                        <p className="font-medium">Test signOut()</p>
                                        <p className="text-sm text-gray-600">
                                            Fonction principale de déconnexion avec gestion d'erreurs
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={testSignOut}
                                    disabled={testResults.signOutTest === "loading"}
                                    variant="outline"
                                    size="sm"
                                >
                                    {testResults.signOutTest === "loading" ? "Test..." : "Tester"}
                                </Button>
                            </div>

                            {/* Test logout */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(testResults.logoutTest)}
                                    <div>
                                        <p className="font-medium">Test logout()</p>
                                        <p className="text-sm text-gray-600">
                                            Alias de la fonction signOut avec redirection
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={testLogout}
                                    disabled={testResults.logoutTest === "loading"}
                                    variant="outline"
                                    size="sm"
                                >
                                    {testResults.logoutTest === "loading" ? "Test..." : "Tester"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Affichage des erreurs */}
                    {testResults.error && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-900">
                                    Erreur détectée
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        {testResults.error}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Informations de débogage */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de débogage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">
                                        Fonctions testées
                                    </h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• <code>signOut()</code> - Fonction principale avec gestion d'erreurs</li>
                                        <li>• <code>logout()</code> - Alias de signOut avec redirection</li>
                                        <li>• Nettoyage de l'état utilisateur</li>
                                        <li>• Redirection automatique</li>
                                        <li>• Protection AuthGuard</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">
                                        Composants concernés
                                    </h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• <code>AuthContext.tsx</code> - Contexte d'authentification</li>
                                        <li>• <code>UserActions.tsx</code> - Menu utilisateur</li>
                                        <li>• <code>UserSidebar.tsx</code> - Sidebar utilisateur</li>
                                        <li>• <code>UserDashboard.tsx</code> - Dashboard principal</li>
                                        <li>• <code>AuthGuard.tsx</code> - Protection des composants</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liens utiles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Liens utiles pour le débogage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link to="/user/dashboard">
                                    <Button variant="outline" className="w-full">
                                        Dashboard utilisateur
                                    </Button>
                                </Link>
                                <Link to="/user/profile">
                                    <Button variant="outline" className="w-full">
                                        Profil utilisateur
                                    </Button>
                                </Link>
                                <Link to="/debug/user-features">
                                    <Button variant="outline" className="w-full">
                                        Test des fonctionnalités
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}

export default LogoutTestPage
