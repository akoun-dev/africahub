import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useConfigurableContent } from "@/hooks/useConfigurableContent"

export const ModernHeroSection: React.FC = () => {
    const navigate = useNavigate()
    const { getContent, loading } = useConfigurableContent()

    if (loading) {
        return (
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Loading state avec design moderne */}
                <div className="absolute inset-0 bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500"></div>
                <div className="relative container mx-auto px-4 text-center z-10">
                    <div className="max-w-4xl mx-auto animate-pulse">
                        <div className="h-6 bg-white/20 rounded-full w-56 mx-auto mb-8"></div>
                        <div className="h-20 bg-white/20 rounded-2xl w-full mb-8"></div>
                        <div className="h-6 bg-white/20 rounded-full w-3/4 mx-auto mb-12"></div>
                        <div className="flex gap-4 justify-center">
                            <div className="h-14 bg-white/20 rounded-xl w-48"></div>
                            <div className="h-14 bg-white/20 rounded-xl w-40"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background moderne épuré avec gradient marine */}
            <div className="absolute inset-0 bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500"></div>

            {/* Overlay subtil pour la profondeur */}
            <div className="absolute inset-0 bg-gradient-to-t from-marineBlue-900/10 via-transparent to-white/5"></div>

            {/* Éléments décoratifs minimalistes */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse duration-[4000ms]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-2xl animate-pulse duration-[6000ms] delay-1000"></div>
            </div>

            <div className="relative container mx-auto px-4 text-center z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Badge moderne épuré */}
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-12 shadow-xl hover:bg-white/20 transition-all duration-300">
                        <Sparkles className="w-5 h-5 text-white mr-3" />
                        <span className="text-sm font-semibold text-white tracking-wide">
                            {getContent(
                                "platform.tagline",
                                "Votre comparateur africain de confiance"
                            )}
                        </span>
                    </div>

                    {/* Titre principal moderne avec hiérarchie claire */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
                        <span className="text-white drop-shadow-lg">
                            {getContent(
                                "hero.main_title",
                                "Comparez et trouvez la meilleure assurance en Afrique"
                            )}
                        </span>
                    </h1>

                    {/* Sous-titre épuré et lisible */}
                    <p className="text-lg md:text-xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
                        {getContent(
                            "hero.subtitle",
                            "Notre plateforme intelligente vous aide à comparer les offres d'assurance adaptées à votre profil et à votre pays."
                        )}
                    </p>

                    {/* Boutons d'action modernes et épurés */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                        <Button
                            size="lg"
                            className="bg-white text-marineBlue-600 hover:bg-white/95 px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-xl border-0"
                            onClick={() => navigate("/compare")}
                        >
                            {getContent(
                                "button.compare",
                                "Comparer maintenant"
                            )}
                            <ArrowRight className="ml-3 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-marineBlue-600 px-10 py-4 text-lg font-bold transition-all duration-300 rounded-xl hover:border-white"
                            onClick={() => navigate("/secteur/insurance")}
                        >
                            {getContent("button.quote", "Obtenir un devis")}
                        </Button>
                    </div>

                    {/* Indicateurs de confiance modernes avec glassmorphism */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="group flex items-center space-x-4 bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white text-base mb-1">
                                    {getContent(
                                        "features.african_optimization",
                                        "Optimisé pour l'Afrique"
                                    )}
                                </div>
                                <div className="text-sm text-white/80 leading-relaxed">
                                    {getContent(
                                        "features.african_optimization_desc",
                                        "Solutions adaptées aux marchés africains"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="group flex items-center space-x-4 bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white text-base mb-1">
                                    {getContent(
                                        "features.smart_comparison",
                                        "Comparaison intelligente"
                                    )}
                                </div>
                                <div className="text-sm text-white/80 leading-relaxed">
                                    {getContent(
                                        "features.smart_comparison_desc",
                                        "Algorithmes avancés de matching"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="group flex items-center space-x-4 bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white text-base mb-1">
                                    {getContent(
                                        "features.ai_assistant",
                                        "Assistant IA"
                                    )}
                                </div>
                                <div className="text-sm text-white/80 leading-relaxed">
                                    {getContent(
                                        "features.ai_assistant_desc",
                                        "Conseils personnalisés par IA"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
