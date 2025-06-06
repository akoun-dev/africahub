/**
 * Types pour le système de gestion des profils utilisateurs AfricaHub
 * Définit les 4 types de profils et leurs permissions
 */

// Types de profils utilisateurs
export type UserProfileType = 
  | 'simple_user'      // Utilisateur Simple: inscription libre, comparaison produits, avis, favoris
  | 'merchant'         // Marchand: inscription libre, gestion catalogue, réponse aux avis
  | 'manager'          // Gestionnaire: attribué par admin, modération contenu
  | 'administrator';   // Administrateur: tous droits, gestion utilisateurs

// Statuts des profils
export type ProfileStatus = 
  | 'pending'          // En attente de validation
  | 'active'           // Actif
  | 'suspended'        // Suspendu
  | 'banned';          // Banni

// Interface principale du profil utilisateur
export interface UserProfile {
  id: string;
  user_id: string;
  profile_type: UserProfileType;
  status: ProfileStatus;
  
  // Informations personnelles
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  
  // Informations géographiques
  country_code?: string;
  city?: string;
  address?: string;
  
  // Informations professionnelles (pour marchands)
  company_name?: string;
  company_description?: string;
  business_license?: string;
  tax_number?: string;
  
  // Métadonnées
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified_at?: string;
}

// Interface pour les permissions
export interface ProfilePermission {
  id: string;
  profile_type: UserProfileType;
  permission_name: string;
  permission_description?: string;
  is_active: boolean;
  created_at: string;
}

// Interface pour l'assignation de rôles
export interface UserRoleAssignment {
  id: string;
  user_id: string;
  assigned_by: string;
  role_type: UserProfileType;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

// Interface pour les favoris
export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  category?: string;
  created_at: string;
}

// Interface pour les avis produits
export interface ProductReview {
  id: string;
  user_id: string;
  product_id: string;
  merchant_id?: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
  
  // Métadonnées de modération
  is_verified: boolean;
  is_featured: boolean;
  moderated_by?: string;
  moderated_at?: string;
  moderation_notes?: string;
  
  created_at: string;
  updated_at: string;
}

// Interface pour les réponses marchands
export interface ReviewResponse {
  id: string;
  review_id: string;
  merchant_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Interface pour les catalogues marchands
export interface MerchantCatalog {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour les produits marchands
export interface MerchantProduct {
  id: string;
  catalog_id: string;
  merchant_id: string;
  name: string;
  description?: string;
  price?: number;
  currency: string;
  
  // Images et médias
  images: string[];
  specifications: Record<string, any>;
  
  // Statut et visibilité
  is_active: boolean;
  is_featured: boolean;
  stock_quantity: number;
  
  // SEO et recherche
  slug?: string;
  tags: string[];
  
  created_at: string;
  updated_at: string;
}

// Types pour les formulaires d'inscription
export interface SimpleUserRegistration {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  country_code?: string;
  city?: string;
  phone?: string;
}

export interface MerchantRegistration extends SimpleUserRegistration {
  company_name: string;
  company_description?: string;
  business_license?: string;
  tax_number?: string;
  address?: string;
}

// Types pour les contextes d'authentification
export interface AuthUser {
  id: string;
  email: string;
  profile?: UserProfile;
  permissions: string[];
}

// Types pour les permissions par profil
export const PROFILE_PERMISSIONS = {
  simple_user: [
    'view_products',
    'create_reviews', 
    'manage_favorites',
    'update_profile'
  ],
  merchant: [
    'view_products',
    'create_reviews',
    'manage_favorites', 
    'update_profile',
    'manage_catalog',
    'respond_reviews',
    'view_analytics'
  ],
  manager: [
    'view_products',
    'moderate_content',
    'verify_products',
    'manage_reviews',
    'view_reports'
  ],
  administrator: [
    'full_access',
    'manage_users',
    'assign_roles',
    'configure_platform',
    'resolve_disputes',
    'view_analytics',
    'manage_content'
  ]
} as const;

// Types pour les labels des profils
export const PROFILE_LABELS = {
  simple_user: 'Utilisateur Simple',
  merchant: 'Marchand',
  manager: 'Gestionnaire',
  administrator: 'Administrateur'
} as const;

// Types pour les descriptions des profils
export const PROFILE_DESCRIPTIONS = {
  simple_user: 'Peut s\'inscrire, comparer produits, laisser avis, gérer favoris',
  merchant: 'Peut s\'inscrire, gérer catalogue produits, répondre aux avis, voir statistiques',
  manager: 'Attribué par admin, modère contenu, vérifie conformité produits',
  administrator: 'Tous droits, gère utilisateurs, configure plateforme, résout litiges'
} as const;

// Types pour les couleurs des profils (pour l'UI)
export const PROFILE_COLORS = {
  simple_user: 'bg-blue-100 text-blue-800',
  merchant: 'bg-green-100 text-green-800',
  manager: 'bg-orange-100 text-orange-800',
  administrator: 'bg-red-100 text-red-800'
} as const;

// Types pour les icônes des profils
export const PROFILE_ICONS = {
  simple_user: 'User',
  merchant: 'Store',
  manager: 'Shield',
  administrator: 'Crown'
} as const;

// Type helper pour vérifier les permissions
export type PermissionChecker = (permission: string) => boolean;

// Interface pour les statistiques des profils
export interface ProfileStats {
  total_users: number;
  simple_users: number;
  merchants: number;
  managers: number;
  administrators: number;
  active_users: number;
  pending_users: number;
  suspended_users: number;
}

// Interface pour les actions de modération
export interface ModerationAction {
  id: string;
  moderator_id: string;
  target_user_id: string;
  action_type: 'approve' | 'suspend' | 'ban' | 'warn';
  reason: string;
  notes?: string;
  created_at: string;
}

// Types pour les notifications utilisateurs
export interface UserNotification {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Interface pour les paramètres utilisateur
export interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  theme: 'light' | 'dark' | 'auto';
  updated_at: string;
}
