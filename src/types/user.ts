/**
 * Types métier pour le système de gestion des profils utilisateurs AfricaHub
 * Ces types étendent les types de base de données avec la logique métier
 */

import {
    UserProfile as DBUserProfile,
    MerchantProfile as DBMerchantProfile,
    UserWithProfile,
    UserRole,
    UserStatus,
    VerificationStatus
} from '@/integrations/supabase/helpers'

// Énumérations pour compatibilité avec le code existant
export enum UserRoleEnum {
    USER = "user",
    MERCHANT = "merchant",
    MANAGER = "manager",
    ADMIN = "admin",
}

export enum UserStatusEnum {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
}

// Interface de base étendue avec des propriétés métier
export interface BaseUser extends DBUserProfile {
    email: string // Toujours requis dans la logique métier
    full_name?: string // Propriété calculée
    initials?: string // Propriété calculée
    display_name?: string // Propriété calculée
}

// Profil utilisateur simple avec extensions métier
export interface UserProfile extends BaseUser {
    role: 'user'
    preferences?: {
        language: string
        currency: string
        notifications: {
            email: boolean
            push: boolean
            sms: boolean
        }
        theme?: 'light' | 'dark' | 'auto'
        timezone?: string
    }
    // Statistiques calculées
    favorites_count?: number
    reviews_count?: number
    comparisons_count?: number
    last_activity?: string
}

// Profil marchand avec extensions métier
export interface MerchantProfile extends BaseUser {
    role: 'merchant'
    // Informations business (depuis merchant_profiles)
    business_info?: DBMerchantProfile
    // Statistiques calculées
    products_count?: number
    average_rating?: number
    total_sales?: number
    total_views?: number
    conversion_rate?: number
    // Métriques de performance
    performance_metrics?: {
        monthly_sales: number
        customer_satisfaction: number
        response_time: number
        completion_rate: number
    }
}

// Profil gestionnaire avec extensions métier
export interface ManagerProfile extends BaseUser {
    role: 'manager'
    department?: string
    assigned_regions?: string[]
    managed_categories?: string[]
    // Statistiques de gestion
    managed_users_count?: number
    pending_approvals_count?: number
    resolved_issues_count?: number
}

// Profil administrateur avec extensions métier
export interface AdminProfile extends BaseUser {
    role: 'admin'
    super_admin?: boolean
    // Statistiques système
    system_stats?: {
        total_users: number
        active_sessions: number
        system_health: number
        pending_tasks: number
    }
}

// Union type pour tous les profils métier
export type UserProfileUnion =
    | UserProfile
    | MerchantProfile
    | ManagerProfile
    | AdminProfile

// Interface pour l'authentification étendue
export interface AuthUser {
    id: string
    email: string
    role: UserRole
    profile?: UserWithProfile
}

// Interface pour la création d'un utilisateur
export interface CreateUserRequest {
    email: string
    password: string
    first_name: string
    last_name: string
    role: UserRole
    phone?: string
    country?: string
    city?: string
    business_info?: {
        business_name: string
        business_sector: string
        business_type: string
        business_description?: string
        business_address?: string
        business_phone?: string
        business_email?: string
        business_website?: string
        tax_number?: string
    }
    preferences?: {
        language?: string
        currency?: string
        notifications?: {
            email?: boolean
            push?: boolean
            sms?: boolean
        }
    }
}

// Interface pour la mise à jour d'un profil
export interface UpdateProfileRequest {
    first_name?: string
    last_name?: string
    phone?: string
    country?: string
    city?: string
    avatar_url?: string
    preferences?: {
        language?: string
        currency?: string
        notifications?: {
            email?: boolean
            push?: boolean
            sms?: boolean
        }
        theme?: 'light' | 'dark' | 'auto'
        timezone?: string
    }
}

// Interface pour la mise à jour d'un profil marchand
export interface UpdateMerchantProfileRequest extends UpdateProfileRequest {
    business_info?: {
        business_name?: string
        business_sector?: string
        business_type?: string
        business_description?: string
        business_address?: string
        business_phone?: string
        business_email?: string
        business_website?: string
        tax_number?: string
    }
}

// Interface pour les statistiques utilisateur étendues
export interface UserStats {
    total_users: number
    active_users: number
    inactive_users: number
    suspended_users: number
    pending_users: number
    new_users_this_month: number
    new_users_this_week: number
    users_by_role: Record<UserRole, number>
    users_by_country: Record<string, number>
    users_by_status: Record<UserStatus, number>
    growth_rate: number
    retention_rate: number
}

// Interface pour les métriques de performance utilisateur
export interface UserPerformanceMetrics {
    user_id: string
    login_frequency: number
    session_duration_avg: number
    features_used: string[]
    last_activity: string
    engagement_score: number
    satisfaction_rating?: number
}

// Interface pour les filtres de recherche d'utilisateurs étendus
export interface UserSearchFilters {
    role?: UserRole | UserRole[]
    status?: UserStatus | UserStatus[]
    country?: string | string[]
    city?: string
    search?: string
    created_after?: string
    created_before?: string
    last_login_after?: string
    last_login_before?: string
    has_merchant_profile?: boolean
    verification_status?: VerificationStatus
    page?: number
    limit?: number
    sort_by?: 'created_at' | 'last_login' | 'first_name' | 'last_name'
    sort_order?: 'asc' | 'desc'
}

// Interface pour les résultats de recherche étendus
export interface UserSearchResult {
    users: UserWithProfile[]
    total: number
    page: number
    limit: number
    has_more: boolean
    filters_applied: UserSearchFilters
    search_metadata?: {
        execution_time: number
        total_pages: number
        results_per_page: number
    }
}

// Interface pour les actions en lot sur les utilisateurs
export interface BulkUserAction {
    action: 'activate' | 'deactivate' | 'suspend' | 'delete' | 'change_role'
    user_ids: string[]
    parameters?: {
        new_role?: UserRole
        reason?: string
        notify_users?: boolean
    }
}

// Interface pour les résultats d'actions en lot
export interface BulkActionResult {
    success_count: number
    error_count: number
    errors: Array<{
        user_id: string
        error: string
    }>
    processed_at: string
}
