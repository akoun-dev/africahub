import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Globe, Mail, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

const Footer = () => {
    const { t } = useTranslation()

    return (
        <footer className="relative bg-gradient-to-br from-marineBlue-600 via-marineBlue-700 to-marineBlue-800 overflow-hidden">
            {/* Background avec motifs modernes subtils */}
            <div className="absolute inset-0 bg-[url('/patterns/geometric-pattern.svg')] opacity-5"></div>

            {/* Ligne décorative supérieure */}
            <div className="w-full h-1 bg-gradient-to-r from-marineBlue-400 via-brandSky to-marineBlue-500"></div>

            {/* Éléments décoratifs flottants */}
            <div className="absolute -left-16 top-1/3 h-32 w-32 rounded-full bg-marineBlue-400/20 blur-3xl"></div>
            <div className="absolute -right-16 bottom-1/3 h-32 w-32 rounded-full bg-brandSky/20 blur-3xl"></div>

            <div className="container px-4 py-8 md:px-6 md:py-10 relative z-10">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Section principale - Plateforme */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <Globe className="w-6 h-6 text-white" />
                            <h3 className="text-xl font-bold text-white">
                                {t("footer.platform.name", "AfricaHub")}
                            </h3>
                        </div>
                        <p className="text-marineBlue-100 text-sm leading-relaxed">
                            {t(
                                "footer.platform.description",
                                "Comparez des milliers de services à travers plusieurs secteurs pour trouver celui qui répond le mieux à vos besoins et à votre budget sur tout le continent africain."
                            )}
                        </p>
                    </div>

                    {/* Section secteurs */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-bold text-white">
                            {t("footer.sectors.title", "Secteurs")}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                to="/secteur/insurance"
                                className="text-marineBlue-100 hover:text-white transition-colors text-sm"
                            >
                                {t("footer.sectors.insurance", "Assurance")}
                            </Link>
                            <Link
                                to="/secteur/banking"
                                className="text-marineBlue-100 hover:text-white transition-colors text-sm"
                            >
                                {t("footer.sectors.banking", "Banque")}
                            </Link>
                            <Link
                                to="/secteur/telecom"
                                className="text-marineBlue-100 hover:text-white transition-colors text-sm"
                            >
                                {t(
                                    "footer.sectors.telecom",
                                    "Télécommunications"
                                )}
                            </Link>
                            <Link
                                to="/secteur/energy"
                                className="text-marineBlue-100 hover:text-white transition-colors text-sm"
                            >
                                {t("footer.sectors.energy", "Énergie")}
                            </Link>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Link
                                to="/a-propos"
                                className="block text-marineBlue-100 hover:text-white transition-colors text-sm"
                            >
                                {t(
                                    "footer.about.who_we_are",
                                    "Qui sommes-nous"
                                )}
                            </Link>
                            <Link
                                to="/contact"
                                className="block text-marineBlue-100 hover:text-white transition-colors text-sm"
                            >
                                {t("footer.about.contact", "Contactez-nous")}
                            </Link>
                        </div>
                    </div>

                    {/* Section newsletter */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-bold text-white">
                                {t("footer.newsletter.title", "Newsletter")}
                            </h3>
                        </div>
                        <p className="text-marineBlue-100 text-sm leading-relaxed">
                            {t(
                                "footer.newsletter.description",
                                "Inscrivez-vous pour recevoir les dernières offres et conseils adaptés au marché africain."
                            )}
                        </p>
                        <form className="flex flex-col space-y-2">
                            <Input
                                type="email"
                                placeholder={t(
                                    "footer.newsletter.placeholder",
                                    "Votre email"
                                )}
                                className="bg-white/90 backdrop-blur-sm border-marineBlue-300/30 focus:border-white text-sm"
                            />
                            <Button className="bg-white text-marineBlue-600 hover:bg-marineBlue-50 w-full font-semibold">
                                {t("footer.newsletter.subscribe", "S'inscrire")}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Section copyright et liens légaux */}
                <div className="mt-8 pt-6 border-t border-marineBlue-400/30">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-marineBlue-200 text-sm">
                            {t(
                                "footer.copyright",
                                "© 2025 AfricaHub. Tous droits réservés."
                            )}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <Link
                                to="/confidentialite"
                                className="text-marineBlue-200 hover:text-white transition-colors"
                            >
                                {t(
                                    "footer.legal.privacy",
                                    "Politique de confidentialité"
                                )}
                            </Link>
                            <Link
                                to="/conditions-utilisation"
                                className="text-marineBlue-200 hover:text-white transition-colors"
                            >
                                {t(
                                    "footer.legal.terms",
                                    "Conditions d'utilisation"
                                )}
                            </Link>
                            <Link
                                to="/mentions-legales"
                                className="text-marineBlue-200 hover:text-white transition-colors"
                            >
                                {t("footer.legal.mentions", "Mentions légales")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
