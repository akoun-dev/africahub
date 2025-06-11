/**
 * Helpers et types utilitaires pour Supabase - AfricaHub
 * Ce fichier contient les types dérivés et les fonctions utilitaires
 */

import { Database } from './types'

// Types de base extraits de la base de données
export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// Types pour les tables principales
export type UserProfile = Tables['user_profiles']['Row']
export type UserProfileInsert = Tables['user_profiles']['Insert']
export type UserProfileUpdate = Tables['user_profiles']['Update']

export type MerchantProfile = Tables['merchant_profiles']['Row']
export type MerchantProfileInsert = Tables['merchant_profiles']['Insert']
export type MerchantProfileUpdate = Tables['merchant_profiles']['Update']

export type UserPermission = Tables['user_permissions']['Row']
export type UserPermissionInsert = Tables['user_permissions']['Insert']
export type UserPermissionUpdate = Tables['user_permissions']['Update']

export type AvailablePermission = Tables['available_permissions']['Row']

// Types d'énumération extraits du schéma
export type UserRole = UserProfile['role']
export type UserStatus = UserProfile['status']
export type VerificationStatus = MerchantProfile['verification_status']

// Types composés pour les vues jointes
export interface UserWithProfile extends UserProfile {
  last_name?: string // Champ manquant dans le schéma actuel
  merchant_profile?: MerchantProfile
  permissions?: string[]
  merchant_profiles?: MerchantProfile[] // Pour compatibilité avec le code existant
  user_permissions?: UserPermission[]
}

// Types pour les réponses API
export interface UserListResponse {
  data: UserWithProfile[]
  count: number
  page: number
  limit: number
}

export interface UserStatsResponse {
  total_users: number
  active_users: number
  new_users_this_month: number
  users_by_role: Record<UserRole, number>
  users_by_country: Record<string, number>
}

// Types pour les filtres de recherche
export interface UserSearchFilters {
  role?: UserRole
  status?: UserStatus
  country?: string
  search?: string
  created_after?: string
  created_before?: string
  page?: number
  limit?: number
}

// Types pour les résultats de recherche
export interface UserSearchResult {
  users: UserWithProfile[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// Fonctions utilitaires pour les types
export const isUserRole = (role: string): role is UserRole => {
  return ['user', 'merchant', 'manager', 'admin'].includes(role)
}

export const isUserStatus = (status: string): status is UserStatus => {
  return ['active', 'inactive', 'suspended', 'pending'].includes(status)
}

export const isVerificationStatus = (status: string): status is VerificationStatus => {
  return ['pending', 'verified', 'rejected'].includes(status)
}

// Permissions par défaut pour chaque rôle
export const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  user: [
    'view_products',
    'create_reviews', 
    'manage_favorites',
    'view_profile',
    'edit_profile'
  ],
  merchant: [
    'view_products',
    'manage_products',
    'view_analytics',
    'respond_reviews',
    'manage_business_profile'
  ],
  manager: [
    'view_products',
    'moderate_content',
    'verify_products',
    'view_reports',
    'manage_users'
  ],
  admin: ['*'] // Tous les droits
}

// Fonction pour vérifier les permissions
export const hasPermission = (
  userProfile: UserWithProfile | null,
  permission: string
): boolean => {
  if (!userProfile) return false

  // Admin a tous les droits
  if (userProfile.role === 'admin') return true

  // Vérifier les permissions spécifiques
  const userPermissions = userProfile.permissions || []
  const defaultPermissions = DEFAULT_PERMISSIONS[userProfile.role] || []

  return (
    userPermissions.includes(permission) ||
    defaultPermissions.includes(permission) ||
    defaultPermissions.includes('*')
  )
}

// Fonction pour vérifier le rôle
export const hasRole = (
  userProfile: UserWithProfile | null,
  role: UserRole
): boolean => {
  return userProfile?.role === role
}

// Fonction pour vérifier l'accès à une ressource
export const canAccess = (
  userProfile: UserWithProfile | null,
  resource: string,
  action: string
): boolean => {
  const permission = `${action}_${resource}`
  return hasPermission(userProfile, permission)
}

// Fonction pour obtenir le nom complet d'un utilisateur
export const getFullName = (userProfile: UserProfile | UserWithProfile): string => {
  const lastName = 'last_name' in userProfile ? userProfile.last_name : ''
  return `${userProfile.first_name} ${lastName || ''}`.trim()
}

// Fonction pour obtenir l'initiales d'un utilisateur
export const getInitials = (userProfile: UserProfile | UserWithProfile): string => {
  const firstInitial = userProfile.first_name?.charAt(0)?.toUpperCase() || ''
  const lastName = 'last_name' in userProfile ? userProfile.last_name : ''
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || ''
  return `${firstInitial}${lastInitial}`
}

// Fonction pour formater le statut d'un utilisateur
export const formatUserStatus = (status: UserStatus): string => {
  const statusMap: Record<UserStatus, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    suspended: 'Suspendu',
    pending: 'En attente'
  }
  return statusMap[status] || status
}

// Fonction pour formater le rôle d'un utilisateur
export const formatUserRole = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    user: 'Utilisateur',
    merchant: 'Marchand',
    manager: 'Gestionnaire',
    admin: 'Administrateur'
  }
  return roleMap[role] || role
}

// Fonction pour formater le statut de vérification
export const formatVerificationStatus = (status: VerificationStatus): string => {
  const statusMap: Record<VerificationStatus, string> = {
    pending: 'En attente',
    verified: 'Vérifié',
    rejected: 'Rejeté'
  }
  return statusMap[status] || status
}

// Type guards pour la sécurité des types
export const isUserProfile = (profile: any): profile is UserProfile => {
  return profile && typeof profile.user_id === 'string' && typeof profile.role === 'string'
}

export const isMerchantProfile = (profile: any): profile is MerchantProfile => {
  return profile && typeof profile.business_name === 'string' && typeof profile.verification_status === 'string'
}

export const isUserWithProfile = (user: any): user is UserWithProfile => {
  return isUserProfile(user)
}

// Constantes utiles
export const USER_ROLES: UserRole[] = ['user', 'merchant', 'manager', 'admin']
export const USER_STATUSES: UserStatus[] = ['active', 'inactive', 'suspended', 'pending']
export const VERIFICATION_STATUSES: VerificationStatus[] = ['pending', 'verified', 'rejected']
