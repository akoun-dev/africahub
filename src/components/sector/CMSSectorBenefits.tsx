import React from "react"
import { PremiumCard, PremiumCardContent } from "@/components/ui/premium-card"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionBackground } from "@/components/ui/section-background"
import { Check } from "lucide-react"
import { useSectorCMSContent } from "@/hooks/useSectorCMSContent"
import { useCountry } from "@/contexts/CountryContext"

interface CMSSectorBenefitsProps {
    sectorSlug: string
    sectorColor: string
}

export const CMSSectorBenefits: React.FC<CMSSectorBenefitsProps> = ({
    sectorSlug,
    sectorColor,
}) => {
    const { content, isLoading } = useSectorCMSContent(sectorSlug)
    const { country } = useCountry()

    if (
        isLoading ||
        !content ||
        !content.benefits ||
        content.benefits.length === 0
    ) {
        return null
    }

    return (
        <SectionBackground variant="muted" withPattern withDecorations>
            <div className="container px-4 md:px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
                        Pourquoi choisir l'assurance {sectorSlug}
                        {country && ` en ${country.name}`} ?
                    </h2>
                    {content.local_partnerships && (
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                            {content.local_partnerships}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {content.benefits.map((benefit, index) => (
                        <GlassCard
                            key={index}
                            variant="premium"
                            size="default"
                            radius="lg"
                            className="group hover:shadow-lg transition-all duration-300"
                        >
                            <div
                                className="h-1 w-full rounded-t-lg"
                                style={{ backgroundColor: sectorColor }}
                            />
                            <div className="p-8">
                                <div className="flex items-start gap-6">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110 transform duration-300"
                                        style={{ backgroundColor: sectorColor }}
                                    >
                                        <Check className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-opacity-80 transition-colors">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </SectionBackground>
    )
}
