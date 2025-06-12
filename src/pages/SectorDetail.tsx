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

import { SectorNavigation } from "@/components/navigation/SectorNavigation"
import { SectorComparisonInterface } from "@/components/sector/SectorComparisonInterface"
import { useSector } from "@/hooks/useSectors"
import { getSectorIcon } from "@/components/sector/SectorIcons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, FileText, Info } from "lucide-react"

export default function SectorDetail() {
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

    const IconComponent = getSectorIcon(sector.icon)

    return (
        <div className="flex flex-col">
            <main>
                {/* Hero Section */}
                <SectionBackground variant="subtle" withDecorations>
                    <div className="container px-4 md:px-6 py-12">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
                                    style={{ backgroundColor: sector.color }}
                                >
                                    <IconComponent className="h-8 w-8" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-afroGreen via-afroGold to-afroRed bg-clip-text text-transparent tracking-tight">
                                {sector.name}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                                {sector.description}
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

                {/* Main Content */}
                <SectionBackground variant="default">
                    <div className="container px-4 md:px-6 py-16">
                        <Tabs defaultValue="compare" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger
                                    value="compare"
                                    className="flex items-center gap-2"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Comparer les produits
                                </TabsTrigger>
                                <TabsTrigger
                                    value="info"
                                    className="flex items-center gap-2"
                                >
                                    <Info className="h-4 w-4" />
                                    Informations
                                </TabsTrigger>
                                <TabsTrigger
                                    value="quote"
                                    className="flex items-center gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Demander un devis
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="compare" className="mt-8">
                                <PremiumCard variant="elevated" size="lg">
                                    <PremiumCardHeader>
                                        <PremiumCardTitle>
                                            Comparaison des produits{" "}
                                            {sector.name}
                                        </PremiumCardTitle>
                                        <PremiumCardDescription>
                                            Comparez les différentes offres
                                            disponibles dans le secteur{" "}
                                            {sector.name.toLowerCase()}
                                        </PremiumCardDescription>
                                    </PremiumCardHeader>
                                    <PremiumCardContent className="pt-6">
                                        <SectorComparisonInterface
                                            sectorSlug={sector.slug}
                                            sectorName={sector.name}
                                        />
                                    </PremiumCardContent>
                                </PremiumCard>
                            </TabsContent>

                            <TabsContent value="info" className="mt-8">
                                <PremiumCard variant="elevated" size="lg">
                                    <PremiumCardHeader>
                                        <PremiumCardTitle>
                                            À propos du secteur {sector.name}
                                        </PremiumCardTitle>
                                    </PremiumCardHeader>
                                    <PremiumCardContent className="pt-6">
                                        <div className="prose max-w-none">
                                            <p className="text-gray-600 leading-relaxed">
                                                {sector.description}
                                            </p>
                                            <h3 className="text-lg font-semibold mt-6 mb-3">
                                                Pourquoi comparer ?
                                            </h3>
                                            <ul className="space-y-2 text-gray-600">
                                                <li>
                                                    • Trouvez les meilleures
                                                    offres adaptées à vos
                                                    besoins
                                                </li>
                                                <li>
                                                    • Comparez les prix et les
                                                    services en toute
                                                    transparence
                                                </li>
                                                <li>
                                                    • Bénéficiez de l'expertise
                                                    de nos partenaires vérifiés
                                                </li>
                                                <li>
                                                    • Économisez du temps et de
                                                    l'argent
                                                </li>
                                            </ul>
                                        </div>
                                    </PremiumCardContent>
                                </PremiumCard>
                            </TabsContent>

                            <TabsContent value="quote" className="mt-8">
                                <PremiumCard variant="elevated" size="lg">
                                    <PremiumCardHeader>
                                        <PremiumCardTitle>
                                            Demander un devis personnalisé
                                        </PremiumCardTitle>
                                        <PremiumCardDescription>
                                            Obtenez des devis gratuits de nos
                                            partenaires pour vos besoins en{" "}
                                            {sector.name.toLowerCase()}
                                        </PremiumCardDescription>
                                    </PremiumCardHeader>
                                    <PremiumCardContent className="pt-6">
                                        <div className="text-center py-12">
                                            <p className="text-gray-600 mb-4">
                                                La fonctionnalité de demande de
                                                devis sera bientôt disponible.
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                En attendant, utilisez notre
                                                outil de comparaison pour
                                                explorer les options
                                                disponibles.
                                            </p>
                                        </div>
                                    </PremiumCardContent>
                                </PremiumCard>
                            </TabsContent>
                        </Tabs>
                    </div>
                </SectionBackground>
            </main>
        </div>
    )
}
