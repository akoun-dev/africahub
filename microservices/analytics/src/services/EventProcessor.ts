
import { executeQuery } from '../config/database';
import { logger } from '../utils/logger';
import { writePoints } from '../config/timeseries';

export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId?: string;
  sector: string;
  country: string;
  productId?: string;
  companyId?: string;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export class EventProcessor {
  static async processEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Store in PostgreSQL for relational queries
      await this.storeInPostgres(event);

      // Store in InfluxDB for time-series analysis
      await this.storeInInfluxDB(event);

      logger.info(`Processed event: ${event.eventType}`);
    } catch (error) {
      logger.error('Error processing event:', error);
      throw error;
    }
  }

  static async processBatch(events: AnalyticsEvent[]): Promise<void> {
    try {
      // Process events in parallel for better performance
      await Promise.all(events.map(event => this.processEvent(event)));
      logger.info(`Processed batch of ${events.length} events`);
    } catch (error) {
      logger.error('Error processing event batch:', error);
      throw error;
    }
  }

  private static async storeInPostgres(event: AnalyticsEvent): Promise<void> {
    const query = `
      INSERT INTO analytics_events (
        event_type, user_id, session_id, sector, country,
        product_id, company_id, properties, metadata, timestamp
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const params = [
      event.eventType,
      event.userId,
      event.sessionId,
      event.sector,
      event.country,
      event.productId,
      event.companyId,
      JSON.stringify(event.properties),
      JSON.stringify(event.metadata || {}),
      event.timestamp || new Date()
    ];

    await executeQuery(query, params);
  }

  private static async storeInInfluxDB(event: AnalyticsEvent): Promise<void> {
    const point = {
      measurement: 'events',
      tags: {
        event_type: event.eventType,
        sector: event.sector,
        country: event.country,
        product_id: event.productId || '',
        company_id: event.companyId || ''
      },
      fields: {
        user_id: event.userId || '',
        session_id: event.sessionId || '',
        ...event.properties
      },
      timestamp: event.timestamp || new Date()
    };

    await writePoints([point]);
  }

  static async getDashboardData(sector: string, timeRange: string = '24h'): Promise<any> {
    try {
      const timeFilter = this.getTimeFilter(timeRange);
      
      // Get event counts
      const eventCountQuery = `
        SELECT event_type, COUNT(*) as count
        FROM analytics_events 
        WHERE sector = $1 AND timestamp >= $2
        GROUP BY event_type
        ORDER BY count DESC
      `;

      const eventCounts = await executeQuery(eventCountQuery, [sector, timeFilter]);

      // Get top products
      const topProductsQuery = `
        SELECT product_id, COUNT(*) as interactions
        FROM analytics_events 
        WHERE sector = $1 AND timestamp >= $2 AND product_id IS NOT NULL
        GROUP BY product_id
        ORDER BY interactions DESC
        LIMIT 10
      `;

      const topProducts = await executeQuery(topProductsQuery, [sector, timeFilter]);

      // Get conversion funnel
      const funnelQuery = `
        SELECT 
          SUM(CASE WHEN event_type = 'product_view' THEN 1 ELSE 0 END) as views,
          SUM(CASE WHEN event_type = 'product_compare' THEN 1 ELSE 0 END) as comparisons,
          SUM(CASE WHEN event_type = 'quote_request' THEN 1 ELSE 0 END) as quotes,
          SUM(CASE WHEN event_type = 'conversion' THEN 1 ELSE 0 END) as conversions
        FROM analytics_events 
        WHERE sector = $1 AND timestamp >= $2
      `;

      const funnel = await executeQuery(funnelQuery, [sector, timeFilter]);

      return {
        sector,
        timeRange,
        totalEvents: eventCounts.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        eventBreakdown: eventCounts.rows.reduce((acc, row) => {
          acc[row.event_type] = parseInt(row.count);
          return acc;
        }, {}),
        topProducts: topProducts.rows,
        conversionFunnel: funnel.rows[0] || { views: 0, comparisons: 0, quotes: 0, conversions: 0 }
      };
    } catch (error) {
      logger.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  private static getTimeFilter(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }
}
