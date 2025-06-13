/**
 * Hook pour la gestion des notifications utilisateur
 * Permet de récupérer, marquer comme lues et supprimer les notifications
 */

import { useState, useEffect } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface UserNotification {
    id: string
    user_id: string
    type: "info" | "success" | "warning" | "error"
    category: "system" | "product" | "price" | "review" | "favorite" | "security"
    title: string
    message: string
    read: boolean
    priority: "low" | "medium" | "high" | "urgent"
    action_url?: string
    metadata?: any
    expires_at?: string
    created_at: string
    updated_at: string
}

export interface CreateNotificationData {
    type: "info" | "success" | "warning" | "error"
    category: "system" | "product" | "price" | "review" | "favorite" | "security"
    title: string
    message: string
    priority?: "low" | "medium" | "high" | "urgent"
    action_url?: string
    metadata?: any
    expires_at?: string
}

export const useUserNotifications = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const currentUserId = user?.id

    // Query pour récupérer les notifications de l'utilisateur
    const {
        data: notifications = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["user-notifications", currentUserId],
        queryFn: async () => {
            if (!currentUserId) return []

            console.log("🔍 Chargement des notifications pour:", currentUserId)

            const { data, error } = await supabase
                .from("user_notifications")
                .select("*")
                .eq("user_id", currentUserId)
                .or("expires_at.is.null,expires_at.gt.now()") // Exclure les notifications expirées
                .order("created_at", { ascending: false })

            if (error) {
                console.error("❌ Erreur lors du chargement des notifications:", error)
                throw error
            }

            console.log("✅ Notifications chargées:", data?.length || 0)
            return data || []
        },
        enabled: !!currentUserId,
        staleTime: 1 * 60 * 1000, // 1 minute (plus fréquent pour les notifications)
        refetchInterval: 5 * 60 * 1000, // Actualiser toutes les 5 minutes
    })

    // Mutation pour marquer une notification comme lue
    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("✅ Marquage comme lue:", notificationId)

            const { data, error } = await supabase
                .from("user_notifications")
                .update({ read: true })
                .eq("id", notificationId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors du marquage comme lue:", error)
                throw error
            }

            console.log("✅ Notification marquée comme lue")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-notifications", currentUserId],
            })
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation marquage lecture:", error)
            toast.error("Erreur lors du marquage de la notification")
        },
    })

    // Mutation pour marquer une notification comme non lue
    const markAsUnreadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("📧 Marquage comme non lue:", notificationId)

            const { data, error } = await supabase
                .from("user_notifications")
                .update({ read: false })
                .eq("id", notificationId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire
                .select()
                .single()

            if (error) {
                console.error("❌ Erreur lors du marquage comme non lue:", error)
                throw error
            }

            console.log("✅ Notification marquée comme non lue")
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-notifications", currentUserId],
            })
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation marquage non lecture:", error)
            toast.error("Erreur lors du marquage de la notification")
        },
    })

    // Mutation pour marquer toutes les notifications comme lues
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("✅ Marquage de toutes les notifications comme lues")

            const { error } = await supabase
                .from("user_notifications")
                .update({ read: true })
                .eq("user_id", currentUserId)
                .eq("read", false)

            if (error) {
                console.error("❌ Erreur lors du marquage global:", error)
                throw error
            }

            console.log("✅ Toutes les notifications marquées comme lues")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-notifications", currentUserId],
            })
            toast.success("Toutes les notifications marquées comme lues")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation marquage global:", error)
            toast.error("Erreur lors du marquage global")
        },
    })

    // Mutation pour supprimer une notification
    const deleteNotificationMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🗑️ Suppression de la notification:", notificationId)

            const { error } = await supabase
                .from("user_notifications")
                .delete()
                .eq("id", notificationId)
                .eq("user_id", currentUserId) // Sécurité supplémentaire

            if (error) {
                console.error("❌ Erreur lors de la suppression:", error)
                throw error
            }

            console.log("✅ Notification supprimée")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user-notifications", currentUserId],
            })
            toast.success("Notification supprimée")
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression:", error)
            toast.error("Erreur lors de la suppression")
        },
    })

    // Mutation pour supprimer plusieurs notifications
    const bulkDeleteMutation = useMutation({
        mutationFn: async (notificationIds: string[]) => {
            if (!currentUserId) {
                throw new Error("Utilisateur non connecté")
            }

            console.log("🗑️ Suppression en lot:", notificationIds.length)

            const { error } = await supabase
                .from("user_notifications")
                .delete()
                .in("id", notificationIds)
                .eq("user_id", currentUserId) // Sécurité supplémentaire

            if (error) {
                console.error("❌ Erreur lors de la suppression en lot:", error)
                throw error
            }

            console.log("✅ Notifications supprimées en lot")
        },
        onSuccess: (_, notificationIds) => {
            queryClient.invalidateQueries({
                queryKey: ["user-notifications", currentUserId],
            })
            toast.success(`${notificationIds.length} notification(s) supprimée(s)`)
        },
        onError: (error: any) => {
            console.error("❌ Erreur mutation suppression lot:", error)
            toast.error("Erreur lors de la suppression en lot")
        },
    })

    // Fonctions helper
    const markAsRead = (notificationId: string) => {
        return markAsReadMutation.mutateAsync(notificationId)
    }

    const markAsUnread = (notificationId: string) => {
        return markAsUnreadMutation.mutateAsync(notificationId)
    }

    const markAllAsRead = () => {
        return markAllAsReadMutation.mutateAsync()
    }

    const deleteNotification = (notificationId: string) => {
        return deleteNotificationMutation.mutateAsync(notificationId)
    }

    const bulkDelete = (notificationIds: string[]) => {
        return bulkDeleteMutation.mutateAsync(notificationIds)
    }

    // Statistiques et filtres
    const unreadNotifications = notifications.filter(n => !n.read)
    const readNotifications = notifications.filter(n => n.read)
    
    const todayNotifications = notifications.filter(n => {
        const today = new Date().toDateString()
        const notifDate = new Date(n.created_at).toDateString()
        return today === notifDate
    })

    const notificationsByType = {
        info: notifications.filter(n => n.type === "info"),
        success: notifications.filter(n => n.type === "success"),
        warning: notifications.filter(n => n.type === "warning"),
        error: notifications.filter(n => n.type === "error"),
    }

    const notificationsByCategory = {
        system: notifications.filter(n => n.category === "system"),
        product: notifications.filter(n => n.category === "product"),
        price: notifications.filter(n => n.category === "price"),
        review: notifications.filter(n => n.category === "review"),
        favorite: notifications.filter(n => n.category === "favorite"),
        security: notifications.filter(n => n.category === "security"),
    }

    const stats = {
        total: notifications.length,
        unread: unreadNotifications.length,
        read: readNotifications.length,
        today: todayNotifications.length,
        byType: notificationsByType,
        byCategory: notificationsByCategory,
    }

    return {
        notifications,
        unreadNotifications,
        readNotifications,
        stats,
        isLoading: isLoading || 
                   markAsReadMutation.isPending || 
                   markAsUnreadMutation.isPending ||
                   markAllAsReadMutation.isPending ||
                   deleteNotificationMutation.isPending ||
                   bulkDeleteMutation.isPending,
        error: error?.message || null,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        bulkDelete,
        refetch,
        // États des mutations pour l'interface
        isMarkingAsRead: markAsReadMutation.isPending,
        isMarkingAsUnread: markAsUnreadMutation.isPending,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
        isDeleting: deleteNotificationMutation.isPending,
        isBulkDeleting: bulkDeleteMutation.isPending,
    }
}

export default useUserNotifications
