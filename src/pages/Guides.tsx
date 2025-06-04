import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
    BookOpen,
    Shield,
    TrendingUp,
    Phone,
    Zap,
    MapPin,
    Car,
    Search,
    Filter,
    Clock,
    User,
    Star,
    ArrowRight,
    Download,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Guide {
    id: string
    title: string
    description: string
    sector: string
    sectorIcon: React.ComponentType<any>
    readTime: number
    difficulty: "Débutant" | "Intermédiaire" | "Avancé"
    rating: number
    views: number
    lastUpdated: string
    tags: string[]
    featured?: boolean
}

const Guides: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSector, setSelectedSector] = useState("all")

    const guides: Guide[] = [
        {
            id: "1",
            title: "Comment choisir son assurance auto en Afrique",
            description:
                "Guide complet pour sélectionner la meilleure assurance automobile selon votre profil et votre pays.",
            sector: "Assurances",
            sectorIcon: Shield,
            readTime: 8,
            difficulty: "Débutant",
            rating: 4.8,
            views: 15420,
            lastUpdated: "2024-01-15",
            tags: ["assurance auto", "comparaison", "conseils"],
            featured: true,
        },
        {
            id: "2",
            title: "Ouvrir un compte bancaire : le guide ultime",
            description:
                "Tout ce qu'il faut savoir pour choisir sa banque et ouvrir un compte en Afrique.",
            sector: "Banques",
            sectorIcon: TrendingUp,
            readTime: 12,
            difficulty: "Débutant",
            rating: 4.7,
            views: 12350,
            lastUpdated: "2024-01-10",
            tags: ["banque", "compte", "épargne"],
        },
        {
            id: "3",
            title: "Forfaits mobiles : optimiser ses coûts télécoms",
            description:
                "Stratégies pour réduire sa facture télécom et choisir le bon forfait mobile.",
            sector: "Télécoms",
            sectorIcon: Phone,
            readTime: 6,
            difficulty: "Intermédiaire",
            rating: 4.6,
            views: 9870,
            lastUpdated: "2024-01-08",
            tags: ["mobile", "forfait", "économies"],
        },
        {
            id: "4",
            title: "Énergie solaire : investir intelligemment",
            description:
                "Guide d'investissement dans l'énergie solaire résidentielle en Afrique.",
            sector: "Énergie",
            sectorIcon: Zap,
            readTime: 15,
            difficulty: "Avancé",
            rating: 4.9,
            views: 7650,
            lastUpdated: "2024-01-05",
            tags: ["solaire", "investissement", "écologie"],
            featured: true,
        },
        {
            id: "5",
            title: "Acheter ou louer : guide immobilier africain",
            description:
                "Analyse comparative entre achat et location immobilière selon les marchés africains.",
            sector: "Immobilier",
            sectorIcon: MapPin,
            readTime: 10,
            difficulty: "Intermédiaire",
            rating: 4.5,
            views: 6420,
            lastUpdated: "2024-01-03",
            tags: ["immobilier", "achat", "location"],
        },
        {
            id: "6",
            title: "Transport urbain : solutions et coûts",
            description:
                "Comparatif des solutions de transport urbain dans les grandes villes africaines.",
            sector: "Transport",
            sectorIcon: Car,
            readTime: 7,
            difficulty: "Débutant",
            rating: 4.4,
            views: 5230,
            lastUpdated: "2024-01-01",
            tags: ["transport", "urbain", "mobilité"],
        },
    ]

    const sectors = [
        "all",
        "Assurances",
        "Banques",
        "Télécoms",
        "Énergie",
        "Immobilier",
        "Transport",
    ]

    const filteredGuides = guides.filter(guide => {
        const matchesSearch =
            guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            guide.tags.some(tag =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        const matchesSector =
            selectedSector === "all" || guide.sector === selectedSector
        return matchesSearch && matchesSector
    })

    const featuredGuides = guides.filter(guide => guide.featured)

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Débutant":
                return "bg-green-100 text-green-800"
            case "Intermédiaire":
                return "bg-yellow-100 text-yellow-800"
            case "Avancé":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            Guides d'Achat AfricaHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Conseils d'experts pour faire les meilleurs choix
                            dans tous les secteurs africains
                        </p>

                        {/* Statistiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">
                                    {guides.length}+
                                </div>
                                <div className="text-sm opacity-80">
                                    Guides disponibles
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">50K+</div>
                                <div className="text-sm opacity-80">
                                    Lecteurs mensuels
                                </div>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-3xl font-bold">4.7/5</div>
                                <div className="text-sm opacity-80">
                                    Note moyenne
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Recherche et filtres */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-marineBlue-600 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Rechercher un guide..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 border-marineBlue-200 focus:border-marineBlue-600"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-marineBlue-600" />
                            <select
                                value={selectedSector}
                                onChange={e =>
                                    setSelectedSector(e.target.value)
                                }
                                className="px-3 py-2 border border-marineBlue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-marineBlue-600"
                            >
                                {sectors.map(sector => (
                                    <option key={sector} value={sector}>
                                        {sector === "all"
                                            ? "Tous les secteurs"
                                            : sector}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Guides en vedette */}
                {featuredGuides.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6 flex items-center">
                            <Star className="w-6 h-6 text-orange-500 mr-2" />
                            Guides en vedette
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {featuredGuides.map(guide => (
                                <Card
                                    key={guide.id}
                                    className="hover:shadow-lg transition-all hover:scale-105 border-0 shadow-md"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-marineBlue-100 rounded-lg flex items-center justify-center">
                                                    <guide.sectorIcon className="w-5 h-5 text-marineBlue-600" />
                                                </div>
                                                <div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="mb-2"
                                                    >
                                                        {guide.sector}
                                                    </Badge>
                                                    <CardTitle className="text-lg">
                                                        {guide.title}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm">
                                                Vedette
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">
                                            {guide.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {guide.readTime} min
                                                </div>
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 mr-1" />
                                                    {guide.views.toLocaleString()}{" "}
                                                    vues
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                                    {guide.rating}
                                                </div>
                                            </div>
                                            <Badge
                                                className={getDifficultyColor(
                                                    guide.difficulty
                                                )}
                                            >
                                                {guide.difficulty}
                                            </Badge>
                                        </div>
                                        <Button
                                            asChild
                                            className="w-full bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm"
                                        >
                                            <Link to={`/guides/${guide.id}`}>
                                                Lire le guide
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tous les guides */}
                <section>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-6">
                        Tous les guides ({filteredGuides.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGuides.map(guide => (
                            <Card
                                key={guide.id}
                                className="hover:shadow-lg transition-all hover:scale-105"
                            >
                                <CardHeader>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-8 h-8 bg-marineBlue-100 rounded-lg flex items-center justify-center">
                                            <guide.sectorIcon className="w-4 h-4 text-marineBlue-600" />
                                        </div>
                                        <Badge variant="outline">
                                            {guide.sector}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">
                                        {guide.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {guide.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center space-x-3">
                                            <span>{guide.readTime} min</span>
                                            <span>
                                                {guide.views.toLocaleString()}{" "}
                                                vues
                                            </span>
                                            <span>★ {guide.rating}</span>
                                        </div>
                                        <Badge
                                            size="sm"
                                            className={getDifficultyColor(
                                                guide.difficulty
                                            )}
                                        >
                                            {guide.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {guide.tags.slice(0, 3).map(tag => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                                    >
                                        <Link to={`/guides/${guide.id}`}>
                                            Lire le guide
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA Newsletter */}
                <section className="mt-16 bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Recevez nos nouveaux guides
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Soyez informé des derniers guides d'achat et conseils
                        d'experts
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            placeholder="Votre email"
                            className="flex-1 border-marineBlue-200 focus:border-marineBlue-600"
                        />
                        <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                            S'abonner
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Guides
