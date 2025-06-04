
import { Router } from 'express';
import { ComparisonController } from '../controllers/comparisonController';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const compareProductsSchema = Joi.object({
  product_ids: Joi.array().items(Joi.string().uuid()).min(2).max(5).required(),
  criteria_weights: Joi.object().optional(),
  user_preferences: Joi.object().optional(),
  country_code: Joi.string().length(2).optional()
});

const getRecommendationsSchema = Joi.object({
  sector_slug: Joi.string().required(),
  country_code: Joi.string().length(2).required(),
  user_preferences: Joi.object().optional(),
  limit: Joi.number().min(1).max(10).optional()
});

// REST Routes
router.post('/products', validateRequest(compareProductsSchema), ComparisonController.compareProducts);
router.post('/recommendations', validateRequest(getRecommendationsSchema), ComparisonController.getRecommendations);
router.get('/matrix/:sectorSlug', ComparisonController.getComparisonMatrix);
router.post('/score', ComparisonController.scoreProducts);

export default router;
