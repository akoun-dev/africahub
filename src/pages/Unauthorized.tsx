import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Shield, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Page d'accès non autorisé
 * Affichée quand un utilisateur tente d'accéder à une ressource sans les permissions nécessaires
 */
const Unauthorized: React.FC = () => {
    const navigate = useNavigate()
    const { profile } = useAuth()

    const handleGoBack = () => {
        navigate(-1)
    }

    const getDashboardPath = () => {
        if (!profile) return "/auth"

        switch (profile.role) {
            case "admin":
                return "/admin"
            case "merchant":
                return "/merchant-dashboard"
            case "user":
            default:
                return "/user-dashboard"
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Accès non autorisé
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            Vous n'avez pas les permissions nécessaires pour
                            accéder à cette page.
                        </p>
                        {profile && (
                            <p className="text-sm text-gray-500">
                                Connecté en tant que :{" "}
                                <span className="font-medium">
                                    {profile.role}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>

                        <Button
                            asChild
                            className="w-full bg-[#2D4A6B] hover:bg-[#1F3A5F]"
                        >
                            <Link to={getDashboardPath()}>
                                <Home className="w-4 h-4 mr-2" />
                                Aller au tableau de bord
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500">
                            Si vous pensez qu'il s'agit d'une erreur, contactez
                            l'administrateur.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Unauthorized
