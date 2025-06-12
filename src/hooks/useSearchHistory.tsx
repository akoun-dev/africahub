import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export interface SearchHistoryItem {
    id: string
    user_id: string
    search_query: string
    sector: string
    filters: Record<string, any>
    results_count: number
    created_at: string
}

export const useSearchHistory = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const { data: history, isLoading } = useQuery({
        queryKey: ["search-history", user?.id],
        queryFn: async () => {
            if (!user) return []

            // Mock data until table is created
            const mockHistory: SearchHistoryItem[] = [
                {
                    id: "1",
                    user_id: user.id,
                    search_query: "assurance auto",
                    sector: "auto",
                    filters: { budget: "0-100000", country: "CI" },
                    results_count: 15,
                    created_at: new Date().toISOString(),
                },
            ]

            return mockHistory
        },
        enabled: !!user,
    })

    const addToHistory = useMutation({
        mutationFn: async (searchData: {
            search_query: string
            sector: string
            filters: Record<string, any>
            results_count: number
        }) => {
            if (!user) throw new Error("User not authenticated")

            // Mock implementation - in real app this would insert to database
            const newItem: SearchHistoryItem = {
                id: Math.random().toString(36).substr(2, 9),
                user_id: user.id,
                ...searchData,
                created_at: new Date().toISOString(),
            }

            return newItem
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["search-history", user?.id],
            })
            toast.success("Recherche ajoutée à l'historique")
        },
    })

    const clearHistory = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error("User not authenticated")
            // Mock implementation
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["search-history", user?.id],
            })
            toast.success("Historique effacé")
        },
    })

    const deleteHistoryItem = useMutation({
        mutationFn: async (itemId: string) => {
            // Mock implementation
            return true
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["search-history", user?.id],
            })
            toast.success("Élément supprimé")
        },
    })

    return {
        history: history || [],
        isLoading,
        addToHistory,
        clearHistory,
        deleteHistoryItem,
    }
}
