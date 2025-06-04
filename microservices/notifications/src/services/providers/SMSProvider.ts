
import { Twilio } from 'twilio';
import { logger } from '../../utils/logger';
import { NotificationRequest } from '../NotificationService';

export class SMSProvider {
  private twilio: Twilio;

  async initialize(): Promise<void> {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      logger.warn('Twilio credentials not configured, SMS notifications disabled');
      return;
    }
    
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    logger.info('SMS provider initialized');
  }

  async send(request: NotificationRequest): Promise<void> {
    if (!this.twilio) {
      logger.warn('SMS provider not initialized');
      return;
    }

    try {
      const result = await this.twilio.messages.create({
        body: this.formatMessage(request.message, request.templateData),
        from: process.env.TWILIO_PHONE_NUMBER,
        to: request.channel,
      });

      logger.info(`SMS sent successfully: ${result.sid}`);
    } catch (error) {
      logger.error('Failed to send SMS:', error);
      throw error;
    }
  }

  private formatMessage(message: string, templateData?: Record<string, any>): string {
    if (!templateData) return message;

    let formattedMessage = message;
    Object.entries(templateData).forEach(([key, value]) => {
      formattedMessage = formattedMessage.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(value)
      );
    });

    return formattedMessage;
  }
}
