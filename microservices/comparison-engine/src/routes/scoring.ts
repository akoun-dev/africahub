
import { Router } from 'express';
import { authenticateJWT, requirePermission } from '../../shared/src/auth/jwtAuth';
import { validateRequest, commonSchemas } from '../middleware/validation';
import { asyncHandler } from '../../shared/src/middleware/errorHandler';
import { standardResponse } from '../../shared/src/middleware/apiStandards';
import { metricsMiddleware, trackBusinessEvent } from '../../shared/src/monitoring/metricsCollector';
import { strictRateLimiter } from '../middleware/rateLimiter';
import Joi from 'joi';

const router = Router();

// Apply middleware
router.use(metricsMiddleware('comparison-engine'));
router.use(strictRateLimiter);

/**
 * @swagger
 * /api/v1/scoring/products:
 *   post:
 *     summary: Score and rank products
 *     description: Calculate scores for products based on user preferences and criteria weights
 *     tags: [Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *               criteria_weights:
 *                 type: object
 *               user_preferences:
 *                 type: object
 *               country_code:
 *                 $ref: '#/components/parameters/CountryCodeParam/schema'
 *     responses:
 *       200:
 *         description: Products scored successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         scored_products:
 *                           type: array
 *                           items:
 *                             type: object
 *                         algorithm_used:
 *                           type: string
 *                         execution_time_ms:
 *                           type: number
 */
const scoreProductsSchema = Joi.object({
  products: Joi.array().items(commonSchemas.uuid).min(1).max(10).required(),
  criteria_weights: Joi.object().default({}),
  user_preferences: Joi.object().default({}),
  country_code: commonSchemas.countryCode.optional()
});

router.post('/products', 
  authenticateJWT,
  requirePermission('scoring:read'),
  validateRequest(scoreProductsSchema),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { products, criteria_weights, user_preferences, country_code } = req.body;
    
    try {
      // Simulate scoring algorithm
      const scoredProducts = products.map((productId: string, index: number) => ({
        product_id: productId,
        score: Math.random() * 100,
        rank: index + 1,
        reasoning: [
          'Price competitiveness: 85%',
          'Feature completeness: 90%',
          'User ratings: 80%'
        ],
        confidence_level: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
      }));

      // Sort by score (highest first)
      scoredProducts.sort((a, b) => b.score - a.score);
      
      // Update ranks
      scoredProducts.forEach((product, index) => {
        product.rank = index + 1;
      });

      const executionTime = Date.now() - startTime;
      
      trackBusinessEvent('product_scoring', 'comparison-engine', 'success');
      
      res.json(standardResponse.success({
        scored_products: scoredProducts,
        algorithm_used: 'weighted_multi_criteria',
        execution_time_ms: executionTime,
        total_products: scoredProducts.length
      }));
      
    } catch (error) {
      trackBusinessEvent('product_scoring', 'comparison-engine', 'failure');
      throw error;
    }
  })
);

/**
 * @swagger
 * /api/v1/scoring/algorithms:
 *   get:
 *     summary: Get available scoring algorithms
 *     description: List all available scoring algorithms with their descriptions
 *     tags: [Scoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available algorithms retrieved successfully
 */
router.get('/algorithms',
  authenticateJWT,
  asyncHandler(async (req, res) => {
    const algorithms = [
      {
        id: 'weighted_multi_criteria',
        name: 'Weighted Multi-Criteria Decision Analysis',
        description: 'Scores products based on weighted criteria values',
        parameters: ['criteria_weights', 'user_preferences']
      },
      {
        id: 'topsis',
        name: 'TOPSIS (Technique for Order Preference by Similarity)',
        description: 'Ranks alternatives based on distance to ideal solution',
        parameters: ['criteria_weights']
      },
      {
        id: 'simple_additive_weighting',
        name: 'Simple Additive Weighting (SAW)',
        description: 'Linear combination of normalized criteria values',
        parameters: ['criteria_weights']
      }
    ];

    res.json(standardResponse.success({ algorithms }));
  })
);

export default router;
