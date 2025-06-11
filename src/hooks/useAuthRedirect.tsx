import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/hooks/useAdminAuth"

export const useAuthRedirect = () => {
    const { user, loading: authLoading } = useAuth()
    const { isAdmin, loading: adminLoading } = useAdminAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Attendre que l'authentification et la vérification admin soient terminées
        if (authLoading || adminLoading) {
            console.log(
                "🔄 useAuthRedirect: Waiting for auth/admin check to complete"
            )
            return
        }

        console.log("🎯 useAuthRedirect: Checking redirect conditions", {
            currentPath: location.pathname,
            hasUser: !!user,
            isAdmin,
            authLoading,
            adminLoading,
        })

        // Si l'utilisateur n'est pas connecté et n'est pas sur la page d'auth
        if (!user && location.pathname !== "/auth") {
            console.log(
                "🔐 useAuthRedirect: User not authenticated, redirecting to /auth"
            )
            navigate("/auth")
            return
        }

        // Si l'utilisateur est connecté et sur la page d'auth
        if (user && location.pathname === "/auth") {
            const redirectPath = isAdmin ? "/admin" : "/dashboard"
            console.log(
                "✅ useAuthRedirect: User authenticated, redirecting to:",
                redirectPath
            )
            navigate(redirectPath)
            return
        }

        // Si l'utilisateur admin est sur le dashboard, le rediriger vers admin
        if (user && isAdmin && location.pathname === "/dashboard") {
            console.log(
                "👑 useAuthRedirect: Admin user on dashboard, redirecting to /admin"
            )
            navigate("/admin")
            return
        }
    }, [user, isAdmin, authLoading, adminLoading, location.pathname, navigate])

    return {
        isRedirecting: authLoading || adminLoading,
        shouldShowContent: !authLoading && !adminLoading,
    }
}
