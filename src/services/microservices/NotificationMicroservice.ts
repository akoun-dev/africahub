
interface NotificationRequest {
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

interface MicroserviceConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
}

export class NotificationMicroservice {
  private config: MicroserviceConfig;

  constructor(config: MicroserviceConfig) {
    this.config = config;
  }

  async sendNotification(request: NotificationRequest): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/notifications/send`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(request),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Notification sent successfully:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
      // Fallback to existing notification system
      await this.fallbackNotification(request);
    }
  }

  async getUserPreferences(userId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/preferences/${userId}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return {
        email: true,
        sms: false,
        push: true
      };
    }
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/preferences/${userId}`,
        {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(preferences),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  private async fallbackNotification(request: NotificationRequest): Promise<void> {
    // Fallback to existing notification system
    console.log('Using fallback notification system for:', request);
    
    // You can implement fallback logic here
    // For example, storing in localStorage or using existing services
    const existingNotifications = JSON.parse(
      localStorage.getItem('notifications') || '[]'
    );
    
    existingNotifications.push({
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'fallback'
    });
    
    localStorage.setItem('notifications', JSON.stringify(existingNotifications));
  }
}

// Singleton instance
export const notificationMicroservice = new NotificationMicroservice({
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com' 
    : 'http://localhost:8000/notifications', // Kong API Gateway
  timeout: 5000
});
