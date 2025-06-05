import React from "react"
import { useTranslation } from "@/hooks/useTranslation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Banknote,
    CreditCard,
    PiggyBank,
    TrendingUp,
    Shield,
    Smartphone,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page dédiée au secteur bancaire en Afrique
 * Présente les services bancaires, comptes, crédits, épargne, mobile banking
 */
export const Banque: React.FC = () => {
    const { t } = useTranslation()

    const bankingServices = [
        {
            icon: CreditCard,
            title: "Comptes Bancaires",
            description: "Comptes courants, épargne et professionnels",
            features: [
                "Carte bancaire",
                "Virements",
                "Prélèvements",
                "Découvert autorisé",
            ],
            providers: 25,
            avgRate: "0.5%",
        },
        {
            icon: TrendingUp,
            title: "Crédits & Prêts",
            description: "Financement personnel et professionnel",
            features: [
                "Crédit auto",
                "Crédit immobilier",
                "Crédit consommation",
                "Microfinance",
            ],
            providers: 18,
            avgRate: "8.5%",
        },
        {
            icon: PiggyBank,
            title: "Épargne & Placement",
            description: "Solutions d'épargne et d'investissement",
            features: [
                "Livret épargne",
                "Dépôt à terme",
                "Assurance vie",
                "Fonds d'investissement",
            ],
            providers: 22,
            avgRate: "3.2%",
        },
        {
            icon: Smartphone,
            title: "Mobile Banking",
            description: "Services bancaires mobiles et digitaux",
            features: [
                "Transfert d'argent",
                "Paiement mobile",
                "Portefeuille électronique",
                "QR Code",
            ],
            providers: 35,
            avgRate: "1.5%",
        },
    ]

    const topBanks = [
        {
            name: "Ecobank",
            logo: "🏦",
            rating: 4.5,
            reviews: 2500,
            speciality: "Banque panafricaine",
            countries: 33,
        },
        {
            name: "UBA",
            logo: "🏛️",
            rating: 4.3,
            reviews: 1800,
            speciality: "Services diversifiés",
            countries: 20,
        },
        {
            name: "Standard Bank",
            logo: "🏢",
            rating: 4.4,
            reviews: 2200,
            speciality: "Banque d'investissement",
            countries: 18,
        },
        {
            name: "Société Générale",
            logo: "🏦",
            rating: 4.2,
            reviews: 1600,
            speciality: "Banque de détail",
            countries: 15,
        },
    ]

    const benefits = [
        "Comparaison en temps réel des taux et frais",
        "Accès aux meilleures offres bancaires d'Afrique",
        "Conseils personnalisés selon votre profil",
        "Support multilingue et multi-devises",
        "Sécurité et confidentialité garanties",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50 to-brandSky-50">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white/20 rounded-full">
                                <Banknote className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Services Bancaires en Afrique
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-marineBlue-100 max-w-3xl mx-auto">
                            Comparez les banques, comptes, crédits et services
                            financiers dans toute l'Afrique pour trouver les
                            meilleures conditions
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                            >
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Comparer les Banques
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <Smartphone className="w-5 h-5 mr-2" />
                                Mobile Banking
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services bancaires */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Services Bancaires Disponibles
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Découvrez tous les services bancaires et financiers
                            proposés par les institutions africaines
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {bankingServices.map((service, index) => {
                            const Icon = service.icon
                            return (
                                <Card
                                    key={index}
                                    className="hover:shadow-lg transition-shadow border-l-4 border-l-marineBlue-500"
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-marineBlue-100 rounded-lg">
                                                <Icon className="w-6 h-6 text-marineBlue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">
                                                    {service.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {service.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {service.providers}{" "}
                                                    fournisseurs
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp className="w-4 h-4" />
                                                    Taux moyen:{" "}
                                                    {service.avgRate}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {service.features.map(
                                                    (feature, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <CheckCircle className="w-4 h-4 text-marineBlue-500" />
                                                            {feature}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <Button
                                                className="w-full mt-4"
                                                variant="outline"
                                            >
                                                Comparer les offres
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

            {/* Top Banques */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Principales Banques Africaines
                        </h2>
                        <p className="text-xl text-gray-600">
                            Les institutions bancaires les mieux notées sur le
                            continent
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topBanks.map((bank, index) => (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <div className="text-4xl mb-2">
                                        {bank.logo}
                                    </div>
                                    <CardTitle className="text-lg">
                                        {bank.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {bank.speciality}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">
                                                {bank.rating}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({bank.reviews})
                                            </span>
                                        </div>
                                        <Badge variant="secondary">
                                            {bank.countries} pays
                                        </Badge>
                                        <Button size="sm" className="w-full">
                                            Voir les offres
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Avantages */}
            <section className="py-16 px-4 bg-marineBlue-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi Comparer avec AfricaHub ?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-marineBlue-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                                <Shield className="w-12 h-12 text-marineBlue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">
                                    Sécurisé & Fiable
                                </h3>
                                <p className="text-gray-600">
                                    Vos données sont protégées et nous
                                    travaillons uniquement avec des institutions
                                    financières agréées
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
                        Prêt à Trouver Votre Banque Idéale ?
                    </h2>
                    <p className="text-xl mb-8 text-marineBlue-100">
                        Comparez gratuitement les offres bancaires et trouvez
                        les meilleures conditions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/secteur/banque/compare">
                            <Button
                                size="lg"
                                className="bg-white text-marineBlue-600 hover:bg-marineBlue-50"
                            >
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Commencer la Comparaison
                            </Button>
                        </Link>
                        <Link to="/secteur/banque/quote">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                            >
                                Demander un Devis
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Banque
