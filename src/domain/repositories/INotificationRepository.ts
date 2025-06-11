
import { Notification, NotificationPreferences, PushToken } from '../entities/Notification';

export interface INotificationRepository {
  getNotifications(userId?: string, limit?: number): Promise<{ notifications: Notification[], unreadCount: number }>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  
  // Push notifications
  savePushToken(userId: string, token: string, platform: string): Promise<void>;
  updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void>;
  getPreferences(userId: string): Promise<NotificationPreferences | null>;
}
