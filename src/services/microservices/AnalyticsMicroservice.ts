interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId?: string;
  sector: string;
  country: string;
  productId?: string;
  companyId?: string;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
}

interface MicroserviceConfig {
  baseUrl: string;
  wsUrl: string;
  apiKey?: string;
  timeout: number;
}

export class AnalyticsMicroservice {
  private config: MicroserviceConfig;
  private ws: WebSocket | null = null;

  constructor(config: MicroserviceConfig) {
    this.config = config;
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/events/track`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(event),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Event tracked successfully:', event.eventType);
    } catch (error) {
      console.error('Error tracking event:', error);
      await this.fallbackTracking(event);
    }
  }

  async trackBatch(events: AnalyticsEvent[]): Promise<void> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/events/batch`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ events }),
          signal: AbortSignal.timeout(this.config.timeout)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`Batch of ${events.length} events tracked successfully`);
    } catch (error) {
      console.error('Error tracking batch events:', error);
      // Fallback to individual tracking
      for (const event of events) {
        await this.fallbackTracking(event);
      }
    }
  }

  async getDashboard(sector: string, timeRange: string = '24h'): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/analytics/dashboard/${sector}?timeRange=${timeRange}`,
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
      console.error('Error fetching dashboard:', error);
      return this.getFallbackDashboard(sector);
    }
  }

  async getRealtimeMetrics(): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/analytics/realtime`,
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
      console.error('Error fetching realtime metrics:', error);
      return { today: { totalViews: 0, bankingViews: 0, insuranceViews: 0, quoteRequests: 0 } };
    }
  }

  connectRealtime(onMessage: (data: any) => void): void {
    try {
      this.ws = new WebSocket(this.config.wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to analytics realtime stream');
        this.ws?.send(JSON.stringify({ type: 'subscribe', channel: 'metrics' }));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('Disconnected from analytics realtime stream');
        // Reconnect after 5 seconds
        setTimeout(() => this.connectRealtime(onMessage), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to realtime stream:', error);
    }
  }

  disconnectRealtime(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
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

  private async fallbackTracking(event: AnalyticsEvent): Promise<void> {
    // Store in localStorage for offline tracking
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    storedEvents.push({
      ...event,
      timestamp: new Date().toISOString(),
      status: 'fallback'
    });
    
    // Keep only last 1000 events
    if (storedEvents.length > 1000) {
      storedEvents.splice(0, storedEvents.length - 1000);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
  }

  private getFallbackDashboard(sector: string): any {
    return {
      sector,
      totalEvents: 0,
      eventBreakdown: {},
      topProducts: [],
      conversionFunnel: { views: 0, comparisons: 0, quotes: 0, conversions: 0 },
      geographicDistribution: []
    };
  }
}

// Singleton instance
export const analyticsMicroservice = new AnalyticsMicroservice({
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com' 
    : 'http://localhost:8000/analytics',
  wsUrl: process.env.NODE_ENV === 'production'
    ? 'wss://api.yourdomain.com/analytics-ws'
    : 'ws://localhost:3004',
  timeout: 5000
});
