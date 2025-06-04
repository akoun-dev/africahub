
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  phone: Joi.string().optional(),
  country: Joi.string().optional(),
  default_language: Joi.string().optional(),
  default_currency: Joi.string().optional(),
  timezone: Joi.string().optional(),
  theme: Joi.string().valid('light', 'dark').optional()
});

const updatePreferencesSchema = Joi.object({
  insurance_type: Joi.string().required(),
  budget_range: Joi.string().optional(),
  risk_tolerance: Joi.string().optional(),
  coverage_priorities: Joi.object().optional()
});

// REST Routes
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), UserController.updateProfile);
router.get('/preferences', authenticateToken, UserController.getPreferences);
router.put('/preferences', authenticateToken, validateRequest(updatePreferencesSchema), UserController.updatePreferences);
router.get('/interactions', authenticateToken, UserController.getUserInteractions);
router.post('/interactions', authenticateToken, UserController.trackInteraction);

export default router;
