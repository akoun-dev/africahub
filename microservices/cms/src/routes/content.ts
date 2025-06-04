
import { Router } from 'express';
import { ContentController } from '../controllers/contentController';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createContentSchema = Joi.object({
  content_key: Joi.string().required(),
  title: Joi.string().optional(),
  content: Joi.string().required(),
  metadata: Joi.object().optional(),
  country_code: Joi.string().optional(),
  language_code: Joi.string().required()
});

const updateContentSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  metadata: Joi.object().optional()
});

// Routes
router.get('/', ContentController.getAllContent);
router.get('/:contentKey', ContentController.getContent);
router.post('/', validateRequest(createContentSchema), ContentController.createContent);
router.put('/:id', validateRequest(updateContentSchema), ContentController.updateContent);
router.delete('/:id', ContentController.deleteContent);

export default router;
