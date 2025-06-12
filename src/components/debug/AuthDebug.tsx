/**
 * Composant de débogage pour vérifier l'état de l'authentification
 */

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigationStructure } from "@/components/navigation/NavigationStructure"

export const AuthDebug: React.FC = () => {
    const { user, profile, loading, refreshProfile } = useAuth()
    const { userNavigation } = useNavigationStructure()

    const handleRefreshProfile = async () => {
        console.log("🔄 Rechargement du profil...")
        await refreshProfile()
        window.location.reload() // Force un rechargement complet
    }

    return (
        <Card className="w-full max-w-2xl mx-auto mt-4">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    🔍 Debug Authentification
                    <Button
                        onClick={handleRefreshProfile}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recharger Profil
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">État du chargement</h4>
                    <Badge variant={loading ? "destructive" : "default"}>
                        {loading ? "Chargement..." : "Chargé"}
                    </Badge>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Utilisateur connecté</h4>
                    <Badge variant={user ? "default" : "destructive"}>
                        {user ? "✅ Connecté" : "❌ Non connecté"}
                    </Badge>
                    {user && (
                        <div className="mt-2 text-sm">
                            <p>
                                <strong>ID:</strong> {user.id}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Profil utilisateur</h4>
                    <Badge variant={profile ? "default" : "destructive"}>
                        {profile ? "✅ Profil chargé" : "❌ Pas de profil"}
                    </Badge>
                    {profile && (
                        <div className="mt-2 text-sm">
                            <p>
                                <strong>Rôle:</strong> {profile.role}
                            </p>
                            <p>
                                <strong>Nom:</strong> {profile.first_name}{" "}
                                {profile.last_name}
                            </p>
                            <p>
                                <strong>Permissions:</strong>{" "}
                                {profile.permissions?.join(", ") || "Aucune"}
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold mb-2">
                        Navigation utilisateur
                    </h4>
                    <Badge
                        variant={
                            userNavigation.length > 0
                                ? "default"
                                : "destructive"
                        }
                    >
                        {userNavigation.length} éléments de navigation
                    </Badge>
                    {userNavigation.length > 0 && (
                        <div className="mt-2 text-sm">
                            <ul className="list-disc list-inside">
                                {userNavigation.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.label}</strong> →{" "}
                                        {item.href}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold mb-2">
                        Conditions de navigation
                    </h4>
                    <div className="space-y-1 text-sm">
                        <p>
                            <strong>user && profile:</strong>{" "}
                            {user && profile ? "✅ true" : "❌ false"}
                        </p>
                        <p>
                            <strong>profile?.role:</strong>{" "}
                            {profile?.role || "undefined"}
                        </p>
                        <p>
                            <strong>user:</strong>{" "}
                            {user ? "✅ true" : "❌ false"}
                        </p>
                        <p>
                            <strong>profile:</strong>{" "}
                            {profile ? "✅ true" : "❌ false"}
                        </p>
                    </div>
                </div>

                {/* Debug JSON brut */}
                <details className="mt-4">
                    <summary className="cursor-pointer font-semibold">
                        Données brutes (JSON)
                    </summary>
                    <div className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        <h5 className="font-semibold">User:</h5>
                        <pre>{JSON.stringify(user, null, 2)}</pre>
                        <h5 className="font-semibold mt-2">Profile:</h5>
                        <pre>{JSON.stringify(profile, null, 2)}</pre>
                        <h5 className="font-semibold mt-2">UserNavigation:</h5>
                        <pre>{JSON.stringify(userNavigation, null, 2)}</pre>
                    </div>
                </details>
            </CardContent>
        </Card>
    )
}

export default AuthDebug
