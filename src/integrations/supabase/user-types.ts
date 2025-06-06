/**
 * Types Supabase pour le système de gestion des utilisateurs
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// Types pour les tables utilisateurs
export interface UserProfileRow {
    id: string
    user_id: string
    first_name: string
    last_name: string
    avatar_url: string | null
    phone: string | null
    country: string | null
    city: string | null
    role: "user" | "merchant" | "manager" | "admin"
    status: "active" | "inactive" | "suspended" | "pending"
    preferences: Json | null
    created_at: string
    updated_at: string
    last_login: string | null
}

export interface UserProfileInsert {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    avatar_url?: string | null
    phone?: string | null
    country?: string | null
    city?: string | null
    role?: "user" | "merchant" | "manager" | "admin"
    status?: "active" | "inactive" | "suspended" | "pending"
    preferences?: Json | null
    created_at?: string
    updated_at?: string
    last_login?: string | null
}

export interface UserProfileUpdate {
    id?: string
    user_id?: string
    first_name?: string
    last_name?: string
    avatar_url?: string | null
    phone?: string | null
    country?: string | null
    city?: string | null
    role?: "user" | "merchant" | "manager" | "admin"
    status?: "active" | "inactive" | "suspended" | "pending"
    preferences?: Json | null
    created_at?: string
    updated_at?: string
    last_login?: string | null
}

// Types pour les profils marchands
export interface MerchantProfileRow {
    id: string
    user_id: string
    business_name: string
    business_sector: string
    business_type: string
    business_description: string | null
    business_address: string | null
    business_phone: string | null
    business_email: string | null
    business_website: string | null
    tax_number: string | null
    verification_status: "pending" | "verified" | "rejected"
    verification_documents: Json | null
    created_at: string
    updated_at: string
}

export interface MerchantProfileInsert {
    id?: string
    user_id: string
    business_name: string
    business_sector: string
    business_type: string
    business_description?: string | null
    business_address?: string | null
    business_phone?: string | null
    business_email?: string | null
    business_website?: string | null
    tax_number?: string | null
    verification_status?: "pending" | "verified" | "rejected"
    verification_documents?: Json | null
    created_at?: string
    updated_at?: string
}

export interface MerchantProfileUpdate {
    id?: string
    user_id?: string
    business_name?: string
    business_sector?: string
    business_type?: string
    business_description?: string | null
    business_address?: string | null
    business_phone?: string | null
    business_email?: string | null
    business_website?: string | null
    tax_number?: string | null
    verification_status?: "pending" | "verified" | "rejected"
    verification_documents?: Json | null
    created_at?: string
    updated_at?: string
}

// Types pour les permissions
export interface UserPermissionRow {
    id: string
    user_id: string
    permission: string
    granted_by: string
    granted_at: string
    expires_at: string | null
}

export interface UserPermissionInsert {
    id?: string
    user_id: string
    permission: string
    granted_by: string
    granted_at?: string
    expires_at?: string | null
}

export interface UserPermissionUpdate {
    id?: string
    user_id?: string
    permission?: string
    granted_by?: string
    granted_at?: string
    expires_at?: string | null
}

// Énumérations
export type UserRole = "user" | "merchant" | "manager" | "admin"
export type UserStatus = "active" | "inactive" | "suspended" | "pending"
export type VerificationStatus = "pending" | "verified" | "rejected"

// Types pour les vues jointes
export interface UserWithProfile extends UserProfileRow {
    email: string
    merchant_profile?: MerchantProfileRow
    permissions?: string[]
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
