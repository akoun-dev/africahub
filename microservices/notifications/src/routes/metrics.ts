
import { Router } from 'express';
import client from 'prom-client';

const router = Router();

// Create metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status_code']
});

const notificationsSentTotal = new client.Counter({
  name: 'notifications_sent_total',
  help: 'Total number of notifications sent',
  labelNames: ['type', 'status']
});

router.get('/', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;
