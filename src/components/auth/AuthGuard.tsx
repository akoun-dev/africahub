/**
 * Composant de protection pour éviter les erreurs lors de la déconnexion
 * Affiche un loader pendant la déconnexion et redirige si nécessaire
 */

import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AuthGuardProps {
    children: React.ReactNode
    redirectTo?: string
    showLoader?: boolean
    fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    redirectTo = "/auth?mode=login",
    showLoader = true,
    fallback = null,
}) => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    // Afficher le loader pendant le chargement initial
    if (loading && showLoader) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Vérification de l'authentification..." />
            </div>
        )
    }

    // Si pas d'utilisateur et pas en cours de chargement, rediriger
    if (!user && !loading) {
        console.log("🔒 AuthGuard: Utilisateur non connecté, redirection vers:", redirectTo)
        navigate(redirectTo, { replace: true })
        
        // Afficher le fallback ou rien pendant la redirection
        return fallback ? <>{fallback}</> : null
    }

    // Si utilisateur connecté, afficher le contenu
    if (user) {
        return <>{children}</>
    }

    // Cas par défaut : afficher le fallback ou rien
    return fallback ? <>{fallback}</> : null
}

/**
 * Hook pour vérifier l'état d'authentification de manière sécurisée
 */
export const useAuthGuard = () => {
    const { user, loading } = useAuth()
    
    return {
        isAuthenticated: !!user,
        isLoading: loading,
        user: user,
        // Accès sécurisé aux propriétés de l'utilisateur
        userEmail: user?.email || null,
        userId: user?.id || null,
        userMetadata: user?.user_metadata || null,
    }
}

/**
 * Composant pour afficher du contenu uniquement si l'utilisateur est connecté
 */
export const AuthenticatedOnly: React.FC<{
    children: React.ReactNode
    fallback?: React.ReactNode
}> = ({ children, fallback = null }) => {
    const { isAuthenticated, isLoading } = useAuthGuard()

    if (isLoading) {
        return <LoadingSpinner size="sm" />
    }

    return isAuthenticated ? <>{children}</> : <>{fallback}</>
}

/**
 * Composant pour afficher du contenu uniquement si l'utilisateur n'est PAS connecté
 */
export const UnauthenticatedOnly: React.FC<{
    children: React.ReactNode
    fallback?: React.ReactNode
}> = ({ children, fallback = null }) => {
    const { isAuthenticated, isLoading } = useAuthGuard()

    if (isLoading) {
        return <LoadingSpinner size="sm" />
    }

    return !isAuthenticated ? <>{children}</> : <>{fallback}</>
}

export default AuthGuard
