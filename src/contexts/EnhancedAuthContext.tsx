import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { UserRole, CreateUserRequest } from "@/types/user"
import { UserWithProfile } from "@/integrations/supabase/user-types"

interface EnhancedAuthContextType {
    user: User | null
    session: Session | null
    profile: UserWithProfile | null
    userProfile: UserWithProfile | null // Alias pour compatibilité
    merchantProfile: UserWithProfile | null // Profil marchand si applicable
    loading: boolean
    signIn: (
        email: string,
        password: string
    ) => Promise<{ error: any; userRoles?: string[] }>
    signUp: (userData: CreateUserRequest) => Promise<{ error: any }>
    signOut: () => Promise<void>
    logout: () => Promise<void>
    updateProfile: (
        updates: Partial<UserWithProfile>
    ) => Promise<{ error: any }>
    refreshProfile: () => Promise<void>
    hasPermission: (permission: string) => boolean
    hasRole: (role: UserRole) => boolean
    canAccess: (resource: string, action: string) => boolean
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(
    undefined
)

export const useEnhancedAuth = () => {
    const context = useContext(EnhancedAuthContext)
    if (!context) {
        throw new Error(
            "useEnhancedAuth must be used within an EnhancedAuthProvider"
        )
    }
    return context
}

interface EnhancedAuthProviderProps {
    children: ReactNode
}

// Permissions par défaut pour chaque rôle
const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
    user: ["view_products", "create_reviews", "manage_favorites"],
    merchant: [
        "view_products",
        "manage_products",
        "view_analytics",
        "respond_reviews",
    ],
    manager: [
        "view_products",
        "moderate_content",
        "verify_products",
        "view_reports",
    ],
    admin: ["*"], // Tous les droits
}

