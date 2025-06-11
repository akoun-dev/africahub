import React from "react"
import { useParams } from "react-router-dom"
import {
    PremiumCard,
    PremiumCardContent,
    PremiumCardHeader,
    PremiumCardTitle,
    PremiumCardDescription,
} from "@/components/ui/premium-card"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionBackground } from "@/components/ui/section-background"
import SectorComparisonTable from "@/components/dynamic/SectorComparisonTable"

import { SectorNavigation } from "@/components/navigation/SectorNavigation"
import { useSector } from "@/hooks/useSectors"
import { BarChart3, TrendingUp } from "lucide-react"

export default function SectorCompare() {
    const { slug } = useParams<{ slug: string }>()
    const { data: sector, isLoading } = useSector(slug)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afroGreen"></div>
            </div>
        )
    }

    if (!sector || !slug) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <SectionBackground variant="muted" withPattern>
                    <div className="container px-4 py-20">
                        <GlassCard
                            variant="premium"
                            size="lg"
                            className="max-w-md mx-auto text-center"
                        >
                            <h1 className="text-2xl font-bold mb-4 text-gray-900">
                                Secteur non trouvé
                            </h1>
                            <p className="text-gray-600">
                                Le secteur demandé n'existe pas.
                            </p>
                        </GlassCard>
                    </div>
                </SectionBackground>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <main>
                {/* Hero Section */}
                <SectionBackground variant="subtle" withDecorations>
                    <div className="container px-4 md:px-6 py-12">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent tracking-tight">
                                Comparaison - {sector.name}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                                Comparez les meilleures offres d'assurance{" "}
                                {sector.name.toLowerCase()} disponibles
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <GlassCard
                                variant="premium"
                                size="default"
                                radius="lg"
                            >
                                <SectorNavigation currentSectorSlug={slug} />
                            </GlassCard>
                        </div>
                    </div>
                </SectionBackground>

                {/* Comparison Content */}
                <SectionBackground variant="muted" withPattern>
                    <div className="container px-4 md:px-6 py-16">
                        <PremiumCard variant="elevated" size="lg">
                            <PremiumCardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="p-2 rounded-lg text-white"
                                        style={{
                                            backgroundColor: sector.color,
                                        }}
                                    >
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <PremiumCardTitle>
                                        Tableau de comparaison {sector.name}
                                    </PremiumCardTitle>
                                </div>
                                <PremiumCardDescription>
                                    Analysez et comparez les différentes offres
                                    disponibles dans le secteur{" "}
                                    {sector.name.toLowerCase()}
                                </PremiumCardDescription>
                            </PremiumCardHeader>
                            <PremiumCardContent className="pt-6">
                                <SectorComparisonTable
                                    productTypeSlug={slug}
                                    selectedCountry="NG"
                                />
                            </PremiumCardContent>
                        </PremiumCard>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <GlassCard variant="accent" size="default">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="h-6 w-6 text-afroGreen" />
                                    <h3 className="font-semibold text-gray-900">
                                        Tendances du marché
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Suivez les évolutions des prix et des offres
                                    dans le secteur {sector.name.toLowerCase()}
                                </p>
                            </GlassCard>

                            <GlassCard variant="gold" size="default">
                                <div className="flex items-center gap-3 mb-4">
                                    <BarChart3 className="h-6 w-6 text-afroGold" />
                                    <h3 className="font-semibold text-gray-900">
                                        Analyses détaillées
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Obtenez des insights personnalisés basés sur
                                    votre profil et vos besoins
                                </p>
                            </GlassCard>

                            <GlassCard variant="accent" size="default">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="h-6 w-6 text-afroRed" />
                                    <h3 className="font-semibold text-gray-900">
                                        Recommandations
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Découvrez les meilleures offres recommandées
                                    par notre IA
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </SectionBackground>
            </main>
        </div>
    )
}
