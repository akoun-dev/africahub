import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCountry } from "@/contexts/CountryContext"
import { useAuth } from "@/contexts/AuthContext"
import { useTranslation } from "@/hooks/useTranslation"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"

const ModernHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { country } = useCountry()
    const location = useLocation()
    const { user } = useAuth()
    const { t } = useTranslation()

    const isActive = (path: string) => location.pathname === path

    const navigationItems = [
        { href: "/", label: t("nav.home", "Accueil") },
        { href: "/compare", label: t("nav.compare", "Comparer") },
        {
            href: "/recommendations",
            label: t("nav.recommendations", "Recommandations IA"),
        },
        { href: "/api", label: t("nav.api", "API") },
        ...(user
            ? [
                  {
                      href: "/dashboard",
                      label: t("nav.dashboard", "Tableau de bord"),
                  },
              ]
            : []),
        ...(user ? [{ href: "/admin", label: t("nav.admin", "Admin") }] : []),
    ]

    return (
        <header className="bg-marineBlue-600 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xl font-semibold text-white hover:text-marineBlue-100 transition-colors"
                >
                    {t("platform.name", "AfricaHub")}
                </Link>

                {/* Mobile Menu Button */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-marineBlue-100 hover:bg-marineBlue-700"
                        >
                            <Menu className="h-5 w-5 md:hidden" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:w-64">
                        <SheetHeader>
                            <SheetTitle>{t("nav.menu", "Menu")}</SheetTitle>
                            <SheetDescription>
                                {t(
                                    "nav.explore_sections",
                                    "Explorez les différentes sections du site."
                                )}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-4">
                            {navigationItems.map(item => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`block py-2 px-4 text-gray-700 hover:bg-gray-100 ${
                                        isActive(item.href)
                                            ? "font-semibold"
                                            : ""
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    {navigationItems.map(item => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`text-white hover:text-marineBlue-100 transition-colors ${
                                isActive(item.href)
                                    ? "font-semibold text-marineBlue-100"
                                    : ""
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Country Selector (Placeholder) */}
                <div className="hidden md:block">
                    {country && (
                        <span className="text-sm text-marineBlue-100">
                            {country.name} {country.flag}
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}

export default ModernHeader
