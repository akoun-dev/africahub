import React from "react"
import { Link } from "react-router-dom"
import {
    ArrowRight,
    Globe,
    Sparkles,
    Search,
    TrendingUp,
    Shield,
    Star,
    Users,
    CheckCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AfricanGradientButton } from "@/components/ui/african-gradient-button"

export const UnifiedHeroSection: React.FC = () => {
    const { getContent, loading } = useConfigurableContent()

    // Affichage de chargement simplifié
    if (loading) {
        return (
            <SectionBackground variant="solid" withDecorations withPattern>
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
                            <div className="h-16 bg-gray-200 rounded w-full mb-8"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-12"></div>
                        </div>
                    </div>
                </div>
            </SectionBackground>
        )
    }

    return (
        <SectionBackground
            variant="african-pattern"
            withDecorations
            withPattern
        >
            <div className="container mx-auto px-4 py-20 md:py-28">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Logo et marque avec style épuré mais visible */}
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-blue-500 to-indigo-600 p-3 shadow-xl border border-white/20">
                            <Globe className="w-full h-full text-white drop-shadow-sm" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                            {getContent("platform.name")}
                        </h1>
                    </div>

                    {/* Titre principal avec meilleur contraste */}
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 leading-[1.1] tracking-tight drop-shadow-sm">
                        {getContent("hero.main_title")}
                    </h2>

                    {/* Sous-titre avec meilleur contraste */}
                    <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                        {getContent("hero.subtitle")}
                    </p>

                    {/* Boutons CTA avec ombres plus prononcées */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to="/compare">
                            <AfricanGradientButton
                                size="lg"
                                className="w-full sm:w-auto shadow-xl hover:shadow-2xl"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                {getContent("hero.cta_primary")}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </AfricanGradientButton>
                        </Link>

                        <Link to="/recommendations">
                            <AfricanGradientButton
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto shadow-lg hover:shadow-xl border-2"
                            >
                                {getContent("hero.cta_secondary")}
                            </AfricanGradientButton>
                        </Link>
                    </div>

                    {/* Cartes de statistiques avec style solide et africain */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <GlassCard
                            variant="african-card"
                            size="lg"
                            radius="xl"
                            withPattern={true}
                            className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-amber-200/60"
                        >
                            <div className="text-4xl font-bold text-blue-600 mb-3 drop-shadow-sm">
                                {getContent("hero.stat_companies_value")}
                            </div>
                            <p className="text-gray-700 font-semibold">
                                {getContent("hero.stat_companies_label")}
                            </p>
                        </GlassCard>

                        <GlassCard
                            variant="solid-blue"
                            size="lg"
                            radius="xl"
                            withPattern={true}
                            className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-200/60"
                        >
                            <div className="text-4xl font-bold text-amber-600 mb-3 drop-shadow-sm">
                                {getContent("hero.stat_countries_value")}
                            </div>
                            <p className="text-gray-700 font-semibold">
                                {getContent("hero.stat_countries_label")}
                            </p>
                        </GlassCard>

                        <GlassCard
                            variant="solid-warm"
                            size="lg"
                            radius="xl"
                            withPattern={true}
                            className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-amber-200/70"
                        >
                            <div className="text-4xl font-bold text-indigo-600 mb-3 drop-shadow-sm">
                                {getContent("hero.stat_users_value")}
                            </div>
                            <p className="text-gray-700 font-semibold">
                                {getContent("hero.stat_users_label")}
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </SectionBackground>
    )
}
