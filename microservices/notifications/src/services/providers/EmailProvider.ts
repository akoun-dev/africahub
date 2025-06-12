
import { Resend } from 'resend';
import { logger } from '../../utils/logger';
import { NotificationRequest } from '../NotificationService';

export class EmailProvider {
  private resend: Resend;

  async initialize(): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
      logger.warn('RESEND_API_KEY not configured, email notifications disabled');
      return;
    }
    
    this.resend = new Resend(process.env.RESEND_API_KEY);
    logger.info('Email provider initialized');
  }

  async send(request: NotificationRequest): Promise<void> {
    if (!this.resend) {
      logger.warn('Email provider not initialized');
      return;
    }

    try {
      const result = await this.resend.emails.send({
        from: 'InsuranceApp <notifications@insuranceapp.com>',
        to: [request.channel],
        subject: request.subject || 'Notification',
        html: this.formatMessage(request.message, request.templateData),
      });

      logger.info(`Email sent successfully: ${result.id}`);
    } catch (error) {
      logger.error('Failed to send email:', error);
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
