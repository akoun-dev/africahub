
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../shared/src/middleware/errorHandler';

export const validateRequest = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const validationError = new ValidationError(
        'Request validation failed',
        error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
      );
      return next(validationError);
    }
    
    // Replace the request property with the validated value
    req[property] = value;
    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  }),
  
  countryCode: Joi.string().length(2).uppercase().pattern(/^[A-Z]{2}$/),
  
  uuid: Joi.string().uuid(),
  
  email: Joi.string().email(),
  
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  
  currency: Joi.string().length(3).uppercase(),
  
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
};
