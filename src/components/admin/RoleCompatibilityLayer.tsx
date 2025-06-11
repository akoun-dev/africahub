import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { RefreshCw, CheckCircle, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export const RoleCompatibilityLayer: React.FC = () => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = React.useState(false)
    const [migrationStatus, setMigrationStatus] = React.useState<
        "pending" | "completed" | "error"
    >("pending")

    const checkMigrationStatus = async () => {
        try {
            // Vérifier si des utilisateurs ont encore l'ancien système de rôles
            const { data: oldRoles, error } = await supabase
                .from("user_roles")
                .select("id, user_id, role, role_id")
                .is("role_id", null)

            if (error) throw error

            if (oldRoles && oldRoles.length > 0) {
                setMigrationStatus("pending")
            } else {
                setMigrationStatus("completed")
            }
        } catch (error) {
            console.error("Erreur lors de la vérification:", error)
            setMigrationStatus("error")
        }
    }

    const migrateExistingRoles = async () => {
        setIsLoading(true)
        try {
            // Récupérer tous les utilisateurs avec des rôles en mode texte
            const { data: oldRoles, error: fetchError } = await supabase
                .from("user_roles")
                .select("id, user_id, role")
                .is("role_id", null)

            if (fetchError) throw fetchError

            if (!oldRoles || oldRoles.length === 0) {
                toast.success(
                    "Aucun rôle à migrer - tous les rôles sont déjà dans le nouveau système"
                )
                setMigrationStatus("completed")
                return
            }

            // Récupérer les définitions de rôles
            const { data: roleDefinitions, error: rolesError } = await supabase
                .from("role_definitions")
                .select("id, name")

            if (rolesError) throw rolesError

            // Créer un mapping nom -> id
            const roleMap =
                roleDefinitions?.reduce((acc, role) => {
                    acc[role.name] = role.id
                    return acc
                }, {} as Record<string, string>) || {}

            // Migrer chaque rôle
            let migratedCount = 0
            for (const oldRole of oldRoles) {
                const roleId = roleMap[oldRole.role]
                if (roleId) {
                    const { error: updateError } = await supabase
                        .from("user_roles")
                        .update({ role_id: roleId })
                        .eq("id", oldRole.id)

                    if (updateError) {
                        console.error(
                            `Erreur migration rôle ${oldRole.role}:`,
                            updateError
                        )
                    } else {
                        migratedCount++
                    }
                } else {
                    console.warn(`Rôle non trouvé: ${oldRole.role}`)
                }
            }

            toast.success(
                `Migration terminée: ${migratedCount} rôles migrés avec succès`
            )
            setMigrationStatus("completed")
        } catch (error) {
            console.error("Erreur lors de la migration:", error)
            toast.error("Erreur lors de la migration des rôles")
            setMigrationStatus("error")
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        checkMigrationStatus()
    }, [user])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Migration vers le Système Paramétrable
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">État de la migration</p>
                        <p className="text-sm text-gray-600">
                            Migration des rôles de l'ancien système vers le
                            nouveau système paramétrable
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {migrationStatus === "completed" && (
                            <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Terminé
                            </Badge>
                        )}
                        {migrationStatus === "pending" && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                En attente
                            </Badge>
                        )}
                        {migrationStatus === "error" && (
                            <Badge className="bg-red-100 text-red-800">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Erreur
                            </Badge>
                        )}
                    </div>
                </div>

                {migrationStatus === "pending" && (
                    <Alert>
                        <UserPlus className="h-4 w-4" />
                        <AlertDescription>
                            Des utilisateurs utilisent encore l'ancien système
                            de rôles. Cliquez sur "Migrer" pour les convertir
                            vers le nouveau système paramétrable.
                        </AlertDescription>
                    </Alert>
                )}

                {migrationStatus === "completed" && (
                    <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            ✅ Excellent ! Tous les rôles ont été migrés vers le
                            nouveau système paramétrable. Le système de
                            récursion RLS a été corrigé et vous avez maintenant
                            accès complet.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex space-x-2">
                    <Button
                        onClick={migrateExistingRoles}
                        disabled={isLoading || migrationStatus === "completed"}
                    >
                        {isLoading ? "Migration..." : "Migrer les rôles"}
                    </Button>
                    <Button variant="outline" onClick={checkMigrationStatus}>
                        Vérifier l'état
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
