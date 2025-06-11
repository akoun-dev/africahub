import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { User, Heart, Clock, Settings, LogIn } from "lucide-react"

const Profile = () => {
    const { user } = useAuth()

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-afroGreen to-afroGold rounded-full flex items-center justify-center mx-auto">
                        <LogIn className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Connectez-vous à votre compte
                    </h1>
                    <p className="text-gray-600">
                        Accédez à vos favoris, votre historique et vos
                        préférences
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-afroGreen to-afroGold text-white"
                    >
                        Se connecter / S'inscrire
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Mon Compte
                    </h1>
                    <p className="text-gray-600">
                        Gérez vos préférences et suivez vos recherches
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Profil */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Mon Profil
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Informations personnelles et préférences
                            </p>
                            <Button variant="outline" className="w-full">
                                Modifier le profil
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Favoris */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5" />
                                Mes Favoris
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Offres d'assurance sauvegardées
                            </p>
                            <Button variant="outline" className="w-full">
                                Voir mes favoris
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Historique */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Historique
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                Mes recherches précédentes
                            </p>
                            <Button variant="outline" className="w-full">
                                Voir l'historique
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions rapides */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Button asChild className="h-12 justify-start">
                                <Link to="/search">
                                    <User className="mr-2 h-4 w-4" />
                                    Nouvelle recherche d'assurance
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 justify-start"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Paramètres du compte
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Profile
