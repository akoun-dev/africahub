import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
    Home,
    BarChart3,
    Brain,
    Code,
    Settings,
    User,
    Shield,
    Building,
    Car,
    Smartphone,
    Zap,
    Plane,
    Sprout,
    Heart,
    Clock,
    Bell,
    MessageSquare,
    Package,
    Star, // Ajouté pour les avis clients
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useUserRoles } from "@/hooks/useUserRoles"
import { useTranslation } from "@/hooks/useTranslation"

export interface NavigationItem {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    description?: string
    requiresAuth?: boolean
    requiresAdmin?: boolean
    requiresDeveloper?: boolean
    children?: NavigationItem[]
}

export const useNavigationStructure = () => {
    const { user } = useAuth()
    const { adminUser, isAdmin } = useAdminAuth()
    const { hasRole, isDeveloper } = useUserRoles()
    const { t } = useTranslation()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    // Navigation principale - accessible à tous
    const mainNavigation: NavigationItem[] = [
        {
            label: t("nav.home"),
            href: "/",
            icon: Home,
            description: "Accueil de la plateforme",
        },
        {
            label: t("nav.compare"),
            href: "/compare",
            icon: BarChart3,
            description: "Comparer les services et produits",
        },
        {
            label: t("nav.products"),
            href: "/produits",
            icon: Package,
            description: "Tous les produits et services disponibles",
        },
        {
            label: t("nav.recommendations", "Recommandations IA"),
            href: "/recommendations",
            icon: Brain,
            description: "Suggestions IA personnalisées",
        },
        {
            label: t("nav.alerts", "Alertes prix"),
            href: "/alerts",
            icon: Bell,
            description: "Alertes prix personnalisées",
        },
        {
            label: t("nav.favorites_public", "Favoris publics"),
            href: "/favorites-public",
            icon: Heart,
            description: "Favoris de la communauté",
        },
        {
            label: t("nav.reviews", "Avis clients"),
            href: "/reviews",
            icon: Star,
            description: "Avis clients agrégés",
        },
        {
            label: t("nav.marketplace", "Marketplace"),
            href: "/marketplace",
            icon: Package,
            description: "Achat direct marketplace",
        },
        {
            label: t("nav.business", "Entreprises"),
            href: "/business",
            icon: Building,
            description: "Espace entreprises/partenaires",
        },
        {
            label: t("nav.advertising", "Publicité"),
            href: "/advertising",
            icon: Zap,
            description: "Solutions publicitaires",
        },
        {
            label: t("nav.pricing", "Tarification"),
            href: "/pricing",
            icon: Settings,
            description: "Tarification et offres premium",
        },
        {
            label: t("nav.api", "API publique"),
            href: "/public-api",
            icon: Code,
            description: "Documentation API publique",
        },
    ]

    // Navigation secteurs - accessible à tous
    const sectorNavigation: NavigationItem[] = [
        {
            label: t("sector.insurance") + " Auto",
            href: "/secteur/assurance-auto",
            icon: Car,
            description: "Assurances véhicules et mobilité",
        },
        {
            label: t("sector.insurance") + " Habitation",
            href: "/secteur/assurance-habitation",
            icon: Building,
            description: "Protection du logement",
        },
        {
            label: t("sector.insurance") + " Santé",
            href: "/secteur/assurance-sante",
            icon: Shield,
            description: "Couverture médicale et santé",
        },
        {
            label: "Micro-assurance",
            href: "/secteur/micro-assurance",
            icon: Smartphone,
            description: "Solutions d'assurance accessibles",
        },
        {
            label: t("sector.banking"),
            href: "/secteur/banque",
            icon: Sprout,
            description: "Produits et services financiers",
        },
        {
            label: t("sector.energy"),
            href: "/secteur/energie",
            icon: Zap,
            description: "Solutions énergétiques",
        },
        {
            label: t("sector.transport"),
            href: "/secteur/transport",
            icon: Plane,
            description: "Services de transport et logistique",
        },
    ]

    // Navigation utilisateur - pour les utilisateurs connectés
    const userNavigation: NavigationItem[] = [
        ...(user
            ? [
                  {
                      label: t("nav.dashboard"),
                      href: "/dashboard",
                      icon: BarChart3,
                      description: "Tableau de bord personnel",
                      requiresAuth: true,
                  },
                  {
                      label: t("nav.my_reviews"),
                      href: "/my-reviews",
                      icon: MessageSquare,
                      description: "Gérer mes avis et commentaires",
                      requiresAuth: true,
                  },
                  {
                      label: t("nav.favorites"),
                      href: "/favorites",
                      icon: Heart,
                      description: "Vos produits favoris",
                      requiresAuth: true,
                  },
                  {
                      label: t("nav.history"),
                      href: "/history",
                      icon: Clock,
                      description: "Historique des recherches",
                      requiresAuth: true,
                  },
                  {
                      label: t("nav.notifications"),
                      href: "/notifications",
                      icon: Bell,
                      description: "Centre de notifications",
                      requiresAuth: true,
                  },
                  {
                      label: t("nav.profile"),
                      href: "/profile",
                      icon: User,
                      description: "Gérer votre profil",
                      requiresAuth: true,
                  },
              ]
            : []),
    ]

    // Navigation admin/développeur - simplifiée
    const adminNavigation: NavigationItem[] = [
        ...(isAdmin
            ? [
                  {
                      label: t("nav.admin"),
                      href: "/admin",
                      icon: Settings,
                      description: "Administration de la plateforme",
                      requiresAdmin: true,
                  },
              ]
            : []),
        ...(isDeveloper || isAdmin
            ? [
                  {
                      label: t("nav.api"),
                      href: "/api",
                      icon: Code,
                      description: "Gestion des APIs et intégrations",
                      requiresDeveloper: true,
                  },
              ]
            : []),
    ]

    // Navigation auth - pour les non-connectés
    const authNavigation: NavigationItem[] = user
        ? []
        : [
              {
                  label: t("auth.login"),
                  href: "/auth?mode=login",
                  description: "Se connecter à votre compte",
              },
              {
                  label: t("auth.signup"),
                  href: "/auth?mode=signup",
                  description: "Créer un nouveau compte",
              },
          ]

    const filterNavigationByPermissions = (
        items: NavigationItem[]
    ): NavigationItem[] => {
        return items.filter(item => {
            if (item.requiresAuth && !user) return false
            if (item.requiresAdmin && !isAdmin) return false
            if (item.requiresDeveloper && !isDeveloper && !isAdmin) return false
            return true
        })
    }

    return {
        mainNavigation: filterNavigationByPermissions(mainNavigation),
        sectorNavigation,
        userNavigation: filterNavigationByPermissions(userNavigation),
        adminNavigation: filterNavigationByPermissions(adminNavigation),
        authNavigation,
        isActive,
    }
}
