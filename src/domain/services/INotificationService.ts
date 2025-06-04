
import { NotificationPreferences } from '../entities/Notification';

export interface INotificationService {
  initialize(): Promise<boolean>;
  updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void>;
  getPreferences(userId: string): Promise<NotificationPreferences | null>;
  sendNotification(userId: string, title: string, message: string, data?: any): Promise<void>;
}
