/**
 * Hook pour gérer la redirection automatique après authentification
 * Corrige les problèmes de boucle infinie et de redirection
 */

import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export const useAuthRedirectFixed = () => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const hasRedirected = useRef(false)

    useEffect(() => {
        // Reset le flag de redirection si on change de page
        if (location.pathname !== "/auth") {
            hasRedirected.current = false
        }

        // Ne rien faire si on est encore en train de charger
        if (loading) {
            console.log("🔄 useAuthRedirectFixed: Still loading, waiting...")
            return
        }

        // Si pas d'utilisateur connecté et pas sur la page d'auth
        if (!user && location.pathname !== "/auth") {
            console.log(
                "🔐 useAuthRedirectFixed: No user, redirecting to /auth"
            )
            navigate("/auth")
            return
        }

        // Si utilisateur connecté et sur la page d'auth, rediriger UNE SEULE FOIS
        if (user && location.pathname === "/auth" && !hasRedirected.current) {
            console.log(
                "✅ useAuthRedirectFixed: User authenticated, redirecting based on role..."
            )

            // Marquer qu'on a tenté une redirection
            hasRedirected.current = true

            // Récupérer le rôle depuis les métadonnées utilisateur
            const userRole = user.user_metadata?.role || "user"
            console.log("🎭 Rôle utilisateur détecté:", userRole)

            // Rediriger selon le rôle
            let redirectPath = "/user/dashboard" // Par défaut

            switch (userRole) {
                case "admin":
                    redirectPath = "/admin/dashboard"
                    break
                case "manager":
                    redirectPath = "/manager/dashboard"
                    break
                case "merchant":
                    redirectPath = "/merchant/dashboard"
                    break
                case "user":
                default:
                    redirectPath = "/user/dashboard"
                    break
            }

            console.log(
                `🎯 useAuthRedirectFixed: Redirecting ${userRole} to ${redirectPath}`
            )
            navigate(redirectPath, { replace: true })
            return
        }
    }, [user, loading, location.pathname, navigate])

    return {
        isRedirecting: loading || (user && location.pathname === "/auth"),
        shouldShowContent: !loading && !(user && location.pathname === "/auth"),
    }
}

/**
 * Hook simplifié pour les pages qui nécessitent une authentification
 */
export const useRequireAuth = () => {
    const { user, profile, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!loading && !user) {
            console.log(
                "🔐 useRequireAuth: Authentication required, redirecting to /auth"
            )
            navigate("/auth", {
                state: { from: location.pathname },
                replace: true,
            })
        }
    }, [user, loading, navigate, location.pathname])

    return {
        isAuthenticated: !!user,
        hasProfile: !!profile,
        loading,
        user,
        profile,
    }
}
