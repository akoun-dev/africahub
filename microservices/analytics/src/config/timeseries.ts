
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { logger } from '../utils/logger';

const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
const token = process.env.INFLUXDB_TOKEN || '';
const org = process.env.INFLUXDB_ORG || 'analytics';
const bucket = process.env.INFLUXDB_BUCKET || 'events';

const client = new InfluxDB({ url, token });
const writeAPI = client.getWriteApi(org, bucket);
const queryAPI = client.getQueryApi(org);

export async function writePoints(points: any[]): Promise<void> {
  try {
    const influxPoints = points.map(point => {
      const p = new Point(point.measurement);
      
      // Add tags
      Object.entries(point.tags || {}).forEach(([key, value]) => {
        if (value) p.tag(key, String(value));
      });
      
      // Add fields
      Object.entries(point.fields || {}).forEach(([key, value]) => {
        if (typeof value === 'number') {
          p.floatField(key, value);
        } else if (typeof value === 'boolean') {
          p.booleanField(key, value);
        } else {
          p.stringField(key, String(value));
        }
      });
      
      if (point.timestamp) {
        p.timestamp(point.timestamp);
      }
      
      return p;
    });

    influxPoints.forEach(point => writeAPI.writePoint(point));
    await writeAPI.flush();
    
    logger.info(`Written ${points.length} points to InfluxDB`);
  } catch (error) {
    logger.error('Error writing to InfluxDB:', error);
    throw error;
  }
}

export async function queryData(fluxQuery: string): Promise<any[]> {
  try {
    const results: any[] = [];
    
    await new Promise((resolve, reject) => {
      queryAPI.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const record = tableMeta.toObject(row);
          results.push(record);
        },
        error: (error) => {
          logger.error('InfluxDB query error:', error);
          reject(error);
        },
        complete: () => {
          resolve(results);
        }
      });
    });
    
    return results;
  } catch (error) {
    logger.error('Error querying InfluxDB:', error);
    throw error;
  }
}

export function closeConnection(): void {
  writeAPI.close();
  client.close();
}
