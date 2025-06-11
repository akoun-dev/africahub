
import { Router } from 'express';
import { redisClient } from '../config/redis';
import { queryTimeSeries } from '../config/timeseries';
import { logger } from '../utils/logger';

const router = Router();

router.get('/dashboard/:sector', async (req, res) => {
  try {
    const { sector } = req.params;
    const { timeRange = '24h' } = req.query;

    const dashboard = await generateSectorDashboard(sector, timeRange as string);

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Error generating dashboard:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/realtime', async (req, res) => {
  try {
    const realtimeMetrics = await getRealtimeMetrics();

    res.json({
      success: true,
      data: realtimeMetrics
    });
  } catch (error) {
    logger.error('Error getting realtime metrics:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/kpis/:sector', async (req, res) => {
  try {
    const { sector } = req.params;
    const { period = 'today' } = req.query;

    const kpis = await getSectorKPIs(sector, period as string);

    res.json({
      success: true,
      data: kpis
    });
  } catch (error) {
    logger.error('Error getting KPIs:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

async function generateSectorDashboard(sector: string, timeRange: string): Promise<any> {
  const now = new Date();
  let startTime: Date;

  switch (timeRange) {
    case '1h':
      startTime = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  // Query time-series data
  const events = await queryTimeSeries(`
    SELECT * FROM user_events 
    WHERE sector = '${sector}' 
    AND time >= '${startTime.toISOString()}'
    AND time <= '${now.toISOString()}'
  `);

  // Aggregate data
  const eventCounts = events.reduce((acc: any, event: any) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {});

  return {
    sector,
    timeRange,
    totalEvents: events.length,
    eventBreakdown: eventCounts,
    topProducts: await getTopProductsBySector(sector, timeRange),
    conversionFunnel: await getConversionFunnel(sector, timeRange),
    geographicDistribution: await getGeographicDistribution(sector, timeRange)
  };
}

async function getRealtimeMetrics(): Promise<any> {
  const today = new Date().toISOString().split('T')[0];
  
  const [
    totalViews,
    bankingViews,
    insuranceViews,
    quoteRequests
  ] = await Promise.all([
    redisClient.get(`analytics:daily:${today}:product_view`),
    redisClient.get(`analytics:daily:${today}:sector:banque`),
    redisClient.get(`analytics:daily:${today}:sector:assurance`),
    redisClient.get(`analytics:daily:${today}:quote_requested`)
  ]);

  return {
    today: {
      totalViews: parseInt(totalViews || '0'),
      bankingViews: parseInt(bankingViews || '0'),
      insuranceViews: parseInt(insuranceViews || '0'),
      quoteRequests: parseInt(quoteRequests || '0')
    },
    timestamp: new Date().toISOString()
  };
}

async function getSectorKPIs(sector: string, period: string): Promise<any> {
  const today = new Date().toISOString().split('T')[0];
  
  const kpis = await Promise.all([
    redisClient.get(`kpi:${sector}:${today}:product_views`),
    redisClient.get(`kpi:${sector}:${today}:quote_requests`),
    redisClient.get(`kpi:${sector}:${today}:comparisons`)
  ]);

  return {
    sector,
    period,
    productViews: parseInt(kpis[0] || '0'),
    quoteRequests: parseInt(kpis[1] || '0'),
    comparisons: parseInt(kpis[2] || '0'),
    conversionRate: kpis[0] && kpis[1] ? 
      ((parseInt(kpis[1]) / parseInt(kpis[0])) * 100).toFixed(2) : '0'
  };
}

async function getTopProductsBySector(sector: string, timeRange: string): Promise<any[]> {
  // Implementation would query time-series for top products
  return [];
}

async function getConversionFunnel(sector: string, timeRange: string): Promise<any> {
  // Implementation would calculate conversion funnel metrics
  return {
    views: 0,
    comparisons: 0,
    quotes: 0,
    conversions: 0
  };
}

async function getGeographicDistribution(sector: string, timeRange: string): Promise<any[]> {
  // Implementation would query geographic distribution
  return [];
}

export default router;
