
import { Router } from 'express';
import client from 'prom-client';

const router = Router();

// Create metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status_code']
});

const eventsProcessedTotal = new client.Counter({
  name: 'events_processed_total',
  help: 'Total number of events processed',
  labelNames: ['event_type', 'sector']
});

router.get('/', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;
