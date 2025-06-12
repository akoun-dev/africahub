import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { CreateUserRequest } from "@/types/user"
import { UserRole } from "@/integrations/supabase/helpers"

// Type pour les fonctions RPC disponibles
type SupabaseRPCFunctions =
    | "get_user_roles"
    | "update_current_user_profile"
    | "has_permission"
    | "has_role"
import {
    UserWithProfile,
    hasPermission,
    hasRole,
    canAccess,
} from "@/integrations/supabase/helpers"
import { useNavigate, useLocation } from "react-router-dom"

// Interface étendue pour le profil utilisateur
interface ExtendedUserProfile {
    id: string
    user_id: string
    email: string
    first_name: string
    last_name: string
    avatar_url: string
    phone: string
    country: string
    city: string
    role: UserRole
    status: "active" | "inactive" | "suspended"
    preferences: Record<string, unknown>
    created_at: string
    updated_at: string
    last_login: string
}

interface AuthContextType {
    user: User | null
    session: Session | null
    profile: UserWithProfile | null
    userProfile: UserWithProfile | null // Alias pour compatibilité
    loading: boolean
    signIn: (
        email: string,
        password: string
    ) => Promise<{ error: Error | null; userRoles?: string[] }>
    signUp: (userData: CreateUserRequest) => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    logout: () => Promise<void>
    updateProfile: (
        updates: Partial<UserWithProfile>
    ) => Promise<{ error: Error | null }>
    refreshProfile: () => Promise<void>
    hasPermission: (permission: string) => boolean
    hasRole: (role: string) => boolean
    canAccess: (resource: string, action: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

// Fonction de secours pour identifier les admins connus
const isKnownAdmin = (email: string): boolean => {
    const knownAdmins = [
        "admin@mobisoft.ci",
        "admin@africahub.com",
        "superadmin@africahub.com",
    ]
    return knownAdmins.includes(email.toLowerCase())
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<UserWithProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // Charger le profil utilisateur via la fonction sécurisée
    const loadUserProfile = async (
        userId: string
    ): Promise<UserWithProfile | null> => {
        try {
            console.log("🔍 Loading user profile for:", userId)

            // Utiliser une requête directe avec gestion d'erreur améliorée
            let { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle() // Utiliser maybeSingle() au lieu de single() pour éviter les erreurs si pas de résultat

            console.log("📋 Profile data from function:", {
                profileData,
                profileError,
            })

            // Si aucun profil trouvé, essayer de le créer avec la fonction sécurisée
            if (profileError || !profileData) {
                console.log("🔧 Aucun profil trouvé, tentative de création...")
                try {
                    // Récupérer les informations de l'utilisateur depuis auth
                    const { data: authUser } = await supabase.auth.getUser()
                    if (authUser.user) {
                        // Créer le profil directement (RLS désactivé temporairement)
                        const profileId = `profile_${Date.now()}_${Math.floor(
                            Math.random() * 1000
                        )}`
                        const { data: newProfileData, error: createError } =
                            await supabase
                                .from("user_profiles")
                                .insert({
                                    id: profileId,
                                    user_id: authUser.user.id,
                                    email: authUser.user.email || "",
                                    first_name:
                                        authUser.user.user_metadata
                                            ?.first_name || "",
                                    last_name:
                                        authUser.user.user_metadata
                                            ?.last_name || "",
                                    role: (authUser.user.user_metadata?.role ||
                                        "user") as UserRole,
                                    status: "active" as
                                        | "active"
                                        | "inactive"
                                        | "suspended",
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                })
                                .select()
                                .single()

                        if (createError) {
                            console.error(
                                "❌ Erreur lors de la création du profil:",
                                createError
                            )
                        } else {
                            console.log(
                                "✅ Profil créé avec succès:",
                                newProfileData
                            )
                            // L'insertion retourne un objet direct
                            if (newProfileData) {
                                profileData = newProfileData
                                profileError = null
                            }
                        }
                    }
                } catch (createError) {
                    console.error(
                        "💥 Exception lors de la création du profil:",
                        createError
                    )
                }
            }

            if (profileError || !profileData) {
                console.error("❌ Error loading user profile:", profileError)
                // Si pas de profil, retourner null pour déclencher la création
                return null
            }

            // Le profil est maintenant un objet JSON direct
            const userProfileData = profileData

            // Récupérer l'email depuis auth.users si nécessaire
            const { data: authUser } = await supabase.auth.getUser()
            const userEmail =
                authUser.user?.email || userProfileData.email || ""

            // Charger les permissions directement (RLS désactivé temporairement)
            const { data: permissionsData } = await supabase
                .from("user_permissions")
                .select("permission")
                .eq("user_id", userId)

            // Charger le profil marchand si applicable
            let merchantProfile = null
            if (userProfileData.role === "merchant") {
                const { data: merchantData } = await supabase
                    .from("merchant_profiles")
                    .select("*")
                    .eq("user_id", userId)
                    .single()
                merchantProfile = merchantData
            }

            // Assembler le profil complet
            const userProfile: UserWithProfile = {
                id: userProfileData.id,
                user_id: userProfileData.user_id,
                email: userEmail,
                first_name: userProfileData.first_name || "",
                last_name:
                    (userProfileData as ExtendedUserProfile).last_name || "",
                avatar_url: userProfileData.avatar_url,
                phone: userProfileData.phone,
                country: userProfileData.country,
                city: userProfileData.city,
                role: userProfileData.role as UserRole,
                status: userProfileData.status as
                    | "active"
                    | "inactive"
                    | "suspended",
                preferences: userProfileData.preferences,
                created_at: userProfileData.created_at,
                updated_at: userProfileData.updated_at,
                last_login: userProfileData.last_login,
                merchant_profile: merchantProfile || undefined,
                permissions: permissionsData?.map(p => p.permission) || [],
            }

            console.log("✅ Profile loaded successfully:", userProfile)
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

    useEffect(() => {
        let mounted = true

        // Set up auth state listener
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

        // Get initial session
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

    // Écouter l'événement de rechargement forcé du profil
    useEffect(() => {
        const handleForceReload = async () => {
            console.log("🔄 AuthContext: Rechargement forcé du profil demandé")
            if (user) {
                const userProfile = await loadUserProfile(user.id)
                setProfile(userProfile)
            }
        }

        window.addEventListener("forceProfileReload", handleForceReload)

        return () => {
            window.removeEventListener("forceProfileReload", handleForceReload)
        }
    }, [user])

    const checkUserRoles = async (userId: string): Promise<string[]> => {
        try {
            console.log("🔍 AuthContext: Checking roles for user:", userId)

            const { data, error } = await supabase.rpc("get_user_roles", {
                _user_id: userId,
            })

            if (error) {
                console.error("❌ AuthContext: Error fetching roles:", error)
                return []
            }

            console.log("✅ AuthContext: Roles fetched:", data)
            return data || []
        } catch (error) {
            console.error("💥 AuthContext: Unexpected error:", error)
            return []
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            console.log("🔐 AuthContext: Starting sign in process for:", email)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error("❌ AuthContext: Sign in error:", error)
                return { error }
            }

            if (data.user) {
                console.log(
                    "✅ AuthContext: Sign in successful, checking roles..."
                )

                // Vérifier les rôles de l'utilisateur
                const userRoles = await checkUserRoles(data.user.id)

                // Vérification de secours pour les admins connus
                const isFallbackAdmin = isKnownAdmin(email)
                const finalRoles =
                    userRoles.length > 0
                        ? userRoles
                        : isFallbackAdmin
                        ? ["admin"]
                        : []

                console.log("🎯 AuthContext: Final roles determined:", {
                    email,
                    roles: finalRoles,
                    isFallback: userRoles.length === 0 && isFallbackAdmin,
                })

                // Charger le profil complet pour la redirection
                const userProfile = await loadUserProfile(data.user.id)
                if (userProfile) {
                    setProfile(userProfile)
                }

                return {
                    error: null,
                    userRoles: finalRoles,
                    profile: userProfile,
                }
            }

            return { error: null }
        } catch (error) {
            console.error("💥 AuthContext: Unexpected sign in error:", error)
            return { error }
        }
    }

    const signUp = async (userData: CreateUserRequest) => {
        try {
            console.log("📝 Starting sign up for:", userData.email)

            // Validation préalable
            if (!userData.email || !userData.password) {
                throw new Error("Email et mot de passe requis")
            }

            const signUpPayload: {
                email: string
                password: string
                options: {
                    data: {
                        first_name: string
                        last_name: string
                        role: UserRole
                        phone?: string
                        country?: string
                        city?: string
                    }
                    emailRedirectTo?: string
                }
            } = {
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        role: userData.role || "user",
                        phone: userData.phone,
                        country: userData.country,
                        city: userData.city,
                    },
                    // Pas de redirection email car confirmations désactivées
                    // emailRedirectTo: undefined,
                },
            }

            const { data, error } = await supabase.auth.signUp(signUpPayload)

            console.log("📋 Sign up response:", { data, error })

            if (error) {
                console.error("❌ Sign up error:", error)
                return {
                    error: new Error(
                        error.message.includes("User already registered")
                            ? "Un compte existe déjà avec cet email"
                            : error.message.includes("email confirmation")
                            ? "Veuillez vérifier votre email pour confirmer votre compte"
                            : "Erreur technique lors de la création du compte"
                    ),
                }
            }

            console.log("✅ Sign up successful:", data.user?.id)

            // Vérifier que le profil a été créé automatiquement par le trigger
            if (data.user?.id) {
                try {
                    console.log(
                        "🔍 Vérification de la création automatique du profil..."
                    )

                    // Attendre un peu pour que le trigger s'exécute
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    // Vérifier si le profil existe
                    const { data: checkProfile, error: checkError } =
                        await supabase
                            .from("user_profiles")
                            .select("*")
                            .eq("user_id", data.user.id)
                            .single()

                    if (checkError || !checkProfile) {
                        console.warn(
                            "⚠️ Profil non trouvé, création manuelle..."
                        )

                        // Utiliser la fonction sécurisée de création de profil
                        const { data: createResult, error: createError } =
                            await supabase.rpc(
                                "create_user_profile_with_logs",
                                {
                                    p_user_id: data.user.id,
                                    p_email: userData.email,
                                    p_first_name: userData.first_name,
                                    p_last_name: userData.last_name,
                                    p_role: userData.role || "user",
                                }
                            )

                        if (createError) {
                            console.error(
                                "❌ Erreur lors de la création manuelle:",
                                createError
                            )
                        } else {
                            console.log(
                                "✅ Profil créé manuellement:",
                                createResult
                            )
                        }
                    } else {
                        console.log(
                            "✅ Profil créé automatiquement:",
                            checkProfile
                        )
                    }

                    // Pour les marchands, vérifier le profil marchand
                    if (userData.role === "merchant") {
                        const { data: merchantProfile, error: merchantError } =
                            await supabase
                                .from("merchant_profiles")
                                .select("*")
                                .eq("user_id", data.user.id)
                                .single()

                        if (merchantError || !merchantProfile) {
                            console.warn(
                                "⚠️ Profil marchand non trouvé, création manuelle..."
                            )

                            // Créer le profil marchand manuellement si nécessaire
                            const businessInfo = userData.business_info || {}
                            const { error: merchantCreateError } =
                                await supabase
                                    .from("merchant_profiles")
                                    .insert({
                                        user_id: data.user.id,
                                        business_name:
                                            businessInfo.business_name ||
                                            "Mon Entreprise",
                                        business_sector:
                                            businessInfo.business_sector ||
                                            "Autre",
                                        business_type:
                                            businessInfo.business_type ||
                                            "Autre",
                                        business_description:
                                            businessInfo.business_description,
                                        business_address:
                                            businessInfo.business_address,
                                        business_phone:
                                            businessInfo.business_phone,
                                        business_email:
                                            businessInfo.business_email,
                                        verification_status: "pending",
                                    })

                            if (merchantCreateError) {
                                console.error(
                                    "❌ Erreur création profil marchand:",
                                    merchantCreateError
                                )
                            } else {
                                console.log(
                                    "✅ Profil marchand créé manuellement"
                                )
                            }
                        } else {
                            console.log(
                                "✅ Profil marchand créé automatiquement:",
                                merchantProfile
                            )
                        }
                    }
                } catch (profileCreationError) {
                    console.error(
                        "💥 Erreur lors de la vérification/création du profil:",
                        profileCreationError
                    )
                    // Ne pas faire échouer l'inscription
                }
            }

            return { error: null }
        } catch (error) {
            console.error("💥 Unexpected sign up error:", error)
            return {
                error: new Error(
                    "Une erreur technique s'est produite. Veuillez réessayer plus tard."
                ),
            }
        }
    }

    // Mettre à jour le profil utilisateur via la fonction sécurisée
    const updateProfile = async (updates: Partial<UserWithProfile>) => {
        try {
            if (!user) {
                return { error: new Error("User not authenticated") }
            }

            // Vérification supplémentaire pour les mises à jour admin
            if (updates.role && !hasRole(profile, "admin")) {
                return { error: new Error("Only admins can change roles") }
            }

            // Utiliser la fonction sécurisée pour mettre à jour le profil
            // Mise à jour directe du profil sans utiliser de fonction RPC
            const { data, error } = await supabase
                .from("user_profiles")
                .update({
                    first_name: updates.first_name || null,
                    last_name: updates.last_name || null,
                    avatar_url: updates.avatar_url || null,
                    phone: updates.phone || null,
                    country: updates.country || null,
                    city: updates.city || null,
                    preferences: updates.preferences || null,
                })
                .eq("user_id", user?.id)
                .select()
                .single()

            if (error) {
                console.error("❌ Error updating profile:", error)
                return { error }
            }

            if (!data) {
                console.error("❌ Profile update failed - no data returned")
                return { error: new Error("Profile update failed") }
            }

            // Rafraîchir le profil après mise à jour
            await refreshProfile()
            return { error: null }
        } catch (error) {
            console.error("💥 Unexpected error updating profile:", error)
            return { error: error as Error }
        }
    }

    // Fonctions de vérification des permissions
    const checkPermission = (permission: string): boolean => {
        if (!profile) return false
        return hasPermission(profile, permission)
    }

    const checkRole = (role: string): boolean => {
        if (!profile) return false
        return hasRole(profile, role as UserRole)
    }

    const checkAccess = (resource: string, action: string): boolean => {
        return canAccess(profile, resource, action)
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    // Alias pour compatibilité
    const logout = signOut

    const value = {
        user,
        session,
        profile,
        userProfile: profile, // Alias pour compatibilité
        loading,
        signIn,
        signUp,
        signOut,
        logout,
        updateProfile,
        refreshProfile,
        hasPermission: checkPermission,
        hasRole: checkRole,
        canAccess: checkAccess,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
