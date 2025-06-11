import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, ArrowLeft } from "lucide-react"

const NotFound = () => {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-2xl w-full text-center">
                <CardHeader>
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-afroRed via-afroGold to-afroGreen rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl font-bold text-white">
                            404
                        </span>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl text-gray-900">
                        Page non trouvée
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600 text-lg">
                        Désolé, la page que vous recherchez n'existe pas ou a
                        été déplacée.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-afroGreen hover:bg-afroGreen/90"
                        >
                            <Link to="/">
                                <Home className="mr-2 h-4 w-4" />
                                Retour à l'accueil
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link to="/advanced-search">
                                <Search className="mr-2 h-4 w-4" />
                                Rechercher
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Page précédente
                        </Button>
                    </div>

                    <div className="pt-6 border-t">
                        <p className="text-sm text-gray-500 mb-4">
                            Vous cherchiez peut-être :
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Link
                                to="/secteur/insurance"
                                className="text-sm text-afroGreen hover:underline"
                            >
                                Assurances
                            </Link>
                            <Link
                                to="/secteur/banking"
                                className="text-sm text-afroGreen hover:underline"
                            >
                                Banques
                            </Link>
                            <Link
                                to="/secteur/telecom"
                                className="text-sm text-afroGreen hover:underline"
                            >
                                Télécoms
                            </Link>
                            <Link
                                to="/compare"
                                className="text-sm text-afroGreen hover:underline"
                            >
                                Comparateur
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default NotFound
