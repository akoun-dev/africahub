import React from "react"
import { Link } from "react-router-dom"
import { BarChart3, Brain, Settings, Code } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useTranslation } from "@/hooks/useTranslation"

interface MobileAdvancedMenuProps {
    onClose: () => void
}

export const MobileAdvancedMenu: React.FC<MobileAdvancedMenuProps> = ({
    onClose,
}) => {
    const { user } = useAuth()
    const { isAdmin } = useAdminAuth()
    const { t } = useTranslation()

    const advancedFeatures = [
        // Recommandations IA uniquement pour les utilisateurs connectés
        ...(user
            ? [
                  {
                      href: "/recommendations",
                      label: t("nav.recommendations"),
                      icon: Brain,
                  },
              ]
            : []),
        // Administration uniquement pour les admins
        ...(isAdmin
            ? [
                  {
                      href: "/admin",
                      label: t("nav.admin"),
                      icon: Settings,
                  },
              ]
            : []),
    ]

    if (advancedFeatures.length === 0) {
        return null
    }

    return (
        <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs text-gray-500 mb-2 px-3">{t("nav.more")}</p>
            {advancedFeatures.map(feature => {
                const Icon = feature.icon
                return (
                    <Link
                        key={feature.href}
                        to={feature.href}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-600 hover:text-afroGreen hover:bg-afroGreen/5"
                    >
                        <Icon className="w-4 h-4" />
                        {feature.label}
                    </Link>
                )
            })}
        </div>
    )
}
