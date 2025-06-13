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
    createProfileForExistingUser: () => Promise<{
        success: boolean
        error?: string
        profile_id?: string
    }>
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

    // Charger le profil utilisateur
    const loadUserProfile = async (
        userId: string
    ): Promise<UserWithProfile | null> => {
        try {
            console.log("🔍 Loading user profile for:", userId)

            // Charger le profil utilisateur
            const { data: profileData, error: profileError } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle()

            console.log("📋 Profile data:", {
                profileData,
                profileError,
            })

            // Si aucun profil trouvé, retourner null
            if (profileError || !profileData) {
                console.log(
                    "❌ Aucun profil trouvé pour l'utilisateur:",
                    userId
                )
                console.log("💡 Le profil doit être créé lors de l'inscription")
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

    // Créer un profil pour un utilisateur existant
    const createProfileForExistingUser = async () => {
        if (!user) {
            console.error("❌ Aucun utilisateur connecté")
            return { success: false, error: "Aucun utilisateur connecté" }
        }

        try {
            console.log(
                "🔧 Création de profil pour utilisateur existant:",
                user.id
            )

            const { data: profileResult, error: profileError } =
                await supabase.rpc("create_user_profile_simple_rpc", {
                    p_user_id: user.id,
                    p_email: user.email || "",
                    p_first_name:
                        user.user_metadata?.first_name || "Utilisateur",
                    p_last_name: user.user_metadata?.last_name || "AfricaHub",
                    p_role: user.user_metadata?.role || "user",
                })

            console.log("📥 Résultat création profil:", {
                profileResult,
                profileError,
            })

            if (profileError) {
                console.error("❌ Erreur création profil:", profileError)
                return { success: false, error: profileError.message }
            }

            if (profileResult?.success) {
                console.log(
                    "✅ Profil créé avec succès:",
                    profileResult.profile_id
                )
                // Recharger le profil
                await refreshProfile()
                return { success: true, profile_id: profileResult.profile_id }
            } else {
                console.warn("⚠️ Résultat inattendu:", profileResult)
                return { success: false, error: "Résultat inattendu" }
            }
        } catch (error) {
            console.error("💥 Erreur inattendue:", error)
            return { success: false, error: "Erreur inattendue" }
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
        console.log("🚀 === DÉBUT INSCRIPTION ===")
        console.log("📧 Email:", userData.email)
        console.log("👤 Prénom:", userData.first_name)
        console.log("👤 Nom:", userData.last_name)
        console.log("🎭 Rôle:", userData.role)
        console.log("📋 Données complètes:", userData)

        try {
            console.log("⏳ ÉTAPE 1: Création utilisateur Supabase Auth...")

            const authPayload = {
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        role: userData.role || "user",
                    },
                },
            }

            console.log("📤 Payload envoyé à Supabase Auth:", authPayload)

            const { data, error } = await supabase.auth.signUp(authPayload)

            console.log("📥 Réponse Supabase Auth:", { data, error })

            if (error) {
                console.error("❌ ÉCHEC ÉTAPE 1 - Erreur Supabase Auth:", error)
                console.error("❌ Message d'erreur:", error.message)
                console.error("❌ Code d'erreur:", error.status)
                return {
                    error: new Error(
                        "Erreur lors de l'inscription: " + error.message
                    ),
                }
            }

            if (!data.user) {
                console.error(
                    "❌ ÉCHEC ÉTAPE 1 - Aucun utilisateur dans la réponse"
                )
                console.error("❌ Data reçue:", data)
                return { error: new Error("Erreur lors de l'inscription") }
            }

            console.log("✅ SUCCÈS ÉTAPE 1 - Utilisateur créé!")
            console.log("🆔 User ID:", data.user.id)
            console.log("📧 Email confirmé:", data.user.email)
            console.log("📊 Métadonnées utilisateur:", data.user.user_metadata)

            // 2. Créer le profil utilisateur avec la fonction RPC
            console.log("📝 ÉTAPE 2: Création du profil utilisateur...")
            const { data: profileResult, error: profileError } =
                await supabase.rpc("create_user_profile_simple_rpc", {
                    p_user_id: data.user.id,
                    p_email: userData.email,
                    p_first_name: userData.first_name || "Utilisateur",
                    p_last_name: userData.last_name || "AfricaHub",
                    p_role: userData.role || "user",
                })

            console.log("📥 Résultat création profil:", {
                profileResult,
                profileError,
            })

            if (profileError) {
                console.error(
                    "❌ ÉCHEC ÉTAPE 2 - Erreur création profil:",
                    profileError
                )
                // Ne pas faire échouer l'inscription, mais logger l'erreur
            } else if (profileResult?.success) {
                console.log(
                    "✅ SUCCÈS ÉTAPE 2 - Profil créé:",
                    profileResult.profile_id
                )
            } else {
                console.warn("⚠️ ÉTAPE 2 - Résultat inattendu:", profileResult)
            }

            // 3. Si marchand, créer le profil marchand avec la fonction RPC
            if (userData.role === "merchant" && userData.business_info) {
                console.log("🏢 ÉTAPE 3: Création profil marchand...")
                const businessInfo = userData.business_info

                const { data: merchantResult, error: merchantError } =
                    await supabase.rpc("create_merchant_profile_rpc", {
                        p_user_id: data.user.id,
                        p_business_name:
                            businessInfo.business_name || "Mon Entreprise",
                        p_business_sector:
                            businessInfo.business_sector || "Autre",
                        p_business_type: businessInfo.business_type || "Autre",
                        p_business_description:
                            businessInfo.business_description,
                        p_business_address: businessInfo.business_address,
                        p_business_phone: businessInfo.business_phone,
                        p_business_email: businessInfo.business_email,
                    })

                console.log("📥 Résultat création profil marchand:", {
                    merchantResult,
                    merchantError,
                })

                if (merchantError) {
                    console.error(
                        "❌ ÉCHEC ÉTAPE 3 - Erreur création profil marchand:",
                        merchantError
                    )
                } else if (merchantResult?.success) {
                    console.log(
                        "✅ SUCCÈS ÉTAPE 3 - Profil marchand créé:",
                        merchantResult.merchant_id
                    )
                } else {
                    console.warn(
                        "⚠️ ÉTAPE 3 - Résultat inattendu:",
                        merchantResult
                    )
                }

                // Mettre à jour le profil utilisateur avec les informations business
                console.log(
                    "🔄 Mise à jour profil utilisateur avec infos business..."
                )
                await supabase
                    .from("user_profiles")
                    .update({
                        business_name: businessInfo.business_name,
                        business_sector: businessInfo.business_sector,
                        business_type: businessInfo.business_type,
                        business_description: businessInfo.business_description,
                        business_address: businessInfo.business_address,
                        business_phone: businessInfo.business_phone,
                        business_email: businessInfo.business_email,
                    })
                    .eq("user_id", data.user.id)

                // Permissions marchands
                await supabase.from("user_permissions").insert([
                    {
                        user_id: data.user.id,
                        permission: "manage_products",
                        granted_by: data.user.id,
                    },
                    {
                        user_id: data.user.id,
                        permission: "view_analytics",
                        granted_by: data.user.id,
                    },
                ])
            }

            console.log("🎉 Inscription terminée avec succès")
            return { error: null }
        } catch (error) {
            console.error("💥 Erreur inscription:", error)
            return {
                error: new Error("Erreur technique lors de l'inscription"),
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

    // 🚪 Fonction de déconnexion améliorée
    const signOut = async () => {
        try {
            console.log("🔐 AuthContext: Début de la déconnexion...")

            // Nettoyer l'état local avant la déconnexion
            setUser(null)
            setSession(null)
            setProfile(null)

            // Appeler la déconnexion Supabase
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error(
                    "❌ AuthContext: Erreur lors de la déconnexion:",
                    error
                )
                throw error
            }

            console.log("✅ AuthContext: Déconnexion réussie")
        } catch (error) {
            console.error(
                "💥 AuthContext: Erreur inattendue lors de la déconnexion:",
                error
            )

            // Même en cas d'erreur, nettoyer l'état local
            setUser(null)
            setSession(null)
            setProfile(null)

            throw error
        }
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
        createProfileForExistingUser,
        hasPermission: checkPermission,
        hasRole: checkRole,
        canAccess: checkAccess,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
