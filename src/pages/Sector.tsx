import React from "react"
import { useParams } from "react-router-dom"
import { useSector } from "@/hooks/useSector"
import { useSectorConfiguration } from "@/hooks/useSectorConfiguration"
import { useProducts } from "@/hooks/useProducts"
import { useCompanies } from "@/hooks/useCompanies"
import { CMSSectorHero } from "@/components/sector/CMSSectorHero"
import { CMSSectorFeatures } from "@/components/sector/CMSSectorFeatures"
import { CMSSectorBenefits } from "@/components/sector/CMSSectorBenefits"
import { EnhancedSectorFeatures } from "@/components/sector/EnhancedSectorFeatures"
import { EnhancedSectorProducts } from "@/components/sector/EnhancedSectorProducts"
import { SectorTestimonials } from "@/components/sector/SectorTestimonials"
import { SectorStats } from "@/components/sector/SectorStats"
import { PremiumSectorCompanies } from "@/components/sector/PremiumSectorCompanies"

import { SectorNavigation } from "@/components/navigation/SectorNavigation"
import { MobileTabNavigation } from "@/components/mobile/MobileTabNavigation"
import { getSectorIcon } from "@/components/sector/SectorIcons"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useIsMobile } from "@/hooks/use-mobile"
import { OfflineIndicator } from "@/components/mobile/OfflineIndicator"
import { RefreshCw } from "lucide-react"
import PersonalizedSectorContent from "@/components/ai/PersonalizedSectorContent"
import { SectionBackground } from "@/components/ui/section-background"
import { GlassCard } from "@/components/ui/glass-card"

export default function Sector() {
    const { slug } = useParams<{ slug: string }>()
    const {
        data: sector,
        isLoading: sectorLoading,
        isFromCache,
        refreshData,
    } = useSector(slug)
    const { data: configuration } = useSectorConfiguration(sector?.id)
    const { data: companies } = useCompanies(slug)
    const { data: products } = useProducts()
    const geolocation = useGeolocation()
    const isMobile = useIsMobile()

    if (sectorLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marineBlue-600"></div>
                {isMobile && <MobileTabNavigation currentSectorSlug={slug} />}
            </div>
        )
    }

    if (!sector) {
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
                {isMobile && <MobileTabNavigation currentSectorSlug={slug} />}
            </div>
        )
    }

    const IconComponent = getSectorIcon(sector.icon)
    const themeColor = configuration?.theme_colors?.primary || sector.color

    // Filter products for this sector (through product_types)
    const sectorProducts =
        products?.filter(
            product =>
                product.product_types?.slug &&
                ["auto", "home", "health", "micro"].includes(
                    product.product_types.slug
                )
        ) || []

    return (
        <div className="flex flex-col">
            <OfflineIndicator />
            <main className={`${isMobile ? "pb-20" : ""}`}>
                <SectionBackground variant="subtle" withDecorations>
                    <div className="container px-4 md:px-6 pt-8">
                        {/* Mobile location detection */}
                        {isMobile && geolocation.country && (
                            <GlassCard
                                variant="accent"
                                size="sm"
                                className="mb-6"
                            >
                                <p className="text-sm text-blue-800">
                                    📍 Localisation détectée:{" "}
                                    {geolocation.country}
                                    {geolocation.city &&
                                        `, ${geolocation.city}`}
                                </p>
                            </GlassCard>
                        )}

                        {/* Cache indicator */}
                        {isFromCache && (
                            <GlassCard
                                variant="gold"
                                size="sm"
                                className="mb-6"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-yellow-800">
                                        📱 Données du cache (mode hors ligne)
                                    </p>
                                    <button
                                        onClick={refreshData}
                                        className="text-yellow-800 hover:text-yellow-900 transition-colors"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </GlassCard>
                        )}

                        {/* Personalized AI Content */}
                        <PersonalizedSectorContent
                            sectorSlug={sector.slug}
                            userLocation={geolocation.country || "Unknown"}
                        />
                    </div>
                </SectionBackground>

                {/* CMS-Powered Hero Section */}
                <CMSSectorHero
                    sector={sector}
                    themeColor={themeColor}
                    IconComponent={IconComponent}
                />

                <SectionBackground variant="muted">
                    <div className="container px-4 md:px-6 py-8">
                        <SectorNavigation currentSectorSlug={slug} />
                    </div>
                </SectionBackground>

                {/* Enhanced Features Section */}
                <SectionBackground variant="default">
                    <div className="container px-4 md:px-6 py-12">
                        <EnhancedSectorFeatures
                            sectorSlug={sector.slug}
                            sectorColor={themeColor}
                        />
                    </div>
                </SectionBackground>

                {/* Enhanced Products Section */}
                <SectionBackground variant="muted">
                    <div className="container px-4 md:px-6 py-12">
                        <EnhancedSectorProducts
                            sectorId={sector.id}
                            sectorName={sector.name}
                            sectorColor={themeColor}
                        />
                    </div>
                </SectionBackground>

                {/* Testimonials and Stats Section */}
                <SectionBackground variant="default">
                    <div className="container px-4 md:px-6 py-12">
                        <SectorTestimonials
                            sectorSlug={sector.slug}
                            sectorColor={themeColor}
                        />
                    </div>
                </SectionBackground>

                <SectionBackground variant="accent" withPattern>
                    <SectorStats
                        companiesCount={companies?.length || 0}
                        productsCount={sectorProducts.length}
                    />
                </SectionBackground>

                <PremiumSectorCompanies
                    companies={companies || []}
                    sectorName={sector.name}
                    sectorColor={themeColor}
                />
            </main>
            {isMobile && <MobileTabNavigation currentSectorSlug={slug} />}
        </div>
    )
}
