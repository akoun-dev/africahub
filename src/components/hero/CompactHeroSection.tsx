import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useConfigurableContent } from "@/hooks/useConfigurableContent"

export const CompactHeroSection: React.FC = () => {
    const navigate = useNavigate()
    const { getContent, loading } = useConfigurableContent()

    if (loading) {
        return (
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500"></div>
                <div className="relative container mx-auto px-4 text-center z-10">
                    <div className="max-w-5xl mx-auto animate-pulse">
                        <div className="h-6 bg-white/20 rounded-full w-48 mx-auto mb-8"></div>
                        <div className="h-16 bg-white/20 rounded-2xl w-full mb-6"></div>
                        <div className="h-6 bg-white/20 rounded-full w-3/4 mx-auto mb-12"></div>
                        <div className="flex gap-4 justify-center">
                            <div className="h-12 bg-white/20 rounded-xl w-40"></div>
                            <div className="h-12 bg-white/20 rounded-xl w-32"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
            {/* Background moderne avec gradient marine */}
            <div className="absolute inset-0 bg-gradient-to-br from-marineBlue-600 via-brandSky to-marineBlue-500"></div>

            {/* Overlay avec texture */}
            <div className="absolute inset-0 bg-gradient-to-t from-marineBlue-900/20 via-transparent to-white/10"></div>

            {/* Motifs géométriques modernes */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-16 right-16 w-32 h-32 bg-white/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-500"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/8 rounded-full blur-lg animate-pulse delay-700"></div>

            <div className="relative container mx-auto px-4 text-center z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Badge moderne */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/30 mb-8 shadow-xl">
                        <Globe className="w-5 h-5 text-marineBlue-600 mr-2" />
                        <span className="text-sm font-semibold text-marineBlue-600">
                            {getContent(
                                "platform.tagline",
                                "Votre comparateur africain de confiance"
                            )}
                        </span>
                    </div>

                    {/* Titre principal moderne */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        <span className="text-white drop-shadow-lg">
                            {getContent(
                                "hero.main_title",
                                "Comparez et trouvez la meilleure assurance en Afrique"
                            )}
                        </span>
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        {getContent(
                            "hero.subtitle",
                            "Notre plateforme intelligente vous aide à comparer les offres d'assurance adaptées à votre profil et à votre pays."
                        )}
                    </p>

                    {/* Boutons d'action modernes */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Button
                            size="lg"
                            className="bg-white text-marineBlue-600 hover:bg-white/90 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 rounded-xl"
                            onClick={() => navigate("/compare")}
                        >
                            {getContent(
                                "button.compare",
                                "Comparer maintenant"
                            )}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-marineBlue-600 px-8 py-4 text-lg font-bold transition-all rounded-xl"
                            onClick={() => navigate("/secteur/insurance")}
                        >
                            {getContent("button.quote", "Obtenir un devis")}
                        </Button>
                    </div>

                    {/* Indicateurs de confiance modernes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-base text-white">
                                    {getContent(
                                        "features.african_optimization",
                                        "Optimisé pour l'Afrique"
                                    )}
                                </div>
                                <div className="text-sm text-white/80">
                                    {getContent(
                                        "features.african_optimization_desc",
                                        "Solutions adaptées aux marchés africains"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-base text-white">
                                    {getContent(
                                        "features.smart_comparison",
                                        "Comparaison intelligente"
                                    )}
                                </div>
                                <div className="text-sm text-white/80">
                                    {getContent(
                                        "features.smart_comparison_desc",
                                        "Algorithmes avancés de matching"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 hover:bg-white/30 transition-all">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-base text-white">
                                    {getContent(
                                        "features.ai_assistant",
                                        "Assistant IA"
                                    )}
                                </div>
                                <div className="text-sm text-white/80">
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
