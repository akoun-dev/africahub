import React from "react"
import { useParams, useSearchParams } from "react-router-dom"
import {
    PremiumCard,
    PremiumCardContent,
    PremiumCardHeader,
    PremiumCardTitle,
    PremiumCardDescription,
} from "@/components/ui/premium-card"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionBackground } from "@/components/ui/section-background"
import { SectorQuoteRequestForm } from "@/components/quotes/SectorQuoteRequestForm"

import { SectorNavigation } from "@/components/navigation/SectorNavigation"
import { useSector } from "@/hooks/useSectors"
import { FileText, Zap, Shield } from "lucide-react"

export default function SectorQuote() {
    const { slug } = useParams<{ slug: string }>()
    const [searchParams] = useSearchParams()
    const { data: sector, isLoading } = useSector(slug)

    // Get preselected products from URL params
    const preselectedProducts = searchParams.get("products")?.split(",") || []

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
                                Demande de devis - {sector.name}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                                Obtenez des devis personnalisés pour votre
                                assurance {sector.name.toLowerCase()}
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

                {/* Benefits Section */}
                <SectionBackground variant="accent" withPattern>
                    <div className="container px-4 md:px-6 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <GlassCard variant="accent" size="default">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap className="h-6 w-6 text-afroGreen" />
                                    <h3 className="font-semibold text-gray-900">
                                        Devis instantané
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Recevez votre devis personnalisé en quelques
                                    minutes
                                </p>
                            </GlassCard>

                            <GlassCard variant="gold" size="default">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="h-6 w-6 text-afroGold" />
                                    <h3 className="font-semibold text-gray-900">
                                        Données sécurisées
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Vos informations personnelles sont protégées
                                    et confidentielles
                                </p>
                            </GlassCard>

                            <GlassCard variant="accent" size="default">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="h-6 w-6 text-afroRed" />
                                    <h3 className="font-semibold text-gray-900">
                                        Sans engagement
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Demandez autant de devis que vous le
                                    souhaitez gratuitement
                                </p>
                            </GlassCard>
                        </div>
                    </div>
                </SectionBackground>

                {/* Quote Form */}
                <SectionBackground variant="muted">
                    <div className="container px-4 md:px-6 py-16">
                        <PremiumCard
                            variant="elevated"
                            size="lg"
                            className="max-w-4xl mx-auto"
                        >
                            <PremiumCardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="p-2 rounded-lg text-white"
                                        style={{
                                            backgroundColor: sector.color,
                                        }}
                                    >
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <PremiumCardTitle>
                                        Formulaire de demande de devis
                                    </PremiumCardTitle>
                                </div>
                                <PremiumCardDescription>
                                    Remplissez ce formulaire pour recevoir des
                                    devis personnalisés de nos partenaires
                                </PremiumCardDescription>
                            </PremiumCardHeader>
                            <PremiumCardContent className="pt-6">
                                <SectorQuoteRequestForm
                                    sectorSlug={slug}
                                    preselectedProducts={preselectedProducts}
                                />
                            </PremiumCardContent>
                        </PremiumCard>
                    </div>
                </SectionBackground>
            </main>
        </div>
    )
}
