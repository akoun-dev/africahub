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
    | "create_user_profile_simple_rpc"
    | "create_merchant_profile_rpc"
import {
    UserWithProfile,
    hasPermission,
    hasRole,
    canAccess,
} from "@/integrations/supabase/helpers"
import { useNavigate, useLocation } from "react-router-dom"

// Interface étendue pour le profil utilisateur
interface RPCResult {
    success: boolean
    profile_id?: string
    merchant_id?: string
    message?: string
    error?: string
}

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

    // Charger le profil utilisateur via API REST
    const loadUserProfile = async (
        userId: string
    ): Promise<UserWithProfile | null> => {
        try {
            console.log("🔍 Loading user profile for:", userId)

            // Charger le profil utilisateur via API REST
            console.log("📡 Chargement via API REST...")
            const response = await fetch(
                `https://gpjkwjdtgbxkvcpzfodb.supabase.co/rest/v1/user_profiles?user_id=eq.${userId}&select=*`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                    },
                }
            )

            console.log(
                "📥 Réponse chargement:",
                response.status,
                response.statusText
            )

            if (!response.ok) {
                const errorText = await response.text()
                console.error("❌ Erreur chargement:", errorText)
                return null
            }

            const profiles = await response.json()
            console.log("📋 Profils trouvés:", profiles)

            const profileData = profiles.length > 0 ? profiles[0] : null
            console.log("📊 Profil extrait:", profileData)

            // Si aucun profil trouvé, créer automatiquement
            if (!profileData) {
                console.log("❌ Aucun profil trouvé, création automatique...")
                console.log("🔍 Nombre de profils trouvés:", profiles.length)
                console.log("🔧 Déclenchement de la création automatique...")

                // Déclencher la création via la fonction window qui a accès à user
                if (
                    typeof window !== "undefined" &&
                    (window as any).createProfileDirect
                ) {
                    console.log("🚀 Appel de createProfileDirect...")
                    const result = await (window as any).createProfileDirect()
                    console.log("📥 Résultat createProfileDirect:", result)

                    if (result.success) {
                        // Recharger le profil après création
                        console.log(
                            "🔄 Rechargement après création automatique..."
                        )
                        return await loadUserProfile(userId)
                    } else {
                        console.error(
                            "❌ Échec création automatique:",
                            result.error
                        )
                        return null
                    }
                } else {
                    console.error("❌ createProfileDirect non disponible")
                    return null
                }
            }

            // Le profil est maintenant un objet JSON direct
            const userProfileData = profileData
            console.log("📊 Données profil extraites:", userProfileData)

            // Utiliser l'email du profil directement
            const userEmail = userProfileData.email || ""
            console.log("📧 Email utilisé:", userEmail)

            // Charger les permissions via API REST
            console.log("🔐 Chargement des permissions via API REST...")
            const permResponse = await fetch(
                `https://gpjkwjdtgbxkvcpzfodb.supabase.co/rest/v1/user_permissions?user_id=eq.${userId}&select=permission`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                    },
                }
            )

            console.log(
                "📥 Réponse permissions:",
                permResponse.status,
                permResponse.statusText
            )

            let permissionsData: any[] = []
            if (permResponse.ok) {
                permissionsData = await permResponse.json()
                console.log("🔐 Permissions trouvées:", permissionsData)
            } else {
                console.warn("⚠️ Erreur chargement permissions (non bloquante)")
            }

            // Charger le profil marchand si applicable via API REST
            let merchantProfile = null
            if (userProfileData.role === "merchant") {
                console.log("🏪 Chargement profil marchand via API REST...")
                const merchantResponse = await fetch(
                    `https://gpjkwjdtgbxkvcpzfodb.supabase.co/rest/v1/merchant_profiles?user_id=eq.${userId}&select=*`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                        },
                    }
                )

                if (merchantResponse.ok) {
                    const merchantData = await merchantResponse.json()
                    merchantProfile =
                        merchantData.length > 0 ? merchantData[0] : null
                    console.log("🏪 Profil marchand trouvé:", merchantProfile)
                } else {
                    console.warn(
                        "⚠️ Erreur chargement profil marchand (non bloquante)"
                    )
                }
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

    // Fonction pour créer manuellement un profil (accessible via window.createProfile)
    const createProfileManually = async () => {
        if (!user) {
            console.error("❌ Aucun utilisateur connecté")
            return { success: false, error: "Aucun utilisateur connecté" }
        }

        try {
            console.log("🔧 Création manuelle de profil pour:", user.id)

            const profileData = {
                user_id: user.id,
                email: user.email || "",
                first_name: user.user_metadata?.first_name || "Utilisateur",
                last_name: user.user_metadata?.last_name || "AfricaHub",
                role: (user.user_metadata?.role || "user") as
                    | "user"
                    | "merchant"
                    | "admin"
                    | "manager",
                status: "active" as
                    | "active"
                    | "inactive"
                    | "suspended"
                    | "pending",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            console.log("📝 Données du profil:", profileData)

            const { data: createdProfile, error: createError } = await supabase
                .from("user_profiles")
                .insert(profileData)
                .select()
                .single()

            if (createError) {
                console.error("❌ Erreur création:", createError)
                return { success: false, error: createError.message }
            }

            console.log("✅ Profil créé:", createdProfile.id)

            // Créer les permissions de base
            await supabase.from("user_permissions").insert([
                {
                    user_id: user.id,
                    permission: "view_products",
                    granted_by: user.id,
                },
                {
                    user_id: user.id,
                    permission: "view_profile",
                    granted_by: user.id,
                },
                {
                    user_id: user.id,
                    permission: "edit_profile",
                    granted_by: user.id,
                },
            ])

            // Recharger le profil
            await refreshProfile()

            return { success: true, profile_id: createdProfile.id }
        } catch (error) {
            console.error("💥 Erreur:", error)
            return { success: false, error: "Erreur inattendue" }
        }
    }

    // Exposer les fonctions dans window pour les tests
    if (typeof window !== "undefined") {
        ;(window as any).createProfile = createProfileManually
        ;(window as any).forceProfileReload = refreshProfile

        // Création de profil via API REST directe (contournement du client Supabase)
        ;(window as any).createProfileDirect = async () => {
            if (!user) {
                console.error("❌ Aucun utilisateur connecté")
                return { success: false, error: "Aucun utilisateur connecté" }
            }

            try {
                console.log("🔧 Création directe via API REST pour:", user.id)

                const profileData = {
                    user_id: user.id,
                    email: user.email || "",
                    first_name: user.user_metadata?.first_name || "Utilisateur",
                    last_name: user.user_metadata?.last_name || "AfricaHub",
                    role: user.user_metadata?.role || "user",
                    status: "active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }

                console.log("📝 Données du profil:", profileData)

                // Insertion directe via API REST
                const response = await fetch(
                    "https://gpjkwjdtgbxkvcpzfodb.supabase.co/rest/v1/user_profiles",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                            Prefer: "return=representation",
                        },
                        body: JSON.stringify(profileData),
                    }
                )

                console.log(
                    "📥 Réponse API:",
                    response.status,
                    response.statusText
                )

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error("❌ Erreur API:", errorText)
                    return { success: false, error: errorText }
                }

                const createdProfile = await response.json()
                console.log("✅ Profil créé via API:", createdProfile)

                // Recharger le profil
                await refreshProfile()

                return { success: true, profile_id: createdProfile[0]?.id }
            } catch (error) {
                console.error("💥 Erreur:", error)
                return { success: false, error: "Erreur inattendue" }
            }
        }

        // Fonction de test de connexion Supabase
        ;(window as any).testSupabase = async () => {
            console.log("🧪 Test de connexion Supabase...")
            console.log("🔗 URL Supabase:", supabase.supabaseUrl)
            console.log("🔑 Clé présente:", !!supabase.supabaseKey)

            try {
                console.log("📡 Tentative de requête simple...")

                // Test avec timeout
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Timeout après 10s")),
                        10000
                    )
                )

                const queryPromise = supabase
                    .from("user_profiles")
                    .select("count")
                    .limit(1)

                const result = await Promise.race([
                    queryPromise,
                    timeoutPromise,
                ])
                const { data, error } = result as any

                console.log("✅ Connexion OK:", { data, error })
                return { success: true, data, error }
            } catch (err) {
                console.error("❌ Erreur connexion:", err)
                console.error("❌ Type d'erreur:", typeof err)
                console.error("❌ Message:", (err as Error).message)
                return { success: false, error: err }
            }
        }

        // Test de connectivité réseau basique
        ;(window as any).testNetwork = async () => {
            console.log("🌐 Test de connectivité réseau...")

            try {
                // Test 1: Test CORS avec un service public
                console.log("📡 Test 1: Test CORS...")
                const response1 = await fetch("https://httpbin.org/get", {
                    method: "GET",
                    mode: "cors",
                })
                console.log("✅ CORS OK:", response1.status)

                // Test 2: Test direct vers Supabase API
                console.log("📡 Test 2: Connectivité Supabase API...")
                const supabaseApiUrl =
                    "https://gpjkwjdtgbxkvcpzfodb.supabase.co/rest/v1/"
                const response2 = await fetch(supabaseApiUrl, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                    },
                })
                console.log("✅ Supabase API accessible:", response2.status)

                return { success: true, message: "Tous les tests réseau OK" }
            } catch (err) {
                console.error("❌ Erreur réseau:", err)
                return { success: false, error: err }
            }
        }

        // Inscription directe via SQL (contournement du client Supabase)
        ;(window as any).signUpDirect = async (userData: any) => {
            console.log("🔧 Inscription directe via SQL:", userData.email)

            try {
                console.log("📝 Données utilisateur:", userData)
                console.log("🔧 Création utilisateur via RPC...")

                // Créer l'utilisateur via RPC
                const response = await fetch(
                    "https://gpjkwjdtgbxkvcpzfodb.supabase.co/rest/v1/rpc/create_auth_user",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamt3amR0Z2J4a3ZjcHpmb2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODgxOTUsImV4cCI6MjA2NDg2NDE5NX0.pQrp1QRfNjTFiPo7RSTwfeAWsVdp1x0_oh5Rxr9GZzY",
                        },
                        body: JSON.stringify({
                            user_email: userData.email,
                            user_password: userData.password,
                            user_first_name: userData.first_name,
                            user_last_name: userData.last_name,
                            user_role: userData.role || "user",
                        }),
                    }
                )

                console.log(
                    "📥 Réponse inscription:",
                    response.status,
                    response.statusText
                )

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error("❌ Erreur inscription:", errorText)
                    return { success: false, error: errorText }
                }

                const userId = await response.json()
                console.log("✅ Inscription réussie, user_id:", userId)

                return { success: true, user_id: userId }
            } catch (error) {
                console.error("💥 Erreur inscription:", error)
                return { success: false, error: "Erreur inattendue" }
            }
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

            // 2. Créer le profil utilisateur directement
            console.log("📝 ÉTAPE 2: Création du profil utilisateur...")
            try {
                const { data: profileData, error: profileError } =
                    await supabase
                        .from("user_profiles")
                        .insert({
                            user_id: data.user.id,
                            email: userData.email,
                            first_name: userData.first_name || "Utilisateur",
                            last_name: userData.last_name || "AfricaHub",
                            role: (userData.role || "user") as
                                | "user"
                                | "merchant"
                                | "admin"
                                | "manager",
                            status: "active" as
                                | "active"
                                | "inactive"
                                | "suspended"
                                | "pending",
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .select()
                        .single()

                if (profileError) {
                    console.error(
                        "❌ ÉCHEC ÉTAPE 2 - Erreur création profil:",
                        profileError
                    )
                    throw new Error(
                        "Échec création du profil: " + profileError.message
                    )
                }

                console.log("✅ SUCCÈS ÉTAPE 2 - Profil créé:", profileData?.id)

                // Créer les permissions de base
                await supabase.from("user_permissions").insert([
                    {
                        user_id: data.user.id,
                        permission: "view_products",
                        granted_by: data.user.id,
                    },
                    {
                        user_id: data.user.id,
                        permission: "view_profile",
                        granted_by: data.user.id,
                    },
                    {
                        user_id: data.user.id,
                        permission: "edit_profile",
                        granted_by: data.user.id,
                    },
                ])
            } catch (error) {
                console.error("💥 Erreur fatale création profil:", error)
                throw error
            }

            // 3. Si marchand, créer le profil marchand directement
            if (userData.role === "merchant" && userData.business_info) {
                console.log("🏢 ÉTAPE 3: Création profil marchand...")
                const businessInfo = userData.business_info

                try {
                    // Créer le profil marchand
                    const { data: merchantData, error: merchantError } =
                        await supabase
                            .from("merchant_profiles")
                            .insert({
                                user_id: data.user.id,
                                business_name:
                                    businessInfo.business_name ||
                                    "Mon Entreprise",
                                business_sector:
                                    businessInfo.business_sector || "Autre",
                                business_type:
                                    businessInfo.business_type || "Autre",
                                business_description:
                                    businessInfo.business_description,
                                business_address: businessInfo.business_address,
                                business_phone: businessInfo.business_phone,
                                business_email: businessInfo.business_email,
                                verification_status: "pending",
                            })
                            .select()
                            .single()

                    if (merchantError) {
                        console.error(
                            "❌ ÉCHEC ÉTAPE 3 - Erreur création profil marchand:",
                            merchantError
                        )
                    } else {
                        console.log(
                            "✅ SUCCÈS ÉTAPE 3 - Profil marchand créé:",
                            merchantData?.id
                        )
                    }

                    // Mettre à jour le profil utilisateur avec les informations business
                    console.log(
                        "🔄 Mise à jour profil utilisateur avec infos business..."
                    )

                    // D'abord, récupérer les colonnes existantes
                    const { data: existingColumns } = await supabase
                        .from("user_profiles")
                        .select("*")
                        .limit(0)

                    console.log(
                        "📊 Colonnes disponibles dans user_profiles:",
                        Object.keys(existingColumns || {})
                    )

                    // Mise à jour basique sans les colonnes business si elles n'existent pas
                    await supabase
                        .from("user_profiles")
                        .update({
                            updated_at: new Date().toISOString(),
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
                } catch (error) {
                    console.error("💥 Erreur création profil marchand:", error)
                }
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
        hasPermission: checkPermission,
        hasRole: checkRole,
        canAccess: checkAccess,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
