import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    ShoppingBag, 
    Store, 
    Truck, 
    CreditCard, 
    Package, 
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    DollarSign,
    TrendingUp,
    Globe
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur commerce en Afrique
 * Présente e-commerce, retail, distribution, paiements
 */
export const Commerce: React.FC = () => {
    const { t } = useTranslation()

    const commerceServices = [
        {
            icon: ShoppingBag,
            title: "E-commerce",
            description: "Plateformes de vente en ligne",
            features: ["Marketplace", "Boutiques en ligne", "Mobile commerce", "Cross-border"],
            providers: 450,
            avgPrice: "2.5% commission"
        },
        {
            icon: Store,
            title: "Commerce de Détail",
            description: "Magasins et points de vente physiques",
            features: ["Supermarchés", "Boutiques", "Centres commerciaux", "Franchises"],
            providers: 25000,
            avgPrice: "Variable"
        },
        {
            icon: Truck,
            title: "Logistique",
            description: "Solutions de livraison et distribution",
            features: ["Livraison express", "Entrepôts", "Last mile", "Supply chain"],
            providers: 180,
            avgPrice: "5 $/livraison"
        },
        {
            icon: CreditCard,
            title: "Paiements",
            description: "Solutions de paiement digital",
            features: ["Mobile money", "Cartes bancaires", "Crypto", "Paiement en ligne"],
            providers: 85,
            avgPrice: "1.8% transaction"
        }
    ]

    const topPlatforms = [
        {
            name: "Jumia",
            logo: "🛒",
            rating: 4.2,
            reviews: 25000,
            speciality: "E-commerce panafricain",
            coverage: "11 pays"
        },
        {
            name: "Konga",
            logo: "🛍️",
            rating: 4.1,
            reviews: 18000,
            speciality: "Marketplace Nigeria",
            coverage: "Nigeria"
        },
        {
            name: "Takealot",
            logo: "📦",
            rating: 4.4,
            reviews: 22000,
            speciality: "E-commerce Afrique du Sud",
            coverage: "Afrique du Sud"
        },
        {
            name: "Kilimall",
            logo: "🏪",
            rating: 4.0,
            reviews: 15000,
            speciality: "Marketplace Afrique de l'Est",
            coverage: "Kenya, Uganda"
        }
    ]

    const categories = [
        {
            name: "Électronique",
            icon: "📱",
            products: "2.5M",
            growth: "+25%",
            avgPrice: "150 $"
        },
        {
            name: "Mode & Beauté",
            icon: "👗",
            products: "1.8M",
            growth: "+35%",
            avgPrice: "45 $"
        },
        {
            name: "Maison & Jardin",
            icon: "🏠",
            products: "950K",
            growth: "+20%",
            avgPrice: "85 $"
        },
        {
            name: "Alimentation",
            icon: "🍎",
            products: "1.2M",
            growth: "+40%",
            avgPrice: "25 $"
        }
    ]

    const benefits = [
        "Comparaison de prix en temps réel sur toutes les plateformes",
        "Cashback et codes promo exclusifs",
        "Protection acheteur et garantie satisfait ou remboursé",
        "Livraison trackée et assurance colis",
        "Support client multilingue et résolution de litiges"
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <ShoppingBag className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Commerce en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Découvrez les meilleures plateformes e-commerce, magasins et solutions 
                            de paiement pour acheter et vendre à travers tout le continent africain
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Explorer les Offres
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Store className="w-5 h-5 mr-2" />
                                Vendre en Ligne
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services commerce */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solutions Commerce Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez tous les services pour acheter, vendre et développer votre activité commerciale
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {commerceServices.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-marineBlue-500">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-marineBlue-100 rounded-lg">
                                                <Icon className="w-6 h-6 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">{service.title}</CardTitle>
                                                <CardDescription>{service.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {service.providers.toLocaleString()} partenaires
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    Tarif: {service.avgPrice}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className="w-full mt-4" variant="outline">
                                                Explorer les solutions
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Catégories populaires */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Catégories Populaires
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les secteurs e-commerce en forte croissance en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{category.icon}</div>
                                    <CardTitle className="text-lg">{category.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-600">
                                            {category.products} produits
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                            <span className="text-green-600 font-semibold">{category.growth}</span>
                                        </div>
                                        <div className="text-lg font-bold text-marineBlue-600">
                                            Prix moyen: {category.avgPrice}
                                        </div>
                                        <Button size="sm" className="w-full">
                                            Explorer
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Plateformes */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principales Plateformes E-commerce
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les marketplaces les plus populaires en Afrique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topPlatforms.map((platform, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{platform.logo}</div>
                                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                                    <CardDescription>{platform.speciality}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{platform.rating}</span>
                                            <span className="text-sm text-gray-500">({platform.reviews})</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {platform.coverage}
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Visiter
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Avantages */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi Acheter avec AfricaHub ?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-8 bg-marineBlue-50 rounded-lg shadow-lg text-center">
                                <Globe className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Commerce Panafricain</h3>
                                <p className="text-gray-600">
                                    Accédez aux meilleures offres commerciales dans plus de 
                                    45 pays africains avec livraison internationale
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Prêt à Découvrir les Meilleures Offres ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Comparez les prix et trouvez les meilleures affaires sur toutes les plateformes
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/commerce/search">
                            <Button size="lg" className="bg-white text-marineBlue-600 hover:bg-marineBlue-50">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Comparer les Prix
                            </Button>
                        </Link>
                        <Link to="/secteur/commerce/sell">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <Store className="w-5 h-5 mr-2" />
                                Vendre en Ligne
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Commerce
