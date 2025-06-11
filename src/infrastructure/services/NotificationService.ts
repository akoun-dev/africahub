
import { INotificationService } from '@/domain/services/INotificationService';
import { NotificationPreferences } from '@/domain/entities/Notification';
import { PushNotificationService } from '@/services/notifications/PushNotificationService';

export class NotificationService implements INotificationService {
  private pushService: PushNotificationService;

  constructor() {
    this.pushService = PushNotificationService.getInstance();
  }

  async initialize(): Promise<boolean> {
    return await this.pushService.initialize();
  }

  async updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    await this.pushService.updatePreferences(userId, preferences);
  }

  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    return await this.pushService.getPreferences(userId);
  }

  async sendNotification(userId: string, title: string, message: string, data?: any): Promise<void> {
    await this.pushService.sendNotification(userId, title, message, data);
  }
}
