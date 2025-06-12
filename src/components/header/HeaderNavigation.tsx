import React from "react"
import { Link } from "react-router-dom"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Car,
    Home,
    Shield,
    Smartphone,
    Zap,
    Sprout,
    Building,
    Plane,
} from "lucide-react"
import { useSectors } from "@/hooks/useSectors"
import { useTranslation } from "@/hooks/useTranslation"

const sectorIcons = {
    "assurance-auto": Car,
    "assurance-habitation": Home,
    "assurance-sante": Shield,
    "micro-assurance": Smartphone,
    banque: Sprout,
    energie: Zap,
    immobilier: Building,
    telecom: Smartphone,
    transport: Plane,
}

export const HeaderNavigation: React.FC = () => {
    const { data: sectors } = useSectors()
    const { t } = useTranslation()

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-afroGreen font-medium">
                        {t("nav.sectors")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid grid-cols-2 gap-4 p-6 w-[500px]">
                            {sectors?.slice(0, 6).map(sector => {
                                const IconComponent =
                                    sectorIcons[
                                        sector.slug as keyof typeof sectorIcons
                                    ] || Building
                                return (
                                    <NavigationMenuLink key={sector.id} asChild>
                                        <Link
                                            to={`/secteur/${sector.slug}`}
                                            className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                                                style={{
                                                    backgroundColor:
                                                        sector.color,
                                                }}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-afroGreen">
                                                    {sector.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                    {sector.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                )
                            })}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link
                        to="/about"
                        className="text-gray-700 hover:text-afroGreen font-medium px-4 py-2"
                    >
                        {t("nav.about")}
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
