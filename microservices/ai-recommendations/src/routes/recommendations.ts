
import express from 'express';
import Joi from 'joi';
import { RecommendationEngine } from '../services/RecommendationEngine';
import { RecommendationModel } from '../models/RecommendationModel';
import { resilienceService } from '../services/ResilienceService';
import { logger } from '../utils/logger';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const generateRecommendationsSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  insurance_type: Joi.string().required(),
  preferences: Joi.object({
    budget_range: Joi.string().valid('low', 'medium', 'high'),
    risk_tolerance: Joi.string().valid('conservative', 'moderate', 'aggressive'),
    coverage_priorities: Joi.array().items(Joi.string())
  }),
  behavioral_data: Joi.object({
    recent_searches: Joi.array().items(Joi.string()),
    interaction_patterns: Joi.object()
  })
});

const updateInteractionSchema = Joi.object({
  recommendation_id: Joi.string().uuid().required(),
  interaction_type: Joi.string().valid('viewed', 'clicked', 'purchased').required()
});

// GET /api/v1/recommendations/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { insurance_type, limit } = req.query;

    const recommendations = await resilienceService.executeWithResilience(
      () => RecommendationModel.getUserRecommendations(
        userId,
        insurance_type as string,
        limit ? parseInt(limit as string) : 10
      ),
      'get-user-recommendations',
      `user-rec:${userId}:${insurance_type || 'all'}`
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    logger.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
});

// POST /api/v1/recommendations/generate
router.post('/generate', validateRequest(generateRecommendationsSchema), async (req, res) => {
  try {
    const recommendations = await resilienceService.executeWithResilience(
      () => RecommendationEngine.generateRecommendations(req.body),
      'generate-recommendations',
      `gen-rec:${req.body.user_id}:${req.body.insurance_type}`
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    logger.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// POST /api/v1/recommendations/interaction
router.post('/interaction', validateRequest(updateInteractionSchema), async (req, res) => {
  try {
    const { recommendation_id, interaction_type } = req.body;

    await resilienceService.executeWithResilience(
      () => RecommendationModel.updateInteraction(recommendation_id, interaction_type),
      'update-interaction'
    );

    res.json({
      success: true,
      message: 'Interaction updated successfully'
    });
  } catch (error) {
    logger.error('Error updating interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update interaction'
    });
  }
});

// GET /api/v1/recommendations/:userId/metrics
router.get('/:userId/metrics', async (req, res) => {
  try {
    const { userId } = req.params;

    const metrics = await resilienceService.executeWithResilience(
      () => RecommendationModel.getRecommendationMetrics(userId),
      'get-recommendation-metrics',
      `metrics:${userId}`
    );

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Error fetching recommendation metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics'
    });
  }
});

// GET /api/v1/recommendations/resilience/health
router.get('/resilience/health', async (req, res) => {
  try {
    const health = resilienceService.getHealthStatus();
    const metrics = resilienceService.getMetrics();

    res.json({
      success: true,
      health,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching resilience health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resilience health'
    });
  }
});

export default router;
