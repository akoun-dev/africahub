
import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  brand: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  currency: Joi.string().length(3).optional(),
  image_url: Joi.string().uri().optional(),
  purchase_link: Joi.string().uri().optional(),
  product_type_id: Joi.string().uuid().required(),
  company_id: Joi.string().uuid().required(),
  country_availability: Joi.array().items(Joi.string()),
  is_active: Joi.boolean().optional()
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  brand: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  currency: Joi.string().length(3).optional(),
  image_url: Joi.string().uri().optional(),
  purchase_link: Joi.string().uri().optional(),
  country_availability: Joi.array().items(Joi.string()),
  is_active: Joi.boolean().optional()
});

// REST Routes
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', validateRequest(createProductSchema), ProductController.createProduct);
router.put('/:id', validateRequest(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

// Advanced endpoints
router.get('/sector/:sectorSlug', ProductController.getProductsBySector);
router.get('/country/:countryCode', ProductController.getProductsByCountry);
router.post('/bulk', ProductController.bulkCreateProducts);
router.post('/:id/duplicate', ProductController.duplicateProduct);

export default router;
