// 🧪 Composant de test pour la fonction de déconnexion
// Ce composant permet de tester la déconnexion depuis n'importe quelle page

import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export const LogoutTestComponent: React.FC = () => {
    const { user, profile, signOut, logout } = useAuth()
    const navigate = useNavigate()
    const [testResults, setTestResults] = React.useState<{
        signOutTest?: "success" | "error" | "loading"
        logoutTest?: "success" | "error" | "loading"
        error?: string
    }>({})

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

    const getStatusIcon = (status?: "success" | "error" | "loading") => {
        switch (status) {
            case "success":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "error":
                return <XCircle className="w-4 h-4 text-red-500" />
            case "loading":
                return <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />
        }
    }

    if (!user) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Test de déconnexion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        Vous devez être connecté pour tester la déconnexion.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Test de déconnexion - AfricaHub
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Informations utilisateur */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        Utilisateur connecté
                    </h3>
                    <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>ID:</strong> {user.id}</p>
                        {profile && (
                            <>
                                <p><strong>Nom:</strong> {profile.first_name} {profile.last_name}</p>
                                <p><strong>Rôle:</strong> {profile.role}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Tests de déconnexion */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                        Tests de déconnexion
                    </h3>
                    
                    {/* Test signOut */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            {getStatusIcon(testResults.signOutTest)}
                            <div>
                                <p className="font-medium">Test signOut()</p>
                                <p className="text-sm text-gray-600">
                                    Fonction principale de déconnexion
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
                                    Alias de la fonction signOut
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
                </div>

                {/* Affichage des erreurs */}
                {testResults.error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-900 mb-2">
                            Erreur détectée
                        </h4>
                        <p className="text-sm text-red-700">
                            {testResults.error}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                        Instructions
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Cliquez sur "Tester" pour tester chaque fonction</li>
                        <li>• Vérifiez la console pour les logs détaillés</li>
                        <li>• En cas de succès, vous serez redirigé vers l'accueil</li>
                        <li>• En cas d'erreur, les détails s'afficheront ci-dessus</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

export default LogoutTestComponent
