
import express from 'express';
import promClient from 'prom-client';

const router = express.Router();

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const recommendationGenerationCounter = new promClient.Counter({
  name: 'recommendations_generated_total',
  help: 'Total number of recommendations generated',
  labelNames: ['insurance_type', 'user_id']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(recommendationGenerationCounter);

router.get('/', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

export default router;
export { httpRequestDuration, recommendationGenerationCounter };
