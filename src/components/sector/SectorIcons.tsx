import {
    Shield,
    Banknote,
    Smartphone,
    Zap,
    Car,
    Home,
    Heart,
    Building,
    Truck,
    GraduationCap,
    ShoppingCart,
    Sun,
    Wifi,
    Video,
    Pill,
    Building2,
} from "lucide-react"

export const iconMap = {
    Shield,
    Banknote,
    Smartphone,
    Zap,
    Car,
    Home,
    Heart,
    Building,
    Truck,
    GraduationCap,
    ShoppingCart,
    Sun,
    Wifi,
    Video,
    Pill,
    Building2,
}

export const getSectorIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Shield
}
