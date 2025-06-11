
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../middleware/validation';
import { getChannel } from '../config/rabbitmq';
import { analyticsResilienceService } from '../services/ResilienceService';
import { logger } from '../utils/logger';

const router = Router();

const eventSchema = Joi.object({
  eventType: Joi.string().required(),
  userId: Joi.string().uuid().optional(),
  sessionId: Joi.string().required(),
  sector: Joi.string().required(),
  country: Joi.string().required(),
  productId: Joi.string().uuid().optional(),
  companyId: Joi.string().uuid().optional(),
  properties: Joi.object().required(),
  metadata: Joi.object().optional()
});

router.post('/track', validateRequest(eventSchema), async (req, res) => {
  try {
    await analyticsResilienceService.executeWithResilience(
      async () => {
        const channel = getChannel();
        const event = {
          ...req.body,
          timestamp: new Date()
        };

        // Queue event for processing
        await channel.sendToQueue(
          'analytics.events',
          Buffer.from(JSON.stringify(event)),
          { persistent: true }
        );

        // Queue sector-specific event if banking
        if (event.sector === 'banque') {
          await channel.sendToQueue(
            'analytics.sector.banking',
            Buffer.from(JSON.stringify(event)),
            { persistent: true }
          );
        }

        return event;
      },
      'track-single-event',
      `event:${req.body.eventType}:${req.body.sessionId}`
    );

    logger.info(`Event tracked: ${req.body.eventType} for sector ${req.body.sector}`);

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    logger.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        error: 'Events must be an array'
      });
    }

    await analyticsResilienceService.executeWithResilience(
      async () => {
        const channel = getChannel();
        
        for (const event of events) {
          const eventWithTimestamp = {
            ...event,
            timestamp: new Date()
          };

          await channel.sendToQueue(
            'analytics.events',
            Buffer.from(JSON.stringify(eventWithTimestamp)),
            { persistent: true }
          );
        }

        return events.length;
      },
      'track-batch-events'
    );

    logger.info(`Batch of ${events.length} events tracked`);

    res.json({
      success: true,
      message: `${events.length} events tracked successfully`
    });
  } catch (error) {
    logger.error('Error tracking batch events:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health endpoint for resilience monitoring
router.get('/resilience/health', async (req, res) => {
  try {
    const health = analyticsResilienceService.getHealthStatus();
    const metrics = analyticsResilienceService.getMetrics();

    res.json({
      success: true,
      service: 'analytics',
      health,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching resilience health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resilience health'
    });
  }
});

export default router;
