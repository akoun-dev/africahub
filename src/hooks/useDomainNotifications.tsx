import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { INotificationService } from "@/domain/services/INotificationService"
import { NotificationPreferences } from "@/domain/entities/Notification"
import Container from "@/infrastructure/di/Container"

export const useDomainNotifications = () => {
    const { user } = useAuth()
    const [preferences, setPreferences] =
        useState<NotificationPreferences | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const notificationService =
        Container.getInstance().get<INotificationService>(
            "INotificationService"
        )

    const initializeNotifications = async () => {
        setLoading(true)
        try {
            const initialized = await notificationService.initialize()
            if (initialized && user) {
                const prefs = await notificationService.getPreferences(user.id)
                setPreferences(prefs)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }

    const updatePreferences = async (
        newPreferences: NotificationPreferences
    ) => {
        if (!user) return

        setLoading(true)
        try {
            await notificationService.updatePreferences(user.id, newPreferences)
            setPreferences(newPreferences)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            initializeNotifications()
        }
    }, [user])

    return {
        preferences,
        loading,
        error,
        updatePreferences,
        initialize: initializeNotifications,
    }
}
