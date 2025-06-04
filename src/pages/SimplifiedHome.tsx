import React from "react"
import { ModernHeroSection } from "@/components/hero/ModernHeroSection"
import { HeroStatsSection } from "@/components/hero/HeroStatsSection"
import { StatsSection } from "@/components/home/StatsSection"
import { PopularSectorsSection } from "@/components/home/PopularSectorsSection"
import { DealsSection } from "@/components/home/DealsSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { TrustSection } from "@/components/home/TrustSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { FAQSection } from "@/components/home/FAQSection"
import { InteractiveMapSection } from "@/components/sections/InteractiveMapSection"
import { QuickNavigation } from "@/components/navigation/QuickNavigation"
import { AIInsightsWidget } from "@/components/ai/AIInsightsWidget"
import ModernMultiSectorAssistant from "@/components/ModernMultiSectorAssistant"
import { useAuth } from "@/contexts/AuthContext"
import { useTranslation } from "@/hooks/useTranslation"
import { SectionBackground } from "@/components/ui/section-background"
import { GlassCard } from "@/components/ui/glass-card"

const SimplifiedHome = () => {
    const { user } = useAuth()
    const { t } = useTranslation()

    return (
        <div className="flex flex-col">
            {/* Hero Section - Première impression */}
            <ModernHeroSection />

            {/* Hero Stats Section - Statistiques visuelles */}
            <HeroStatsSection />

            {/* Section statistiques - Crédibilité immédiate */}
            <StatsSection />

            {/* Section bons plans - Urgence et valeur */}
            <DealsSection />

            {/* Section secteurs populaires - Navigation claire */}
            <PopularSectorsSection />

            {/* Comment ça marche - Processus simple */}
            <HowItWorksSection />

            {/* Section confiance - Rassurer les utilisateurs */}
            <TrustSection />

            {/* Témoignages - Preuve sociale */}
            <TestimonialsSection />

            {/* Section carte interactive - Couverture géographique */}
            <InteractiveMapSection />

            {/* Section insights utilisateur - Personnalisation pour les connectés */}
            {user && (
                <SectionBackground variant="accent" withDecorations>
                    <div className="container mx-auto px-4 py-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-marineBlue-600 via-brandSky to-marineBlue-400 bg-clip-text text-transparent tracking-tight">
                                {t(
                                    "insights.personal.title",
                                    "Vos insights personnalisés multi-sectoriels"
                                )}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                                Découvrez des opportunités personnalisées et des
                                tendances adaptées à votre profil
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <GlassCard variant="premium" size="xl" radius="xl">
                                <AIInsightsWidget />
                            </GlassCard>
                        </div>
                    </div>
                </SectionBackground>
            )}

            {/* Composants flottants - Assistance et navigation */}
            <ModernMultiSectorAssistant />
            <QuickNavigation />
        </div>
    )
}

export default SimplifiedHome
