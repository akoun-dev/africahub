
import { Pool } from 'pg';
import { logger } from '../utils/logger';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'analytics',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function connectDatabase(): Promise<void> {
  try {
    await pool.connect();
    logger.info('Connected to PostgreSQL database');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}
