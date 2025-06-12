
import amqp from 'amqplib';
import { logger } from '../utils/logger';

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connectRabbitMQ(): Promise<void> {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    
    // Declare queues
    await channel.assertQueue('analytics.events', { durable: true });
    await channel.assertQueue('analytics.sector.banking', { durable: true });
    await channel.assertQueue('analytics.sector.insurance', { durable: true });
    
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export function getChannel(): amqp.Channel {
  return channel;
}

export function getConnection(): amqp.Connection {
  return connection;
}
