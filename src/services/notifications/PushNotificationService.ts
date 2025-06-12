
import { NotificationPreferences } from '@/domain/entities/Notification';

export class PushNotificationService {
  private static instance: PushNotificationService;

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    console.log('Push notification service initialized');
    return true;
  }

  async savePushToken(userId: string, token: string, platform: string): Promise<void> {
    console.log('Saving push token:', { userId, token, platform });
    localStorage.setItem(`push_token_${userId}`, JSON.stringify({ token, platform }));
  }

  async updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    console.log('Updating notification preferences:', { userId, preferences });
    localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(preferences));
  }

  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    const stored = localStorage.getItem(`notification_prefs_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      newOffers: true,
      priceChanges: true,
      sectorUpdates: true,
      companyNews: false
    };
  }

  async sendNotification(userId: string, title: string, message: string, data?: any): Promise<void> {
    console.log('Sending notification:', { userId, title, message, data });
  }
}

// Export the type for external use
export type { NotificationPreferences };
