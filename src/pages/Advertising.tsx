import React, { useState } from "react"
import {
    Megaphone,
    Target,
    BarChart3,
    Users,
    Eye,
    MousePointer,
    TrendingUp,
    Star,
    ArrowRight,
    CheckCircle,
    Play,
    Pause,
    Calendar,
    DollarSign,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdFormat {
    id: string
    name: string
    description: string
    icon: React.ComponentType<any>
    price: string
    ctr: string
    reach: string
    popular?: boolean
}

const Advertising: React.FC = () => {
    const [activeTab, setActiveTab] = useState("formats")
    const [isPlaying, setIsPlaying] = useState(false)

    // Formats publicitaires
    const adFormats: AdFormat[] = [
        {
            id: "1",
            name: "Bannière Premium",
            description: "Bannière haute visibilité en haut de page",
            icon: Monitor,
            price: "150K FCFA/mois",
            ctr: "2.8%",
            reach: "500K+ vues/mois",
            popular: true,
        },
        {
            id: "2",
            name: "Comparaison Sponsorisée",
            description: "Votre produit mis en avant dans les comparaisons",
            icon: Target,
            price: "200K FCFA/mois",
            ctr: "4.2%",
            reach: "300K+ vues/mois",
        },
        {
            id: "3",
            name: "Mobile Native",
            description: "Publicité native optimisée mobile",
            icon: Smartphone,
            price: "100K FCFA/mois",
            ctr: "3.5%",
            reach: "800K+ vues/mois",
        },
        {
            id: "4",
            name: "Newsletter Sponsor",
            description: "Sponsoring dans notre newsletter hebdomadaire",
            icon: Megaphone,
            price: "75K FCFA/édition",
            ctr: "5.1%",
            reach: "50K+ abonnés",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <Megaphone className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            📢 Solutions Publicitaires
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Atteignez des millions d'Africains avec nos
                            solutions publicitaires ciblées
                        </p>

                        {/* Statistiques publicitaires */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">5M+</div>
                                <div className="text-sm opacity-80">
                                    Utilisateurs mensuels
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">3.2%</div>
                                <div className="text-sm opacity-80">
                                    CTR moyen
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">25</div>
                                <div className="text-sm opacity-80">
                                    Pays africains
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">85%</div>
                                <div className="text-sm opacity-80">
                                    Trafic mobile
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Formats publicitaires */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Nos Formats Publicitaires
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choisissez le format qui correspond le mieux à vos
                        objectifs marketing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {adFormats.map(format => (
                        <Card
                            key={format.id}
                            className={`hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                                format.popular
                                    ? "border-2 border-orange-200"
                                    : "border border-marineBlue-100"
                            }`}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-marineBlue-100 rounded-lg flex items-center justify-center">
                                            <format.icon className="w-6 h-6 text-marineBlue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">
                                                {format.name}
                                            </CardTitle>
                                            {format.popular && (
                                                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white mt-1">
                                                    Populaire
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    {format.description}
                                </p>

                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {format.price}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Prix
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {format.ctr}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            CTR moyen
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            {format.reach}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Portée
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                                    Lancer une campagne
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Ciblage */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Ciblage Précis
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Atteignez exactement votre audience cible avec nos
                        options de ciblage avancées
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Card className="border border-marineBlue-100">
                        <CardContent className="p-6 text-center">
                            <Globe className="w-12 h-12 text-marineBlue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">
                                Géographique
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Par pays</li>
                                <li>• Par région</li>
                                <li>• Par ville</li>
                                <li>• Rayon personnalisé</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border border-marineBlue-100">
                        <CardContent className="p-6 text-center">
                            <Users className="w-12 h-12 text-marineBlue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">
                                Démographique
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Âge</li>
                                <li>• Genre</li>
                                <li>• Revenus</li>
                                <li>• Profession</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border border-marineBlue-100">
                        <CardContent className="p-6 text-center">
                            <Target className="w-12 h-12 text-marineBlue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">
                                Comportemental
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Secteurs recherchés</li>
                                <li>• Historique de navigation</li>
                                <li>• Comparaisons effectuées</li>
                                <li>• Intentions d'achat</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Final */}
                <section className="bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Prêt à lancer votre première campagne ?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Rejoignez des centaines d'entreprises qui font confiance
                        à AfricaHub pour leur publicité digitale
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                            <Target className="w-4 h-4 mr-2" />
                            Créer une campagne
                        </Button>
                        <Button
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Planifier une démo
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Advertising
