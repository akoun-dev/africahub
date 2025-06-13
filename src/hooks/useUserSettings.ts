/**
 * Hook pour la gestion des paramètres utilisateur
 * Permet de récupérer et mettre à jour les préférences utilisateur
 */

import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface UserSettings {
    id: string
    user_id: string
    
    // Notifications
    email_notifications: boolean
    push_notifications: boolean
    price_alerts: boolean
    new_products: boolean
    review_notifications: boolean
    marketing_emails: boolean
    
    // Confidentialité
    profile_visibility: "public" | "private" | "friends"
    show_email: boolean
    show_phone: boolean
    data_sharing: boolean
    
    // Préférences
    language: string
    currency: string
    theme: "light" | "dark" | "auto"
    timezone: string
    
    // Sécurité
    two_factor_auth: boolean
    login_alerts: boolean
    session_timeout: number
    
    // Métadonnées
    metadata?: any
    created_at: string
    updated_at: string
}

export interface UpdateSettingsData {
    // Notifications
    email_notifications?: boolean
    push_notifications?: boolean
    price_alerts?: boolean
    new_products?: boolean
    review_notifications?: boolean
    marketing_emails?: boolean
    
    // Confidentialité
    profile_visibility?: "public" | "private" | "friends"
    show_email?: boolean
    show_phone?: boolean
    data_sharing?: boolean
    
    // Préférences
    language?: string
    currency?: string
    theme?: "light" | "dark" | "auto"
    timezone?: string
    
    // Sécurité
    two_factor_auth?: boolean
    login_alerts?: boolean
    session_timeout?: number
    
    // Métadonnées
    metadata?: any
}

const DEFAULT_SETTINGS: Omit<UserSettings, "id" | "user_id" | "created_at" | "updated_at"> = {
    // Notifications
    email_notifications: true,
    push_notifications: true,
    price_alerts: true,
    new_products: true,
    review_notifications: false,
    marketing_emails: false,
    
    // Confidentialité
    profile_visibility: "public",
    show_email: false,
    show_phone: false,
    data_sharing: false,
    
    // Préférences
    language: "fr",
    currency: "XOF",
    theme: "light",
    timezone: "Africa/Abidjan",
    
    // Sécurité
    two_factor_auth: false,
    login_alerts: true,
    session_timeout: 30,
    
    // Métadonnées
    metadata: {},
}

export const useUserSettings = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const currentUserId = user?.id

    // Query pour récupérer les paramètres de l'utilisateur
    const {
        data: settings,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["user-settings", currentUserId],
        queryFn: async () => {
            if (!currentUserId) return null

            console.log("🔍 Chargement des paramètres pour:", currentUserId)

            const { data, error } = await supabase
                .from("user_settings")
                .select("*")
                .eq("user_id", currentUserId)
                .single()

            if (error) {
                if (error.code === "PGRST116") {
                    // Aucun paramètre trouvé, créer avec les valeurs par défaut
                    console.log("📝 Création des paramètres par défaut")
                    
                    const { data: newSettings, error: createError } = await supabase
                        .from("user_settings")
                        .insert({
                            user_id: currentUserId,
                            ...DEFAULT_SETTINGS,
                        })
                        .select()
                        .single()

                    if (createError) {
                        console.error("❌ Erreur lors de la création des paramètres:", createError)
                        throw createError
                    }

                    console.log("✅ Paramètres par défaut créés")
                    return newSettings
                } else {
                    console.error("❌ Erreur lors du chargement des paramètres:", error)
                    throw error
                }
            }

            console.log("✅ Paramètres chargés")
            return data
        },
        enabled: !!currentUserId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    })

    // Mutation pour mettre à jour les paramètres
    const updateSettingsMutation = useMutation({
        mutationFn: async (updateData: UpdateSettingsData) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("✏️ Mise à jour des paramètres")

            const { data, error } = await supabase
                .from("user_settings")
                .update(updateData)
                .eq("user_id", currentUserId)
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la mise à jour des paramètres:", error)
                throw error
            }

            console.log("✅ Paramètres mis à jour avec succès")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-settings", currentUserId],
            })
            toast.success("Paramètres sauvegardés avec succès !")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation mise à jour paramètres:", error)
            toast.error("Erreur lors de la sauvegarde des paramètres")
        },
    })

    // Mutation pour réinitialiser les paramètres
    const resetSettingsMutation = useMutation({
        mutationFn: async () => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🔄 Réinitialisation des paramètres")

            const { data, error } = await supabase
                .from("user_settings")
                .update(DEFAULT_SETTINGS)
                .eq("user_id", currentUserId)
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors de la réinitialisation:", error)
                throw error
            }

            console.log("✅ Paramètres réinitialisés")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-settings", currentUserId],
            })
            toast.success("Paramètres réinitialisés aux valeurs par défaut")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation réinitialisation:", error)
            toast.error("Erreur lors de la réinitialisation")
        },
    })

    // Fonctions helper
    const updateSettings = (updateData: UpdateSettingsData) => {
        return updateSettingsMutation.mutateAsync(updateData)
    }

    const resetSettings = () => {
        return resetSettingsMutation.mutateAsync()
    }

    // Fonctions utilitaires pour des paramètres spécifiques
    const updateNotificationSettings = (notificationSettings: Partial<Pick<UserSettings, 
        "email_notifications" | "push_notifications" | "price_alerts" | 
        "new_products" | "review_notifications" | "marketing_emails">>) => {
        return updateSettings(notificationSettings)
    }

    const updatePrivacySettings = (privacySettings: Partial<Pick<UserSettings,
        "profile_visibility" | "show_email" | "show_phone" | "data_sharing">>) => {
        return updateSettings(privacySettings)
    }

    const updatePreferences = (preferences: Partial<Pick<UserSettings,
        "language" | "currency" | "theme" | "timezone">>) => {
        return updateSettings(preferences)
    }

    const updateSecuritySettings = (securitySettings: Partial<Pick<UserSettings,
        "two_factor_auth" | "login_alerts" | "session_timeout">>) => {
        return updateSettings(securitySettings)
    }

    // Getters pour des groupes de paramètres
    const notificationSettings = settings ? {
        email_notifications: settings.email_notifications,
        push_notifications: settings.push_notifications,
        price_alerts: settings.price_alerts,
        new_products: settings.new_products,
        review_notifications: settings.review_notifications,
        marketing_emails: settings.marketing_emails,
    } : null

    const privacySettings = settings ? {
        profile_visibility: settings.profile_visibility,
        show_email: settings.show_email,
        show_phone: settings.show_phone,
        data_sharing: settings.data_sharing,
    } : null

    const preferences = settings ? {
        language: settings.language,
        currency: settings.currency,
        theme: settings.theme,
        timezone: settings.timezone,
    } : null

    const securitySettings = settings ? {
        two_factor_auth: settings.two_factor_auth,
        login_alerts: settings.login_alerts,
        session_timeout: settings.session_timeout,
    } : null

    return {
        settings,
        notificationSettings,
        privacySettings,
        preferences,
        securitySettings,
        isLoading: isLoading || 
                   updateSettingsMutation.isPending || 
                   resetSettingsMutation.isPending,
        error: error?.message || null,
        updateSettings,
        resetSettings,
        updateNotificationSettings,
        updatePrivacySettings,
        updatePreferences,
        updateSecuritySettings,
        refetch,
        // États des mutations pour l'interface
        isUpdating: updateSettingsMutation.isPending,
        isResetting: resetSettingsMutation.isPending,
    }
}

export default useUserSettings
