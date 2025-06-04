import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Search, Globe, Star, TrendingUp } from "lucide-react"
import { useGlobalStats } from "@/hooks/useGlobalStats"

export const StatsSection: React.FC = () => {
    const { stats, loading } = useGlobalStats()
    const [animatedStats, setAnimatedStats] = useState({
        companies: 0,
        users: 0,
        comparisons: 0,
        countries: 0,
        reviews: 0,
        satisfaction: 0,
    })

    // Animation des compteurs
    useEffect(() => {
        if (!stats || loading) return

        const duration = 2000 // 2 secondes
        const steps = 60 // 60 FPS
        const stepDuration = duration / steps

        let currentStep = 0
        const timer = setInterval(() => {
            currentStep++
            const progress = Math.min(currentStep / steps, 1)

            // Fonction d'easing pour une animation plus fluide
            const easeOut = 1 - Math.pow(1 - progress, 3)

            setAnimatedStats({
                companies: Math.round(stats.companies * easeOut),
                users: Math.round(stats.users * easeOut),
                comparisons: Math.round(stats.comparisons * easeOut),
                countries: Math.round(stats.countries * easeOut),
                reviews: Math.round(stats.reviews * easeOut),
                satisfaction: Math.round(stats.satisfaction * easeOut),
            })

            if (progress === 1) {
                clearInterval(timer)
            }
        }, stepDuration)

        return () => clearInterval(timer)
    }, [stats, loading])

    const statsData = [
        {
            label: "Entreprises partenaires",
            value: animatedStats.companies,
            suffix: "+",
            icon: Building2,
            color: "text-marineBlue-600",
            bgColor: "bg-marineBlue-50",
        },
        {
            label: "Utilisateurs actifs",
            value: animatedStats.users,
            suffix: "K+",
            icon: Users,
            color: "text-brandSky",
            bgColor: "bg-brandSky/10",
        },
        {
            label: "Comparaisons effectuées",
            value: animatedStats.comparisons,
            suffix: "K+",
            icon: Search,
            color: "text-marineBlue-700",
            bgColor: "bg-marineBlue-100",
        },
        {
            label: "Pays couverts",
            value: animatedStats.countries,
            suffix: "",
            icon: Globe,
            color: "text-marineBlue-600",
            bgColor: "bg-marineBlue-50",
        },
        {
            label: "Avis clients",
            value: animatedStats.reviews,
            suffix: "+",
            icon: Star,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
        },
        {
            label: "Satisfaction client",
            value: animatedStats.satisfaction,
            suffix: "%",
            icon: TrendingUp,
            color: "text-brandSky",
            bgColor: "bg-brandSky/10",
        },
    ]

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Notre impact en chiffres
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Découvrez la confiance que nous accordent nos
                            utilisateurs à travers l'Afrique
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-6">
                                    <div className="animate-pulse">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-gradient-to-br from-marineBlue-50 via-white to-brandSky/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-gradient-to-r from-marineBlue-600 to-brandSky text-white shadow-sm">
                        🚀 Croissance continue
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent mb-4">
                        Notre impact en chiffres
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Découvrez la confiance que nous accordent nos
                        utilisateurs à travers l'Afrique
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {statsData.map((stat, index) => {
                        const IconComponent = stat.icon
                        return (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-all duration-300 group"
                            >
                                <CardContent className="p-6">
                                    <div
                                        className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <IconComponent
                                            className={`w-6 h-6 ${stat.color}`}
                                        />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {stat.value.toLocaleString()}
                                        {stat.suffix}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Message de croissance */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Statistiques mises à jour en temps réel • Dernière mise
                        à jour : {new Date().toLocaleDateString("fr-FR")}
                    </p>
                </div>
            </div>
        </section>
    )
}
