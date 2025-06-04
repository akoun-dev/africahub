
import WebSocket from 'ws';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';

export class RealtimeStreaming {
  private wss: WebSocket.Server;
  private clients: Set<WebSocket> = new Set();

  async start(): Promise<void> {
    this.wss = new WebSocket.Server({ port: 3004 });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);
      logger.info('New WebSocket client connected');

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          await this.handleClientMessage(ws, data);
        } catch (error) {
          logger.error('Error handling WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        logger.info('WebSocket client disconnected');
      });
    });

    // Start real-time metrics broadcasting
    setInterval(() => {
      this.broadcastMetrics();
    }, 5000); // Every 5 seconds

    logger.info('Realtime streaming service started on port 3004');
  }

  private async handleClientMessage(ws: WebSocket, data: any): Promise<void> {
    if (data.type === 'subscribe') {
      // Handle subscription to specific metrics
      ws.send(JSON.stringify({
        type: 'subscribed',
        channel: data.channel
      }));
    } else if (data.type === 'unsubscribe') {
      // Handle unsubscription
      ws.send(JSON.stringify({
        type: 'unsubscribed',
        channel: data.channel
      }));
    }
  }

  private async broadcastMetrics(): Promise<void> {
    try {
      const metrics = await this.getRealtimeMetrics();
      
      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'metrics_update',
            data: metrics,
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (error) {
      logger.error('Error broadcasting metrics:', error);
    }
  }

  private async getRealtimeMetrics(): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();

    // Get current counters from Redis
    const [
      totalViews,
      bankingViews,
      insuranceViews,
      quoteRequests,
      comparisons
    ] = await Promise.all([
      redisClient.get(`analytics:daily:${today}:product_view`),
      redisClient.get(`analytics:daily:${today}:sector:banque`),
      redisClient.get(`analytics:daily:${today}:sector:assurance`),
      redisClient.get(`analytics:daily:${today}:quote_requested`),
      redisClient.get(`analytics:daily:${today}:comparison_started`)
    ]);

    return {
      today: {
        totalViews: parseInt(totalViews || '0'),
        bankingViews: parseInt(bankingViews || '0'),
        insuranceViews: parseInt(insuranceViews || '0'),
        quoteRequests: parseInt(quoteRequests || '0'),
        comparisons: parseInt(comparisons || '0')
      },
      currentHour: hour,
      lastUpdate: new Date().toISOString()
    };
  }

  public broadcastEvent(event: any): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'live_event',
          data: event,
          timestamp: new Date().toISOString()
        }));
      }
    });
  }
}
