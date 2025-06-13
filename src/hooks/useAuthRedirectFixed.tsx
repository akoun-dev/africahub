/**
 * Hook pour gérer la redirection automatique après authentification
 * Corrige les problèmes de boucle infinie et de redirection
 */

import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export const useAuthRedirectFixed = () => {
    const { user, loading, profile } = useAuth()
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

            // Récupérer le rôle depuis le profil en priorité, sinon depuis les métadonnées
            const profileRole = profile?.role
            const metadataRole = user.user_metadata?.role
            const userRole = profileRole || metadataRole || "user"

            console.log("🎭 Sources de rôle:", {
                profileRole,
                metadataRole,
                finalRole: userRole,
                hasProfile: !!profile,
            })

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

        // Vérifier si l'utilisateur connecté est sur la mauvaise page selon son rôle
        if (
            user &&
            profile &&
            location.pathname !== "/auth" &&
            !hasRedirected.current
        ) {
            const profileRole = profile.role
            const currentPath = location.pathname

            console.log("🔍 Vérification rôle/page:", {
                profileRole,
                currentPath,
                shouldRedirect: false,
            })

            let expectedPath = "/user/dashboard"
            switch (profileRole) {
                case "admin":
                    expectedPath = "/admin/dashboard"
                    break
                case "manager":
                    expectedPath = "/manager/dashboard"
                    break
                case "merchant":
                    expectedPath = "/merchant/dashboard"
                    break
                case "user":
                default:
                    expectedPath = "/user/dashboard"
                    break
            }

            // Si l'utilisateur est sur une page dashboard qui ne correspond pas à son rôle
            const isOnWrongDashboard =
                (currentPath.includes("/user/dashboard") &&
                    profileRole !== "user") ||
                (currentPath.includes("/merchant/dashboard") &&
                    profileRole !== "merchant") ||
                (currentPath.includes("/admin/dashboard") &&
                    !["admin", "manager"].includes(profileRole))

            if (isOnWrongDashboard) {
                console.log(
                    `🔄 Redirection nécessaire: ${profileRole} sur ${currentPath} → ${expectedPath}`
                )
                hasRedirected.current = true
                navigate(expectedPath, { replace: true })
                return
            }
        }
    }, [user, loading, location.pathname, navigate, profile])

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
