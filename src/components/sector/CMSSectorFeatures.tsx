import React from "react"
import {
    PremiumCard,
    PremiumCardContent,
    PremiumCardHeader,
    PremiumCardTitle,
} from "@/components/ui/premium-card"
import { GlassCard } from "@/components/ui/glass-card"
import { SectionBackground } from "@/components/ui/section-background"
import {
    Shield,
    Banknote,
    Smartphone,
    Zap,
    Car,
    Home,
    Sprout,
    BookOpen,
} from "lucide-react"
import { useSectorCMSContent } from "@/hooks/useSectorCMSContent"

const iconMap = {
    Shield,
    Banknote,
    Smartphone,
    Zap,
    Car,
    Home,
    Sprout,
    BookOpen,
}

interface CMSSectorFeaturesProps {
    sectorSlug: string
    sectorColor: string
}

export const CMSSectorFeatures: React.FC<CMSSectorFeaturesProps> = ({
    sectorSlug,
    sectorColor,
}) => {
    const { content, isLoading } = useSectorCMSContent(sectorSlug)

    if (
        isLoading ||
        !content ||
        !content.features ||
        content.features.length === 0
    ) {
        return null
    }

    return (
        <SectionBackground variant="default" withPattern>
            <div className="container px-4 md:px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
                        Avantages clés
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                        Découvrez pourquoi nos services font la différence
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {content.features.map((feature, index) => {
                        const IconComponent =
                            iconMap[feature.icon as keyof typeof iconMap] ||
                            Shield

                        return (
                            <GlassCard
                                key={index}
                                variant="premium"
                                size="default"
                                radius="lg"
                                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="text-center p-8">
                                    <div
                                        className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110 transform duration-300"
                                        style={{
                                            background: `linear-gradient(135deg, ${sectorColor}, ${sectorColor}dd)`,
                                            boxShadow: `0 8px 25px ${sectorColor}30`,
                                        }}
                                    >
                                        <IconComponent className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-opacity-80 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>
            </div>
        </SectionBackground>
    )
}
