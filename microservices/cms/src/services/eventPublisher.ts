
import { publishEvent } from '../config/rabbitmq';
import { logger } from '../utils/logger';

export class EventPublisher {
  async publishContentCreated(contentId: string, contentKey: string, country?: string, sector?: string): Promise<void> {
    try {
      await publishEvent('content.created', {
        contentId,
        contentKey,
        country,
        sector
      });
    } catch (error) {
      logger.error('Error publishing content.created event:', error);
    }
  }

  async publishContentUpdated(contentId: string, contentKey: string, country?: string, sector?: string): Promise<void> {
    try {
      await publishEvent('content.updated', {
        contentId,
        contentKey,
        country,
        sector
      });
    } catch (error) {
      logger.error('Error publishing content.updated event:', error);
    }
  }

  async publishContentDeleted(contentId: string, contentKey: string): Promise<void> {
    try {
      await publishEvent('content.deleted', {
        contentId,
        contentKey
      });
    } catch (error) {
      logger.error('Error publishing content.deleted event:', error);
    }
  }

  async publishContentPublished(contentId: string, contentKey: string, country?: string, sector?: string): Promise<void> {
    try {
      await publishEvent('content.published', {
        contentId,
        contentKey,
        country,
        sector
      });
    } catch (error) {
      logger.error('Error publishing content.published event:', error);
    }
  }
}
