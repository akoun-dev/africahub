import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, BarChart3, Brain, Settings, Code } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useTranslation } from "@/hooks/useTranslation"

export const AdvancedFeaturesDropdown: React.FC = () => {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-afroGreen"
                >
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                    {t("nav.more")}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 bg-white border shadow-lg"
            >
                {advancedFeatures.map(feature => {
                    const Icon = feature.icon
                    return (
                        <DropdownMenuItem key={feature.href} asChild>
                            <Link
                                to={feature.href}
                                className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50"
                            >
                                <Icon className="w-4 h-4" />
                                {feature.label}
                            </Link>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
