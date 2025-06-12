
import { z } from 'zod';

// Schemas de validation communs
export const emailSchema = z.string()
  .email('Adresse email invalide')
  .min(1, 'Email requis');

export const passwordSchema = z.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

export const nameSchema = z.string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères')
  .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes');

// Schemas pour les entités
export const userProfileSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  phone: z.string()
    .regex(/^[\d\s+()-]+$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  country: z.string().min(2).max(3).optional(),
  default_language: z.enum(['fr', 'en', 'ar', 'pt']).optional(),
  default_currency: z.string().length(3).optional(),
  theme: z.enum(['light', 'dark']).optional()
});

export const adminUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['admin', 'moderator', 'super-admin']).default('admin')
});

export const productSchema = z.object({
  name: z.string().min(1, 'Nom du produit requis'),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive('Le prix doit être positif').optional(),
  currency: z.string().length(3).default('XOF'),
  image_url: z.string().url('URL invalide').optional(),
  purchase_link: z.string().url('URL invalide').optional(),
  country_availability: z.array(z.string()).default([]),
  is_active: z.boolean().default(true)
});

export const companySchema = z.object({
  name: z.string().min(1, 'Nom de l\'entreprise requis'),
  slug: z.string().min(1, 'Slug requis'),
  description: z.string().optional(),
  website_url: z.string().url('URL invalide').optional(),
  contact_email: emailSchema.optional(),
  contact_phone: z.string().optional(),
  country_availability: z.array(z.string()).default([]),
  sectors: z.array(z.string()).default([]),
  is_partner: z.boolean().default(false),
  commission_rate: z.number().min(0).max(100).optional()
});

// Utilitaires de validation
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: Record<string, string>; 
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Erreur de validation' } };
  }
};

export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown): T | null => {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
};
