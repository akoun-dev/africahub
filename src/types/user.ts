/**
 * Types pour le système de gestion des profils utilisateurs AfricaHub
 */

// Énumération des types d'utilisateurs
export enum UserRole {
    USER = "user", // Utilisateur Simple
    MERCHANT = "merchant", // Marchand
    MANAGER = "manager", // Gestionnaire
    ADMIN = "admin", // Administrateur
}

// Énumération des statuts d'utilisateur
export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING = "pending",
}

// Interface de base pour un utilisateur
export interface BaseUser {
    id: string
    email: string
    first_name: string
    last_name: string
    avatar_url?: string
    phone?: string
    country?: string
    city?: string
    role: UserRole
    status: UserStatus
    created_at: string
    updated_at: string
    last_login?: string
}

// Profil utilisateur simple
export interface UserProfile extends BaseUser {
    role: UserRole.USER
    preferences?: {
        language: string
        currency: string
        notifications: {
            email: boolean
            push: boolean
            sms: boolean
        }
    }
    favorites_count?: number
    reviews_count?: number
}

// Profil marchand
export interface MerchantProfile extends BaseUser {
    role: UserRole.MERCHANT
    business_name: string
    business_sector: string
    business_type: string
    business_description?: string
    business_address?: string
    business_phone?: string
    business_email?: string
    business_website?: string
    tax_number?: string
    verification_status: "pending" | "verified" | "rejected"
    verification_documents?: string[]
    products_count?: number
    average_rating?: number
    total_sales?: number
}

// Profil gestionnaire
export interface ManagerProfile extends BaseUser {
    role: UserRole.MANAGER
    department: string
    permissions: string[]
    assigned_regions?: string[]
    managed_categories?: string[]
}

// Profil administrateur
export interface AdminProfile extends BaseUser {
    role: UserRole.ADMIN
    permissions: string[]
    super_admin: boolean
}

// Union type pour tous les profils
export type UserProfileUnion =
    | UserProfile
    | MerchantProfile
    | ManagerProfile
    | AdminProfile

// Interface pour les permissions
export interface Permission {
    id: string
    name: string
    description: string
    resource: string
    action: string
}

// Interface pour les rôles avec permissions
export interface RoleWithPermissions {
    role: UserRole
    permissions: Permission[]
}

// Interface pour l'authentification
export interface AuthUser {
    id: string
    email: string
    role: UserRole
    profile?: UserProfileUnion
}

// Interface pour la création d'un utilisateur
export interface CreateUserRequest {
    email: string
    password: string
    first_name: string
    last_name: string
    role: UserRole
    business_info?: {
        business_name: string
        business_sector: string
        business_type: string
        business_description?: string
        business_address?: string
        business_phone?: string
        business_email?: string
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
    preferences?: any
    business_info?: any
}

// Interface pour les statistiques utilisateur
export interface UserStats {
    total_users: number
    active_users: number
    new_users_this_month: number
    users_by_role: Record<UserRole, number>
    users_by_country: Record<string, number>
}

// Interface pour les filtres de recherche d'utilisateurs
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

// Interface pour les résultats de recherche
export interface UserSearchResult {
    users: UserProfileUnion[]
    total: number
    page: number
    limit: number
    has_more: boolean
}
