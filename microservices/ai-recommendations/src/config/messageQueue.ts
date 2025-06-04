
import amqp from 'amqplib';
import { logger } from '../utils/logger';

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function setupMessageQueue(): Promise<void> {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();
    
    // Declare queues for AI recommendations
    await channel.assertQueue('ai.recommendations.generate', { durable: true });
    await channel.assertQueue('ai.recommendations.update', { durable: true });
    await channel.assertQueue('ai.behavioral.analysis', { durable: true });
    
    logger.info('Message queue setup completed');
  } catch (error) {
    logger.error('Failed to setup message queue:', error);
    throw error;
  }
}

export function getChannel(): amqp.Channel {
  return channel;
}

export function getConnection(): amqp.Connection {
  return connection;
}

export async function publishMessage(queue: string, message: any): Promise<void> {
  try {
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
  } catch (error) {
    logger.error('Failed to publish message:', error);
    throw error;
  }
}
