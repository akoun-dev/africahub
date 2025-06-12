
import { Pool } from 'pg';
import { logger } from '../utils/logger';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cms_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    logger.info('Connected to PostgreSQL database');
    client.release();

    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

async function createTables(): Promise<void> {
  const createTablesQuery = `
    -- Content table
    CREATE TABLE IF NOT EXISTS cms_content (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content_key VARCHAR(255) NOT NULL,
      content_type VARCHAR(100) NOT NULL,
      title TEXT,
      content TEXT,
      metadata JSONB DEFAULT '{}',
      country_code VARCHAR(10),
      sector_slug VARCHAR(100),
      language_code VARCHAR(10) NOT NULL DEFAULT 'en',
      status VARCHAR(50) DEFAULT 'draft',
      version INTEGER DEFAULT 1,
      published_at TIMESTAMP,
      expires_at TIMESTAMP,
      created_by VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(content_key, country_code, sector_slug, language_code)
    );

    -- Templates table
    CREATE TABLE IF NOT EXISTS cms_templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      template_name VARCHAR(255) NOT NULL UNIQUE,
      template_type VARCHAR(100) NOT NULL,
      template_content TEXT NOT NULL,
      variables JSONB DEFAULT '[]',
      country_code VARCHAR(10),
      sector_slug VARCHAR(100),
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Content versions table
    CREATE TABLE IF NOT EXISTS cms_content_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content_id UUID REFERENCES cms_content(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      content_data JSONB NOT NULL,
      created_by VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Content analytics table
    CREATE TABLE IF NOT EXISTS cms_content_analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      content_id UUID REFERENCES cms_content(id) ON DELETE CASCADE,
      country_code VARCHAR(10),
      sector_slug VARCHAR(100),
      views INTEGER DEFAULT 0,
      engagement_score DECIMAL(5,2) DEFAULT 0,
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(content_id, country_code, sector_slug, date)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_cms_content_key ON cms_content(content_key);
    CREATE INDEX IF NOT EXISTS idx_cms_content_country ON cms_content(country_code);
    CREATE INDEX IF NOT EXISTS idx_cms_content_sector ON cms_content(sector_slug);
    CREATE INDEX IF NOT EXISTS idx_cms_content_language ON cms_content(language_code);
    CREATE INDEX IF NOT EXISTS idx_cms_content_status ON cms_content(status);
    CREATE INDEX IF NOT EXISTS idx_cms_templates_type ON cms_templates(template_type);
  `;

  try {
    await pool.query(createTablesQuery);
    logger.info('Database tables created/verified successfully');
  } catch (error) {
    logger.error('Failed to create database tables:', error);
    throw error;
  }
}

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});
