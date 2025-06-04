
import * as admin from 'firebase-admin';
import { logger } from '../../utils/logger';
import { NotificationRequest } from '../NotificationService';

export class PushProvider {
  private app: admin.app.App;

  async initialize(): Promise<void> {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
      logger.warn('Firebase credentials not configured, push notifications disabled');
      return;
    }

    try {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      logger.info('Push provider initialized');
    } catch (error) {
      logger.error('Failed to initialize Firebase:', error);
    }
  }

  async send(request: NotificationRequest): Promise<void> {
    if (!this.app) {
      logger.warn('Push provider not initialized');
      return;
    }

    try {
      const message = {
        token: request.channel,
        notification: {
          title: request.subject || 'Notification',
          body: this.formatMessage(request.message, request.templateData),
        },
        data: request.metadata || {},
      };

      const result = await admin.messaging().send(message);
      logger.info(`Push notification sent successfully: ${result}`);
    } catch (error) {
      logger.error('Failed to send push notification:', error);
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
