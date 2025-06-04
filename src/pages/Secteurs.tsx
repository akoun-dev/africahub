import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
    Shield,
    TrendingUp,
    Phone,
    Zap,
    MapPin,
    Car,
    Plane,
    GraduationCap,
    Heart,
    ShoppingBag,
    Building,
    Search,
    Filter,
    Star,
    Users,
    ArrowRight,
    TrendingUp as TrendingUpIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Sector {
    id: string
    name: string
    slug: string
    icon: React.ComponentType<any>
    description: string
    shortDescription: string
    providers: number
    avgSavings: string
    reviews: number
    rating: number
    popular?: boolean
    trending?: boolean
    color: string
    bgColor: string
    countries: string[]
    subSectors: string[]
}

const Secteurs: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")

    const sectors: Sector[] = [
        {
            id: "1",
            name: "Assurances",
            slug: "assurance-auto",
            icon: Shield,
            description:
                "Comparez les assurances auto, habitation, santé, vie et professionnelles dans toute l'Afrique",
            shortDescription: "Auto, habitation, santé, vie",
            providers: 45,
            avgSavings: "25%",
            reviews: 12500,
            rating: 4.8,
            popular: true,
            trending: true,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
            ],
            subSectors: [
                "Auto",
                "Habitation",
                "Santé",
                "Vie",
                "Professionnelle",
            ],
        },
        {
            id: "2",
            name: "Banques",
            slug: "banque",
            icon: TrendingUp,
            description:
                "Trouvez les meilleurs comptes, crédits, solutions d'épargne et services bancaires",
            shortDescription: "Comptes, crédits, épargne",
            providers: 32,
            avgSavings: "15%",
            reviews: 8900,
            rating: 4.7,
            popular: true,
            color: "text-green-600",
            bgColor: "bg-green-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
                "Maroc",
            ],
            subSectors: [
                "Comptes courants",
                "Épargne",
                "Crédits",
                "Cartes bancaires",
            ],
        },
        {
            id: "3",
            name: "Télécoms",
            slug: "telecom",
            icon: Phone,
            description:
                "Forfaits mobile, internet fixe, téléphonie et solutions de communication",
            shortDescription: "Mobile, internet, fixe",
            providers: 28,
            avgSavings: "30%",
            reviews: 15600,
            rating: 4.6,
            popular: true,
            trending: true,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
                "Cameroun",
            ],
            subSectors: [
                "Forfaits mobile",
                "Internet fixe",
                "Téléphonie",
                "Data",
            ],
        },
        {
            id: "4",
            name: "Énergie",
            slug: "energie",
            icon: Zap,
            description:
                "Électricité, gaz, solutions solaires et énergies renouvelables",
            shortDescription: "Électricité, gaz, solaire",
            providers: 18,
            avgSavings: "20%",
            reviews: 6700,
            rating: 4.9,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            countries: ["Kenya", "Ghana", "Nigeria", "Afrique du Sud"],
            subSectors: ["Électricité", "Gaz", "Solaire", "Éolien"],
        },
        {
            id: "5",
            name: "Immobilier",
            slug: "immobilier",
            icon: MapPin,
            description:
                "Achat, location, gestion immobilière et investissement",
            shortDescription: "Achat, location, gestion",
            providers: 156,
            avgSavings: "12%",
            reviews: 4300,
            rating: 4.5,
            color: "text-red-600",
            bgColor: "bg-red-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
                "Maroc",
            ],
            subSectors: ["Achat", "Location", "Gestion", "Investissement"],
        },
        {
            id: "6",
            name: "Transport",
            slug: "transport",
            icon: Car,
            description:
                "Auto, moto, transport public et solutions de mobilité",
            shortDescription: "Auto, moto, transport public",
            providers: 67,
            avgSavings: "18%",
            reviews: 9200,
            rating: 4.4,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
            ],
            subSectors: [
                "Véhicules",
                "Motos",
                "Transport public",
                "Covoiturage",
            ],
        },
        {
            id: "7",
            name: "Voyages",
            slug: "voyage",
            icon: Plane,
            description: "Vols, hôtels, séjours et solutions de voyage",
            shortDescription: "Vols, hôtels, séjours",
            providers: 89,
            avgSavings: "22%",
            reviews: 3400,
            rating: 4.3,
            trending: true,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
            countries: ["Multi-pays"],
            subSectors: ["Vols", "Hôtels", "Séjours", "Activités"],
        },
        {
            id: "8",
            name: "Éducation",
            slug: "education",
            icon: GraduationCap,
            description:
                "Écoles, formations, cours en ligne et solutions éducatives",
            shortDescription: "Écoles, formations, cours",
            providers: 234,
            avgSavings: "28%",
            reviews: 2100,
            rating: 4.6,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
            ],
            subSectors: [
                "Écoles",
                "Formations",
                "Cours en ligne",
                "Certifications",
            ],
        },
        {
            id: "9",
            name: "Santé",
            slug: "sante",
            icon: Heart,
            description:
                "Cliniques, pharmacies, soins médicaux et solutions santé",
            shortDescription: "Cliniques, pharmacies, soins",
            providers: 178,
            avgSavings: "16%",
            reviews: 5600,
            rating: 4.7,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            countries: [
                "Côte d'Ivoire",
                "Sénégal",
                "Ghana",
                "Nigeria",
                "Kenya",
                "Maroc",
            ],
            subSectors: [
                "Cliniques",
                "Pharmacies",
                "Laboratoires",
                "Télémédecine",
            ],
        },
        {
            id: "10",
            name: "Commerce",
            slug: "commerce",
            icon: ShoppingBag,
            description:
                "Magasins, e-commerce, services commerciaux et distribution",
            shortDescription: "Magasins, e-commerce, services",
            providers: 345,
            avgSavings: "14%",
            reviews: 7800,
            rating: 4.2,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            countries: ["Multi-pays"],
            subSectors: ["E-commerce", "Magasins", "Distribution", "Services"],
        },
        {
            id: "11",
            name: "Entreprises",
            slug: "entreprise",
            icon: Building,
            description:
                "Services B2B, solutions professionnelles et outils d'entreprise",
            shortDescription: "B2B, services professionnels",
            providers: 123,
            avgSavings: "19%",
            reviews: 1900,
            rating: 4.5,
            color: "text-slate-600",
            bgColor: "bg-slate-50",
            countries: ["Multi-pays"],
            subSectors: ["Consulting", "IT", "Marketing", "Juridique"],
        },
    ]

    const filteredSectors = sectors.filter(sector => {
        const matchesSearch =
            sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sector.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            sector.subSectors.some(sub =>
                sub.toLowerCase().includes(searchQuery.toLowerCase())
            )

        const matchesFilter =
            filterType === "all" ||
            (filterType === "popular" && sector.popular) ||
            (filterType === "trending" && sector.trending)

        return matchesSearch && matchesFilter
    })

    const popularSectors = sectors.filter(sector => sector.popular)
    const trendingSectors = sectors.filter(sector => sector.trending)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-afroGreen via-afroGold to-afroRed py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Tous les Secteurs AfricaHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Explorez et comparez dans tous les secteurs clés de
                            l'économie africaine
                        </p>

                        {/* Statistiques globales */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold">
                                    {sectors.length}
                                </div>
                                <div className="text-sm opacity-80">
                                    Secteurs couverts
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">500+</div>
                                <div className="text-sm opacity-80">
                                    Fournisseurs
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">15</div>
                                <div className="text-sm opacity-80">
                                    Pays africains
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">25%</div>
                                <div className="text-sm opacity-80">
                                    Économies moyennes
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
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Rechercher un secteur..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-afroGreen"
                            >
                                <option value="all">Tous les secteurs</option>
                                <option value="popular">Populaires</option>
                                <option value="trending">Tendances</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Secteurs populaires */}
                {popularSectors.length > 0 && filterType === "all" && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Star className="w-6 h-6 text-afroGold mr-2" />
                            Secteurs populaires
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularSectors.map(sector => (
                                <Card
                                    key={sector.id}
                                    className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                                >
                                    <CardHeader
                                        className={`${sector.bgColor} rounded-t-lg`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`w-12 h-12 ${sector.bgColor} rounded-xl flex items-center justify-center border-2 border-white shadow-md`}
                                                >
                                                    <sector.icon
                                                        className={`w-6 h-6 ${sector.color}`}
                                                    />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl">
                                                        {sector.name}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            sector.shortDescription
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Badge className="bg-afroGold text-white">
                                                    Populaire
                                                </Badge>
                                                {sector.trending && (
                                                    <Badge className="bg-afroRed text-white">
                                                        <TrendingUpIcon className="w-3 h-3 mr-1" />
                                                        Tendance
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {sector.description}
                                        </p>

                                        {/* Statistiques */}
                                        <div className="grid grid-cols-3 gap-4 mb-4 py-3 bg-gray-50 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-afroGreen">
                                                    {sector.providers}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Fournisseurs
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-afroGreen">
                                                    {sector.avgSavings}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Économies
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-afroGreen">
                                                    {sector.rating}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Note moyenne
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sous-secteurs */}
                                        <div className="mb-4">
                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                Sous-secteurs :
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {sector.subSectors
                                                    .slice(0, 4)
                                                    .map(subSector => (
                                                        <Badge
                                                            key={subSector}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {subSector}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        </div>

                                        <Button
                                            asChild
                                            className="w-full bg-afroGreen hover:bg-afroGreen/90"
                                        >
                                            <Link
                                                to={`/secteur/${sector.slug}`}
                                            >
                                                Explorer {sector.name}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tous les secteurs */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {filterType === "all"
                            ? "Tous les secteurs"
                            : filterType === "popular"
                            ? "Secteurs populaires"
                            : "Secteurs en tendance"}{" "}
                        ({filteredSectors.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSectors.map(sector => (
                            <Card
                                key={sector.id}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div
                                            className={`w-10 h-10 ${sector.bgColor} rounded-lg flex items-center justify-center`}
                                        >
                                            <sector.icon
                                                className={`w-5 h-5 ${sector.color}`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                {sector.name}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                {sector.shortDescription}
                                            </p>
                                        </div>
                                        {sector.trending && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-afroRed/10 text-afroRed"
                                            >
                                                Tendance
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {sector.description}
                                    </p>

                                    {/* Statistiques compactes */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            {sector.providers} fournisseurs
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                            {sector.rating}
                                        </div>
                                        <div className="text-afroGreen font-medium">
                                            {sector.avgSavings} d'économies
                                        </div>
                                    </div>

                                    {/* Pays disponibles */}
                                    <div className="mb-4">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Disponible dans :
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            {sector.countries
                                                .slice(0, 3)
                                                .join(", ")}
                                            {sector.countries.length > 3 &&
                                                ` +${
                                                    sector.countries.length - 3
                                                } autres`}
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Link to={`/secteur/${sector.slug}`}>
                                            Explorer {sector.name}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-16 bg-gradient-to-r from-afroGreen/10 to-afroGold/10 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Vous ne trouvez pas votre secteur ?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Nous ajoutons régulièrement de nouveaux secteurs.
                        Contactez-nous pour vos besoins spécifiques.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            className="bg-afroGreen hover:bg-afroGreen/90"
                        >
                            <Link to="/contact">Nous contacter</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/business">Devenir partenaire</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Secteurs
