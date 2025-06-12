import React, { useState } from "react"
import {
    CreditCard,
    Check,
    X,
    Star,
    Crown,
    Zap,
    Shield,
    Users,
    BarChart3,
    Headphones,
    Globe,
    Smartphone,
    ArrowRight,
    CheckCircle,
    HelpCircle,
    Calculator,
    TrendingUp,
    Award,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PricingPlan {
    id: string
    name: string
    description: string
    icon: React.ComponentType<any>
    monthlyPrice: number
    yearlyPrice: number
    features: string[]
    limitations: string[]
    popular?: boolean
    enterprise?: boolean
}

const Pricing: React.FC = () => {
    const [isYearly, setIsYearly] = useState(false)
    const [activeTab, setActiveTab] = useState("plans")

    // Plans de tarification
    const pricingPlans: PricingPlan[] = [
        {
            id: "free",
            name: "Gratuit",
            description: "Parfait pour découvrir AfricaHub",
            icon: Users,
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                "Comparaisons illimitées",
                "Accès à tous les secteurs",
                "Guides d'achat de base",
                "Support communautaire",
            ],
            limitations: [
                "Publicités affichées",
                "Pas de recommandations IA",
                "Support limité",
            ],
        },
        {
            id: "premium",
            name: "Premium",
            description: "Pour les utilisateurs réguliers",
            icon: Star,
            monthlyPrice: 2500,
            yearlyPrice: 25000,
            features: [
                "Tout du plan Gratuit",
                "Recommandations IA personnalisées",
                "Comparaisons avancées",
                "Alertes prix en temps réel",
                "Guides experts exclusifs",
                "Support prioritaire",
                "Interface sans publicité",
            ],
            limitations: ["Limité à 1 utilisateur", "Historique 6 mois"],
            popular: true,
        },
        {
            id: "business",
            name: "Business",
            description: "Pour les professionnels et entreprises",
            icon: Crown,
            monthlyPrice: 15000,
            yearlyPrice: 150000,
            features: [
                "Tout du plan Premium",
                "Comptes multi-utilisateurs (5)",
                "Analytics avancés",
                "API d'intégration",
                "Rapports personnalisés",
                "Account manager dédié",
                "Formation équipe",
                "Historique illimité",
            ],
            limitations: ["Maximum 5 utilisateurs"],
        },
        {
            id: "enterprise",
            name: "Enterprise",
            description: "Solutions sur mesure",
            icon: Shield,
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                "Tout du plan Business",
                "Utilisateurs illimités",
                "White label disponible",
                "Intégration personnalisée",
                "SLA garantie 99.9%",
                "Support 24/7",
                "Formations sur site",
                "Développements spécifiques",
            ],
            limitations: [],
            enterprise: true,
        },
    ]

    const formatPrice = (price: number) => {
        if (price === 0) return "Gratuit"
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const getPrice = (plan: PricingPlan) => {
        if (plan.enterprise) return "Sur devis"
        return formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-marineBlue-50/20 via-white to-brandSky/5">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                            💳 Tarification AfricaHub
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                            Choisissez le plan qui correspond à vos besoins et
                            votre budget
                        </p>

                        {/* Toggle annuel/mensuel */}
                        <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
                            <span
                                className={`text-sm ${
                                    !isYearly ? "font-semibold" : "opacity-80"
                                }`}
                            >
                                Mensuel
                            </span>
                            <Switch
                                checked={isYearly}
                                onCheckedChange={setIsYearly}
                                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/30"
                            />
                            <span
                                className={`text-sm ${
                                    isYearly ? "font-semibold" : "opacity-80"
                                }`}
                            >
                                Annuel
                            </span>
                            {isYearly && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-2">
                                    -17%
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Plans de tarification */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Nos Plans & Tarifs
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Des solutions adaptées à tous les besoins, du
                        particulier à l'entreprise
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {pricingPlans.map(plan => (
                        <Card
                            key={plan.id}
                            className={`relative hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                                plan.popular
                                    ? "border-2 border-orange-200"
                                    : "border border-marineBlue-100"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1">
                                        Le plus populaire
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center">
                                <div className="w-12 h-12 bg-marineBlue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <plan.icon className="w-6 h-6 text-marineBlue-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    {plan.name}
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    {plan.description}
                                </p>

                                <div className="py-4">
                                    <div className="text-3xl font-bold text-marineBlue-600">
                                        {getPrice(plan)}
                                        {!plan.enterprise &&
                                            plan.monthlyPrice > 0 && (
                                                <span className="text-lg font-normal text-gray-500">
                                                    /{isYearly ? "an" : "mois"}
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3 mb-6">
                                    {plan.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <CheckCircle className="w-4 h-4 text-marineBlue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                    {plan.limitations.map(
                                        (limitation, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start"
                                            >
                                                <X className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-500">
                                                    {limitation}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>

                                <Button
                                    className={`w-full ${
                                        plan.popular
                                            ? "bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm"
                                            : "border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                                    }`}
                                    variant={
                                        plan.popular ? "default" : "outline"
                                    }
                                >
                                    {plan.enterprise
                                        ? "Nous contacter"
                                        : plan.monthlyPrice === 0
                                        ? "Commencer gratuitement"
                                        : "Choisir ce plan"}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA Final */}
                <section className="bg-gradient-to-r from-marineBlue-50 via-brandSky/10 to-marineBlue-50 rounded-2xl p-8 text-center border border-marineBlue-100">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Prêt à commencer ?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Rejoignez des milliers d'utilisateurs qui économisent
                        déjà avec AfricaHub
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-gradient-to-r from-marineBlue-600 to-brandSky hover:from-marineBlue-700 hover:to-brandSky-dark text-white shadow-sm">
                            <Star className="w-4 h-4 mr-2" />
                            Essai gratuit 14 jours
                        </Button>
                        <Button
                            variant="outline"
                            className="border-marineBlue-600 text-marineBlue-600 hover:bg-marineBlue-600 hover:text-white"
                        >
                            <Headphones className="w-4 h-4 mr-2" />
                            Parler à un expert
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Pricing
