
import { executeQuery } from '../config/database';
import { getChannel } from '../config/rabbitmq';
import { logger } from '../utils/logger';

export interface NotificationRequest {
  userId: string;
  type: 'email' | 'sms' | 'push';
  channel: string;
  subject?: string;
  message: string;
  templateId?: string;
  templateData?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: Date;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendNotification(request: NotificationRequest): Promise<void> {
    try {
      // Store notification in database
      const notificationId = await this.storeNotification(request);

      // Queue for processing based on type and priority
      const queueName = this.getQueueName(request.type, request.priority);
      const channel = getChannel();

      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify({
        ...request,
        notificationId
      })), {
        persistent: true,
        priority: this.getPriorityValue(request.priority)
      });

      logger.info(`Notification queued: ${notificationId}`);
    } catch (error) {
      logger.error('Error sending notification:', error);
      throw error;
    }
  }

  async getUserPreferences(userId: string): Promise<any> {
    try {
      const query = `
        SELECT preferences FROM notification_preferences 
        WHERE user_id = $1
      `;
      
      const result = await executeQuery(query, [userId]);
      
      if (result.rows.length) {
        return result.rows[0].preferences;
      }

      // Return default preferences
      return {
        email: true,
        sms: false,
        push: true,
        newOffers: true,
        priceChanges: true,
        sectorUpdates: true,
        companyNews: false
      };
    } catch (error) {
      logger.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<void> {
    try {
      const query = `
        INSERT INTO notification_preferences (user_id, preferences)
        VALUES ($1, $2)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          preferences = $2,
          updated_at = NOW()
      `;

      await executeQuery(query, [userId, JSON.stringify(preferences)]);
      logger.info(`Updated preferences for user: ${userId}`);
    } catch (error) {
      logger.error('Error updating user preferences:', error);
      throw error;
    }
  }

  private async storeNotification(request: NotificationRequest): Promise<string> {
    const query = `
      INSERT INTO notifications (
        user_id, type, channel, subject, message, 
        template_id, template_data, priority, scheduled_at, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

    const params = [
      request.userId,
      request.type,
      request.channel,
      request.subject,
      request.message,
      request.templateId,
      JSON.stringify(request.templateData || {}),
      request.priority || 'medium',
      request.scheduledAt,
      JSON.stringify(request.metadata || {})
    ];

    const result = await executeQuery(query, params);
    return result.rows[0].id;
  }

  private getQueueName(type: string, priority?: string): string {
    const prioritySuffix = priority === 'urgent' ? '.urgent' : '';
    return `notifications.${type}${prioritySuffix}`;
  }

  private getPriorityValue(priority?: string): number {
    switch (priority) {
      case 'urgent': return 10;
      case 'high': return 7;
      case 'medium': return 5;
      case 'low': return 1;
      default: return 5;
    }
  }
}
