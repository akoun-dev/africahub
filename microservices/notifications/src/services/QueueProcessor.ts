
import { getChannel } from '../config/rabbitmq';
import { NotificationService } from './NotificationService';
import { logger } from '../utils/logger';

export class QueueProcessor {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  async start(): Promise<void> {
    const channel = getChannel();

    // Process email notifications
    await channel.consume('notifications.email', async (msg) => {
      if (msg) {
        try {
          const request = JSON.parse(msg.content.toString());
          await this.notificationService.sendEmail(request);
          channel.ack(msg);
          logger.info(`Email notification processed for user ${request.userId}`);
        } catch (error) {
          logger.error('Failed to process email notification:', error);
          channel.nack(msg, false, false);
        }
      }
    });

    // Process SMS notifications
    await channel.consume('notifications.sms', async (msg) => {
      if (msg) {
        try {
          const request = JSON.parse(msg.content.toString());
          await this.notificationService.sendSMS(request);
          channel.ack(msg);
          logger.info(`SMS notification processed for user ${request.userId}`);
        } catch (error) {
          logger.error('Failed to process SMS notification:', error);
          channel.nack(msg, false, false);
        }
      }
    });

    // Process push notifications
    await channel.consume('notifications.push', async (msg) => {
      if (msg) {
        try {
          const request = JSON.parse(msg.content.toString());
          await this.notificationService.sendPush(request);
          channel.ack(msg);
          logger.info(`Push notification processed for user ${request.userId}`);
        } catch (error) {
          logger.error('Failed to process push notification:', error);
          channel.nack(msg, false, false);
        }
      }
    });

    logger.info('Queue processor started');
  }
}
