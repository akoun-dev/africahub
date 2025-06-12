import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

export interface ConversationMessage {
    id: string
    session_id: string
    message_type: "user" | "assistant"
    content: string
    intent?: string
    entities?: any
    context?: any
    sentiment_score?: number
    language_code: string
    country_code?: string
    created_at: string
}

export const useConversationHistory = (sessionId: string) => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["conversation-history", sessionId],
        queryFn: async () => {
            // For now, return empty array since table doesn't exist yet
            console.log("Loading conversation history for session:", sessionId)

            // This would be the actual implementation once tables are recognized
            // let query = supabase
            //   .from('virtual_assistant_conversations')
            //   .select('*')
            //   .eq('session_id', sessionId)
            //   .order('created_at', { ascending: true });

            // if (user) {
            //   query = query.eq('user_id', user.id);
            // }

            // const { data, error } = await query;

            // if (error) throw error;
            // return data as ConversationMessage[];

            return []
        },
    })
}

export const useSendMessage = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async ({
            sessionId,
            message,
            context,
        }: {
            sessionId: string
            message: string
            context?: any
        }) => {
            // Save user message (simulated for now)
            console.log("Sending message:", {
                sessionId,
                message,
                context,
                user_id: user?.id,
            })

            // This would be the actual implementation once tables are recognized
            // if (user) {
            //   await supabase.from('virtual_assistant_conversations').insert({
            //     user_id: user.id,
            //     session_id: sessionId,
            //     message_type: 'user',
            //     content: message,
            //     context: context || {},
            //     language_code: 'fr'
            //   });
            // }

            // Get AI response
            const { data, error } = await supabase.functions.invoke(
                "virtual-assistant-chat",
                {
                    body: {
                        session_id: sessionId,
                        message,
                        context,
                        user_id: user?.id,
                    },
                }
            )

            if (error) throw error
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["conversation-history", variables.sessionId],
            })
        },
    })
}