export const EnhancedAuthProvider: React.FC<EnhancedAuthProviderProps> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<UserWithProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // Charger le profil utilisateur
    const loadUserProfile = async (
        userId: string
    ): Promise<UserWithProfile | null> => {
        try {
            console.log("🔍 Loading user profile for:", userId)

            const { data, error } = await supabase
                .from("user_profiles")
                .select(
                    `
          *,
          merchant_profiles (*),
          user_permissions (permission)
        `
                )
                .eq("user_id", userId)
                .single()

            if (error) {
                console.error("❌ Error loading profile:", error)
                return null
            }

            // Transformer les données pour correspondre à UserWithProfile
            const userProfile: UserWithProfile = {
                ...data,
                email: user?.email || "",
                merchant_profile: data.merchant_profiles?.[0] || undefined,
                permissions:
                    data.user_permissions?.map((p: any) => p.permission) || [],
            }

            console.log("✅ Profile loaded:", userProfile)
            return userProfile
        } catch (error) {
            console.error("💥 Unexpected error loading profile:", error)
            return null
        }
    }

    // Rafraîchir le profil
    const refreshProfile = async () => {
        if (user) {
            const userProfile = await loadUserProfile(user.id)
            setProfile(userProfile)
        }
    }

    // Vérifier les permissions
    const hasPermission = (permission: string): boolean => {
        if (!profile) return false

        // Admin a tous les droits
        if (profile.role === "admin") return true

        // Vérifier les permissions spécifiques
        const userPermissions = profile.permissions || []
        const defaultPermissions =
            DEFAULT_PERMISSIONS[profile.role as UserRole] || []

        return (
            userPermissions.includes(permission) ||
            defaultPermissions.includes(permission)
        )
    }

    // Vérifier le rôle
    const hasRole = (role: UserRole): boolean => {
        return profile?.role === role
    }

    // Vérifier l'accès à une ressource
    const canAccess = (resource: string, action: string): boolean => {
        const permission = `${action}_${resource}`
        return hasPermission(permission)
    }

    useEffect(() => {
        let mounted = true

        // Écouter les changements d'état d'authentification
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted) {
                console.log("Auth state change:", event, session?.user?.id)
                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    // Charger le profil utilisateur
                    const userProfile = await loadUserProfile(session.user.id)
                    setProfile(userProfile)
                } else {
                    setProfile(null)
                }

                setLoading(false)
            }
        })

        // Obtenir la session initiale
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (mounted) {
                console.log("Initial session:", session?.user?.id)
                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    const userProfile = await loadUserProfile(session.user.id)
                    setProfile(userProfile)
                }

                setLoading(false)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        try {
            console.log("🔐 Starting custom sign in for:", email)

            // Essayer d'abord la connexion Supabase standard
            const { data: authData, error: authError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

            if (!authError && authData.user) {
                console.log("✅ Standard sign in successful")
                return { error: null, userRoles: [] }
            }

            // Si la connexion standard échoue, essayer la fonction personnalisée
            console.log("🔄 Trying custom sign in...")

            const { data, error } = await supabase.rpc("custom_user_signin", {
                p_email: email,
                p_password: password,
            })

            if (error) {
                console.error("❌ Custom sign in error:", error)

                // Fallback direct : récupérer le profil par email
                console.log("🔄 Trying direct profile lookup...")
                try {
                    const { data: directProfile, error: directError } =
                        await supabase
                            .from("user_profiles")
                            .select("*")
                            .eq(
                                "user_id",
                                (
                                    await supabase.auth.admin.getUserByEmail(
                                        email
                                    )
                                ).data.user?.id
                            )
                            .single()

                    if (directProfile && !directError) {
                        console.log(
                            "✅ Direct profile lookup successful:",
                            directProfile
                        )

                        setUser({
                            id: directProfile.user_id,
                            email: email,
                            user_metadata: {
                                first_name: directProfile.first_name,
                                last_name: directProfile.last_name,
                            },
                            app_metadata: {},
                            aud: "authenticated",
                            created_at: directProfile.created_at,
                            updated_at: new Date().toISOString(),
                        } as any)

                        setProfile(directProfile as any)

                        return { error: null, userRoles: [directProfile.role] }
                    }
                } catch (directError) {
                    console.error("❌ Direct lookup failed:", directError)
                }

                return { error }
            }

            if (data && data.length > 0) {
                const userData = data[0]
                console.log("✅ Custom sign in successful:", userData)

                // Forcer la mise à jour du state avec les données utilisateur
                setUser({
                    id: userData.user_id,
                    email: userData.email,
                    user_metadata: {
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                    },
                    app_metadata: {},
                    aud: "authenticated",
                    created_at: userData.created_at,
                    updated_at: new Date().toISOString(),
                } as any)

                setProfile({
                    id: userData.user_id,
                    user_id: userData.user_id,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    role: userData.role as UserRole,
                    status: userData.status as UserStatus,
                    country: userData.country || "",
                    city: userData.city || "",
                    created_at: userData.created_at,
                    updated_at: new Date().toISOString(),
                } as any)

                console.log("✅ User state updated manually")
                return { error: null, userRoles: [userData.role] }
            } else {
                console.error("❌ Custom sign in failed: No user data returned")

                // Fallback : essayer de récupérer le profil directement
                console.log("🔄 Trying fallback profile retrieval...")
                try {
                    const { data: profileData, error: profileError } =
                        await supabase
                            .from("user_profiles")
                            .select(
                                `
                            *,
                            auth_users:user_id (email)
                        `
                            )
                            .eq(
                                "user_id",
                                (
                                    await supabase
                                        .from("auth.users")
                                        .select("id")
                                        .eq("email", email)
                                        .single()
                                )?.data?.id
                            )
                            .single()

                    if (profileData && !profileError) {
                        console.log(
                            "✅ Fallback profile retrieval successful:",
                            profileData
                        )

                        setUser({
                            id: profileData.user_id,
                            email: email,
                            user_metadata: {
                                first_name: profileData.first_name,
                                last_name: profileData.last_name,
                            },
                            app_metadata: {},
                            aud: "authenticated",
                            created_at: profileData.created_at,
                            updated_at: new Date().toISOString(),
                        } as any)

                        setProfile(profileData as any)

                        return { error: null, userRoles: [profileData.role] }
                    }
                } catch (fallbackError) {
                    console.error("❌ Fallback failed:", fallbackError)
                }

                return { error: new Error("Email ou mot de passe incorrect") }
            }
        } catch (error) {
            console.error("💥 Unexpected sign in error:", error)
            return { error }
        }
    }

    const signUp = async (userData: CreateUserRequest) => {
        try {
            console.log("📝 Starting custom sign up for:", userData.email)

            // UTILISER LA FONCTION PERSONNALISÉE POUR CONTOURNER L'ERREUR 500
            const businessInfo = userData.business_info
                ? {
                      business_name: userData.business_info.business_name,
                      business_sector: userData.business_info.business_sector,
                      business_type: userData.business_info.business_type,
                      business_description:
                          userData.business_info.business_description,
                      business_address: userData.business_info.business_address,
                      business_phone: userData.business_info.business_phone,
                      business_email: userData.business_info.business_email,
                  }
                : null

            const { data, error } = await supabase.rpc("custom_user_signup", {
                p_email: userData.email,
                p_password: userData.password,
                p_first_name: userData.first_name,
                p_last_name: userData.last_name,
                p_role: userData.role,
                p_business_info: businessInfo,
            })

            if (error) {
                console.error("❌ Custom sign up error:", error)
                return { error }
            }

            if (data && data.success) {
                console.log("✅ Custom sign up successful:", data)

                // Essayer de connecter automatiquement l'utilisateur
                try {
                    const { data: authData, error: authError } =
                        await supabase.auth.signInWithPassword({
                            email: userData.email,
                            password: userData.password,
                        })

                    if (authError) {
                        console.warn(
                            "⚠️ Auto sign in failed, but signup was successful:",
                            authError
                        )
                        // L'inscription a réussi même si la connexion automatique échoue
                        return { error: null }
                    }

                    console.log("✅ Auto sign in successful after signup")
                    return { error: null }
                } catch (autoSignInError) {
                    console.warn(
                        "⚠️ Auto sign in error, but signup was successful:",
                        autoSignInError
                    )
                    return { error: null }
                }
            } else {
                const errorMessage =
                    data?.error || "Erreur inconnue lors de l'inscription"
                console.error("❌ Custom sign up failed:", errorMessage)
                return { error: new Error(errorMessage) }
            }
        } catch (error) {
            console.error("💥 Unexpected custom sign up error:", error)
            return { error }
        }
    }

    const updateProfile = async (updates: Partial<UserWithProfile>) => {
        if (!user || !profile) {
            return { error: new Error("No user logged in") }
        }

        try {
            const { error } = await supabase
                .from("user_profiles")
                .update(updates)
                .eq("user_id", user.id)

            if (error) {
                console.error("❌ Profile update error:", error)
                return { error }
            }

            // Rafraîchir le profil
            await refreshProfile()

            console.log("✅ Profile updated successfully")
            return { error: null }
        } catch (error) {
            console.error("💥 Unexpected profile update error:", error)
            return { error }
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setProfile(null)
    }

    const logout = signOut

    const value = {
        user,
        session,
        profile,
        userProfile: profile, // Alias pour compatibilité
        merchantProfile: profile?.role === UserRole.MERCHANT ? profile : null, // Profil marchand si applicable
        loading,
        signIn,
        signUp,
        signOut,
        logout,
        updateProfile,
        refreshProfile,
        hasPermission,
        hasRole,
        canAccess,
    }

    return (
        <EnhancedAuthContext.Provider value={value}>
            {children}
        </EnhancedAuthContext.Provider>
    )
}
