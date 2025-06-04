
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

export const useNotifications = (limit = 10, unreadOnly = false) => {
  return useQuery({
    queryKey: ['notifications', limit, unreadOnly],
    queryFn: async (): Promise<NotificationsResponse> => {
      const { data, error } = await supabase.functions.invoke('get-notifications', {
        body: { limit, unread_only: unreadOnly }
      });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ notificationId, markAll = false }: { notificationId?: string; markAll?: boolean }) => {
      const { data, error } = await supabase.functions.invoke('mark-notification-read', {
        body: { 
          notification_id: notificationId,
          mark_all: markAll 
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
