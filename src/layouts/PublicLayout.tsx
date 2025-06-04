import React from "react"
import { UnifiedHeader } from "@/components/UnifiedHeader"
import { UnifiedFooter } from "@/components/UnifiedFooter"
import { QuickNavigation } from "@/components/navigation/QuickNavigation"
import ModernMultiSectorAssistant from "@/components/ModernMultiSectorAssistant"
import { Breadcrumb } from "@/components/navigation/Breadcrumb"
import { useLocation } from "react-router-dom"
import { useTranslation } from "@/hooks/useTranslation"

interface PublicLayoutProps {
    children: React.ReactNode
    showBreadcrumbs?: boolean
    showQuickNav?: boolean
    showAssistant?: boolean
    title?: string
    description?: string
    className?: string
}

/**
 * Layout principal pour les pages publiques
 * Inclut header unifié, footer, breadcrumbs automatiques et navigation rapide
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({
    children,
    showBreadcrumbs = false, // 🚫 Breadcrumbs désactivés par défaut pour une interface plus épurée
    showQuickNav = true,
    showAssistant = true,
    title,
    description,
    className = "",
}) => {
    const location = useLocation()
    const { t } = useTranslation()

    // Génération automatique des breadcrumbs basée sur l'URL
    const generateBreadcrumbs = () => {
        const pathSegments = location.pathname.split("/").filter(Boolean)
        const breadcrumbs = [{ label: t("nav.home", "Accueil"), href: "/" }]

        let currentPath = ""
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`

            // Mapping des segments vers des labels lisibles
            const segmentLabels: Record<string, string> = {
                secteur: t("nav.sectors", "Secteurs"),
                compare: t("nav.compare", "Comparer"),
                search: t("nav.search", "Recherche"),
                contact: t("nav.contact", "Contact"),
                faq: t("nav.faq", "FAQ"),
                about: t("nav.about", "À propos"),
                "mentions-legales": t("legal.mentions", "Mentions légales"),
                confidentialite: t("legal.privacy", "Confidentialité"),
                "conditions-utilisation": t(
                    "legal.terms",
                    "Conditions d'utilisation"
                ),
                "assurance-auto": t("sector.auto_insurance", "Assurance Auto"),
                "assurance-habitation": t(
                    "sector.home_insurance",
                    "Assurance Habitation"
                ),
                "assurance-sante": t(
                    "sector.health_insurance",
                    "Assurance Santé"
                ),
                "micro-assurance": t(
                    "sector.micro_insurance",
                    "Micro-assurance"
                ),
                details: t("nav.details", "Détails"),
                quote: t("nav.quote", "Devis"),
            }

            const label =
                segmentLabels[segment] ||
                segment.charAt(0).toUpperCase() + segment.slice(1)

            // Dernier segment = page actuelle (pas de lien)
            if (index === pathSegments.length - 1) {
                breadcrumbs.push({ label })
            } else {
                breadcrumbs.push({ label, href: currentPath })
            }
        })

        return breadcrumbs
    }

    return (
        <div className={`min-h-screen flex flex-col bg-white ${className}`}>
            {/* Header unifié */}
            <UnifiedHeader />

            {/* Contenu principal */}
            <main className="flex-1">
                {/* Breadcrumbs automatiques */}
                {showBreadcrumbs && location.pathname !== "/" && (
                    <div className="bg-gray-50 border-b border-gray-200">
                        <div className="container mx-auto px-4 py-3">
                            <Breadcrumb items={generateBreadcrumbs()} />
                        </div>
                    </div>
                )}

                {/* Titre et description de page optionnels */}
                {(title || description) && (
                    <div className="bg-gradient-to-b from-gray-50 to-white py-8">
                        <div className="container mx-auto px-4 text-center">
                            {title && (
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Contenu de la page */}
                {children}
            </main>

            {/* Footer unifié */}
            <UnifiedFooter />

            {/* Assistant virtuel multi-sectoriel */}
            {showAssistant && <ModernMultiSectorAssistant />}

            {/* Navigation rapide */}
            {showQuickNav && <QuickNavigation />}
        </div>
    )
}
