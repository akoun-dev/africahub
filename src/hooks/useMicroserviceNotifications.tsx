import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { notificationMicroservice } from "@/services/microservices/NotificationMicroservice"

interface NotificationRequest {
    userId: string
    type: "email" | "sms" | "push"
    channel: string
    subject?: string
    message: string
    templateId?: string
    templateData?: Record<string, any>
    priority?: "low" | "medium" | "high" | "urgent"
    scheduledAt?: Date
    metadata?: Record<string, any>
}

export const useSendNotification = () => {
    return useMutation({
        mutationFn: async (request: NotificationRequest) => {
            return await notificationMicroservice.sendNotification(request)
        },
    })
}

export const useNotificationPreferences = () => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["notification-preferences", user?.id],
        queryFn: async () => {
            if (!user) return null
            return await notificationMicroservice.getUserPreferences(user.id)
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    })
}

export const useUpdateNotificationPreferences = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (preferences: any) => {
            if (!user) throw new Error("No user logged in")
            return await notificationMicroservice.updateUserPreferences(
                user.id,
                preferences
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notification-preferences", user?.id],
            })
        },
    })
}
