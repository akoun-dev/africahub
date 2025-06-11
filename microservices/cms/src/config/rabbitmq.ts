
import amqp, { Connection, Channel } from 'amqplib';
import { logger } from '../utils/logger';

let connection: Connection;
let channel: Channel;

export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();

    // Declare exchanges and queues
    await channel.assertExchange('cms_events', 'topic', { durable: true });
    await channel.assertQueue('content_updated', { durable: true });
    await channel.assertQueue('template_updated', { durable: true });
    await channel.assertQueue('cache_invalidation', { durable: true });

    // Bind queues to exchanges
    await channel.bindQueue('content_updated', 'cms_events', 'content.*');
    await channel.bindQueue('template_updated', 'cms_events', 'template.*');
    await channel.bindQueue('cache_invalidation', 'cms_events', 'cache.*');

    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export async function publishEvent(routingKey: string, data: any): Promise<void> {
  try {
    const message = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      service: 'cms'
    });

    await channel.publish('cms_events', routingKey, Buffer.from(message), {
      persistent: true
    });

    logger.info(`Published event: ${routingKey}`);
  } catch (error) {
    logger.error('Failed to publish event:', error);
  }
}

export function getChannel(): Channel {
  return channel;
}

connection?.on('error', (err) => {
  logger.error('RabbitMQ connection error:', err);
});

connection?.on('close', () => {
  logger.warn('RabbitMQ connection closed');
});
