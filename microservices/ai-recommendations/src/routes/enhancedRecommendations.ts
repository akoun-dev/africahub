
import express from 'express';
import Joi from 'joi';
import { RecommendationEngine } from '../services/RecommendationEngine';
import { RecommendationModel } from '../models/RecommendationModel';
import { enhancedAIResilienceService } from '../services/EnhancedResilienceService';
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

// GET /api/v1/enhanced-recommendations/:userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { insurance_type, limit } = req.query;

    const recommendations = await enhancedAIResilienceService.executeUserDataRetrieval(
      () => RecommendationModel.getUserRecommendations(
        userId,
        insurance_type as string,
        limit ? parseInt(limit as string) : 10
      ),
      userId
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      metadata: {
        cached: false,
        resilience_applied: true
      }
    });
  } catch (error) {
    logger.error('Error fetching enhanced recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations',
      resilience_status: enhancedAIResilienceService.getHealthStatus()
    });
  }
});

// POST /api/v1/enhanced-recommendations/generate
router.post('/generate', validateRequest(generateRecommendationsSchema), async (req, res) => {
  try {
    const recommendations = await enhancedAIResilienceService.executeRecommendationGeneration(
      () => RecommendationEngine.generateRecommendations(req.body),
      req.body.user_id,
      req.body.insurance_type
    );

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      metadata: {
        cached: false,
        resilience_applied: true,
        operation_type: 'critical'
      }
    });
  } catch (error) {
    logger.error('Error generating enhanced recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      resilience_status: enhancedAIResilienceService.getHealthStatus()
    });
  }
});

// POST /api/v1/enhanced-recommendations/interaction
router.post('/interaction', validateRequest(updateInteractionSchema), async (req, res) => {
  try {
    const { recommendation_id, interaction_type } = req.body;

    await enhancedAIResilienceService.executeInteractionTracking(
      () => RecommendationModel.updateInteraction(recommendation_id, interaction_type)
    );

    res.json({
      success: true,
      message: 'Interaction updated successfully',
      metadata: {
        resilience_applied: true,
        operation_type: 'write'
      }
    });
  } catch (error) {
    logger.error('Error updating enhanced interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update interaction',
      resilience_status: enhancedAIResilienceService.getHealthStatus()
    });
  }
});

// GET /api/v1/enhanced-recommendations/:userId/metrics
router.get('/:userId/metrics', async (req, res) => {
  try {
    const { userId } = req.params;

    const metrics = await enhancedAIResilienceService.executeWithEnhancedResilience(
      () => RecommendationModel.getRecommendationMetrics(userId),
      'get-recommendation-metrics',
      'read',
      `metrics:${userId}`
    );

    res.json({
      success: true,
      data: metrics,
      resilience_metrics: enhancedAIResilienceService.getMetrics()
    });
  } catch (error) {
    logger.error('Error fetching enhanced recommendation metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics',
      resilience_status: enhancedAIResilienceService.getHealthStatus()
    });
  }
});

// GET /api/v1/enhanced-recommendations/resilience/detailed-health
router.get('/resilience/detailed-health', async (req, res) => {
  try {
    const health = enhancedAIResilienceService.getHealthStatus();
    const metrics = enhancedAIResilienceService.getMetrics();

    res.json({
      success: true,
      service: 'ai-recommendations-enhanced',
      health,
      detailed_metrics: {
        ...metrics,
        retry_by_operation: metrics.retry?.retriesByOperationType || {},
        contextual_success_rate: metrics.retry?.contextualSuccessRate || 1.0,
        operation_breakdown: metrics.operationMetrics || {}
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching detailed resilience health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detailed resilience health'
    });
  }
});

export default router;
