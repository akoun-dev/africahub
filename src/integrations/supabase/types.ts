export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advertisement_campaigns: {
        Row: {
          budget: number | null
          campaign_type: string
          created_at: string
          creative_assets: Json
          description: string | null
          end_date: string | null
          id: string
          name: string
          performance_metrics: Json
          start_date: string | null
          status: string
          target_countries: string[]
          target_sectors: string[]
          updated_at: string
        }
        Insert: {
          budget?: number | null
          campaign_type: string
          created_at?: string
          creative_assets?: Json
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          performance_metrics?: Json
          start_date?: string | null
          status?: string
          target_countries?: string[]
          target_sectors?: string[]
          updated_at?: string
        }
        Update: {
          budget?: number | null
          campaign_type?: string
          created_at?: string
          creative_assets?: Json
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          performance_metrics?: Json
          start_date?: string | null
          status?: string
          target_countries?: string[]
          target_sectors?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      available_permissions: {
        Row: {
          action: string
          created_at: string
          description: string
          id: string
          permission: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          id?: string
          permission: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          id?: string
          permission?: string
          resource?: string
        }
        Relationships: []
      }
      merchant_profiles: {
        Row: {
          business_address: string | null
          business_description: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          business_sector: string
          business_type: string
          business_website: string | null
          created_at: string
          id: string
          tax_number: string | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_notes: string | null
          verification_status: "pending" | "verified" | "rejected"
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          business_sector: string
          business_type: string
          business_website?: string | null
          created_at?: string
          id?: string
          tax_number?: string | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_notes?: string | null
          verification_status?: "pending" | "verified" | "rejected"
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          business_sector?: string
          business_type?: string
          business_website?: string | null
          created_at?: string
          id?: string
          tax_number?: string | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_notes?: string | null
          verification_status?: "pending" | "verified" | "rejected"
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "merchant_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          permission: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          permission: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          permission?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_login: string | null
          phone: string | null
          preferences: Json | null
          role: "user" | "merchant" | "manager" | "admin"
          status: "active" | "inactive" | "suspended" | "pending"
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_login?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: "user" | "merchant" | "manager" | "admin"
          status?: "active" | "inactive" | "suspended" | "pending"
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_login?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: "user" | "merchant" | "manager" | "admin"
          status?: "active" | "inactive" | "suspended" | "pending"
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_recommendations: {
        Row: {
          created_at: string
          id: string
          insurance_type: string
          product_id: string
          reasoning: string | null
          recommendation_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          insurance_type: string
          product_id: string
          reasoning?: string | null
          recommendation_score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          insurance_type?: string
          product_id?: string
          reasoning?: string | null
          recommendation_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations_v2: {
        Row: {
          confidence_score: number
          context_factors: Json | null
          created_at: string
          expires_at: string
          id: string
          insurance_type: string
          is_clicked: boolean
          is_purchased: boolean
          is_viewed: boolean
          product_id: string
          reasoning: Json | null
          recommendation_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          context_factors?: Json | null
          created_at?: string
          expires_at?: string
          id?: string
          insurance_type: string
          is_clicked?: boolean
          is_purchased?: boolean
          is_viewed?: boolean
          product_id: string
          reasoning?: Json | null
          recommendation_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          context_factors?: Json | null
          created_at?: string
          expires_at?: string
          id?: string
          insurance_type?: string
          is_clicked?: boolean
          is_purchased?: boolean
          is_viewed?: boolean
          product_id?: string
          reasoning?: Json | null
          recommendation_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_v2_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key: string
          last_used: string | null
          name: string
          permissions: string[]
          rate_limit: number
          updated_at: string
          usage_count: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          last_used?: string | null
          name: string
          permissions?: string[]
          rate_limit?: number
          updated_at?: string
          usage_count?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          last_used?: string | null
          name?: string
          permissions?: string[]
          rate_limit?: number
          updated_at?: string
          usage_count?: number
          user_id?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          response_time: number | null
          status_code: number
          user_agent: string | null
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method: string
          response_time?: number | null
          status_code: number
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          response_time?: number | null
          status_code?: number
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_actions: {
        Row: {
          action: string
          annotations: Json | null
          approver_email: string
          comments: string | null
          completed_at: string | null
          created_at: string
          id: string
          request_id: string
          step_id: string
        }
        Insert: {
          action: string
          annotations?: Json | null
          approver_email: string
          comments?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          request_id: string
          step_id: string
        }
        Update: {
          action?: string
          annotations?: Json | null
          approver_email?: string
          comments?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          request_id?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_actions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "approval_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          created_at: string
          current_step_index: number
          id: string
          signature_request_id: string
          status: string
          updated_at: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          current_step_index?: number
          id?: string
          signature_request_id: string
          status?: string
          updated_at?: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          current_step_index?: number
          id?: string
          signature_request_id?: string
          status?: string
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_steps: {
        Row: {
          approver_email: string | null
          approver_role: string | null
          auto_approve_conditions: Json | null
          created_at: string
          id: string
          is_required: boolean
          step_order: number
          step_type: string
          workflow_id: string
        }
        Insert: {
          approver_email?: string | null
          approver_role?: string | null
          auto_approve_conditions?: Json | null
          created_at?: string
          id?: string
          is_required?: boolean
          step_order: number
          step_type: string
          workflow_id: string
        }
        Update: {
          approver_email?: string | null
          approver_role?: string | null
          auto_approve_conditions?: Json | null
          created_at?: string
          id?: string
          is_required?: boolean
          step_order?: number
          step_type?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_workflows: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          document_types: string[]
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_types?: string[]
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_types?: string[]
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          commission_rate: number | null
          contact_email: string | null
          contact_phone: string | null
          country: string
          country_availability: string[] | null
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          is_active: boolean | null
          is_partner: boolean | null
          logo_url: string | null
          name: string
          rating: number | null
          sectors: string[] | null
          slug: string | null
          total_assets: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          commission_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          country: string
          country_availability?: string[] | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          is_active?: boolean | null
          is_partner?: boolean | null
          logo_url?: string | null
          name: string
          rating?: number | null
          sectors?: string[] | null
          slug?: string | null
          total_assets?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          commission_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          country_availability?: string[] | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          is_active?: boolean | null
          is_partner?: boolean | null
          logo_url?: string | null
          name?: string
          rating?: number | null
          sectors?: string[] | null
          slug?: string | null
          total_assets?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      comparison_criteria: {
        Row: {
          created_at: string
          data_type: string
          id: string
          name: string
          product_type_id: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type: string
          id?: string
          name: string
          product_type_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          id?: string
          name?: string
          product_type_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparison_criteria_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_history: {
        Row: {
          comparison_data: Json | null
          created_at: string
          id: string
          product_ids: string[]
          user_id: string
        }
        Insert: {
          comparison_data?: Json | null
          created_at?: string
          id?: string
          product_ids: string[]
          user_id: string
        }
        Update: {
          comparison_data?: Json | null
          created_at?: string
          id?: string
          product_ids?: string[]
          user_id?: string
        }
        Relationships: []
      }
      document_annotations: {
        Row: {
          annotation_type: string
          content: string | null
          created_at: string
          document_id: string
          id: string
          parent_id: string | null
          position_data: Json
          request_id: string | null
          status: string
          style_data: Json | null
          thread_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annotation_type: string
          content?: string | null
          created_at?: string
          document_id: string
          id?: string
          parent_id?: string | null
          position_data: Json
          request_id?: string | null
          status?: string
          style_data?: Json | null
          thread_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annotation_type?: string
          content?: string | null
          created_at?: string
          document_id?: string
          id?: string
          parent_id?: string | null
          position_data?: Json
          request_id?: string | null
          status?: string
          style_data?: Json | null
          thread_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_annotations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "document_annotations"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      geographic_configurations: {
        Row: {
          commission_rates: Json | null
          country_code: string
          country_name: string
          created_at: string
          currency_code: string
          date_format: string
          email_templates: Json | null
          form_configurations: Json | null
          id: string
          is_active: boolean
          language_code: string
          number_format: string
          pricing_zone: string
          region: string
          regulatory_requirements: Json | null
          supported_languages: string[] | null
          timezone: string
          updated_at: string
        }
        Insert: {
          commission_rates?: Json | null
          country_code: string
          country_name: string
          created_at?: string
          currency_code?: string
          date_format?: string
          email_templates?: Json | null
          form_configurations?: Json | null
          id?: string
          is_active?: boolean
          language_code?: string
          number_format?: string
          pricing_zone?: string
          region: string
          regulatory_requirements?: Json | null
          supported_languages?: string[] | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          commission_rates?: Json | null
          country_code?: string
          country_name?: string
          created_at?: string
          currency_code?: string
          date_format?: string
          email_templates?: Json | null
          form_configurations?: Json | null
          id?: string
          is_active?: boolean
          language_code?: string
          number_format?: string
          pricing_zone?: string
          region?: string
          regulatory_requirements?: Json | null
          supported_languages?: string[] | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      localized_content: {
        Row: {
          content: string | null
          content_key: string
          country_code: string | null
          created_at: string
          id: string
          language_code: string
          metadata: Json | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          content_key: string
          country_code?: string | null
          created_at?: string
          id?: string
          language_code?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          content_key?: string
          country_code?: string | null
          created_at?: string
          id?: string
          language_code?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          company_news: boolean
          created_at: string
          email_notifications: boolean
          id: string
          marketing_emails: boolean
          new_offers: boolean
          price_changes: boolean
          push_notifications: boolean
          sector_updates: boolean
          sms_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          company_news?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          marketing_emails?: boolean
          new_offers?: boolean
          price_changes?: boolean
          push_notifications?: boolean
          sector_updates?: boolean
          sms_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          company_news?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          marketing_emails?: boolean
          new_offers?: boolean
          price_changes?: boolean
          push_notifications?: boolean
          sector_updates?: boolean
          sms_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_agreements: {
        Row: {
          agreement_type: string
          auto_activate: boolean | null
          commission_rate: number | null
          company_id: string
          contract_reference: string | null
          country_code: string
          created_at: string
          end_date: string | null
          id: string
          minimum_volume: number | null
          notes: string | null
          product_type_ids: string[] | null
          revenue_share: number | null
          sector_ids: string[] | null
          signature_date: string
          signed_by: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          agreement_type: string
          auto_activate?: boolean | null
          commission_rate?: number | null
          company_id: string
          contract_reference?: string | null
          country_code: string
          created_at?: string
          end_date?: string | null
          id?: string
          minimum_volume?: number | null
          notes?: string | null
          product_type_ids?: string[] | null
          revenue_share?: number | null
          sector_ids?: string[] | null
          signature_date: string
          signed_by?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          agreement_type?: string
          auto_activate?: boolean | null
          commission_rate?: number | null
          company_id?: string
          contract_reference?: string | null
          country_code?: string
          created_at?: string
          end_date?: string | null
          id?: string
          minimum_volume?: number | null
          notes?: string | null
          product_type_ids?: string[] | null
          revenue_share?: number | null
          sector_ids?: string[] | null
          signature_date?: string
          signed_by?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_agreements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_documents: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          id: string
          processed_at: string | null
          storage_path: string
          thumbnail_url: string | null
          total_pages: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          id?: string
          processed_at?: string | null
          storage_path: string
          thumbnail_url?: string | null
          total_pages?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          id?: string
          processed_at?: string | null
          storage_path?: string
          thumbnail_url?: string | null
          total_pages?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      permission_definitions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      price_calculations: {
        Row: {
          calculated_price: number | null
          calculation_details: Json | null
          created_at: string
          currency: string | null
          expires_at: string
          id: string
          product_id: string
          user_criteria: Json
        }
        Insert: {
          calculated_price?: number | null
          calculation_details?: Json | null
          created_at?: string
          currency?: string | null
          expires_at?: string
          id?: string
          product_id: string
          user_criteria: Json
        }
        Update: {
          calculated_price?: number | null
          calculation_details?: Json | null
          created_at?: string
          currency?: string | null
          expires_at?: string
          id?: string
          product_id?: string
          user_criteria?: Json
        }
        Relationships: [
          {
            foreignKeyName: "price_calculations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_algorithms: {
        Row: {
          auth_config: Json | null
          auth_type: string | null
          calculation_fields: Json | null
          company_id: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          auth_config?: Json | null
          auth_type?: string | null
          calculation_fields?: Json | null
          company_id: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          auth_config?: Json | null
          auth_type?: string | null
          calculation_fields?: Json | null
          company_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_algorithms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      product_criteria_values: {
        Row: {
          created_at: string
          criteria_id: string | null
          id: string
          product_id: string | null
          value: string
        }
        Insert: {
          created_at?: string
          criteria_id?: string | null
          id?: string
          product_id?: string | null
          value: string
        }
        Update: {
          created_at?: string
          criteria_id?: string | null
          id?: string
          product_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_criteria_values_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "comparison_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_criteria_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sector_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sector_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sector_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_types_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          api_endpoint: string | null
          benefits: string[] | null
          brand: string | null
          calculation_config: Json | null
          category: Database["public"]["Enums"]["insurance_category"]
          company_id: string
          country: string
          country_availability: string[] | null
          coverage_amount: number | null
          coverage_details: Json | null
          created_at: string
          currency: string | null
          deductible: number | null
          description: string | null
          exclusions: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_age: number | null
          min_age: number | null
          name: string
          premium_amount: number | null
          price: number | null
          pricing_type: string | null
          product_type_id: string | null
          purchase_link: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          benefits?: string[] | null
          brand?: string | null
          calculation_config?: Json | null
          category: Database["public"]["Enums"]["insurance_category"]
          company_id: string
          country: string
          country_availability?: string[] | null
          coverage_amount?: number | null
          coverage_details?: Json | null
          created_at?: string
          currency?: string | null
          deductible?: number | null
          description?: string | null
          exclusions?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_age?: number | null
          min_age?: number | null
          name: string
          premium_amount?: number | null
          price?: number | null
          pricing_type?: string | null
          product_type_id?: string | null
          purchase_link?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          benefits?: string[] | null
          brand?: string | null
          calculation_config?: Json | null
          category?: Database["public"]["Enums"]["insurance_category"]
          company_id?: string
          country?: string
          country_availability?: string[] | null
          coverage_amount?: number | null
          coverage_details?: Json | null
          created_at?: string
          currency?: string | null
          deductible?: number | null
          description?: string | null
          exclusions?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_age?: number | null
          min_age?: number | null
          name?: string
          premium_amount?: number | null
          price?: number | null
          pricing_type?: string | null
          product_type_id?: string | null
          purchase_link?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          occupation: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          city: string | null
          company_preferences: string[] | null
          country: string
          created_at: string
          email: string
          first_name: string
          id: string
          insurance_type: string
          last_name: string
          phone: string | null
          sector_slug: string
          specific_data: Json | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          company_preferences?: string[] | null
          country: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          insurance_type: string
          last_name: string
          phone?: string | null
          sector_slug: string
          specific_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          company_preferences?: string[] | null
          country?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          insurance_type?: string
          last_name?: string
          phone?: string | null
          sector_slug?: string
          specific_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      review_reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string
          review_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          review_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          review_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_reported: boolean | null
          is_verified_purchase: boolean | null
          photos: string[] | null
          product_id: string
          rating: number
          status: string | null
          title: string
          unhelpful_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_reported?: boolean | null
          is_verified_purchase?: boolean | null
          photos?: string[] | null
          product_id: string
          rating: number
          status?: string | null
          title: string
          unhelpful_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_reported?: boolean | null
          is_verified_purchase?: boolean | null
          photos?: string[] | null
          product_id?: string
          rating?: number
          status?: string | null
          title?: string
          unhelpful_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      role_definitions: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_system_role: boolean | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          granted_at: string | null
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          granted_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          granted_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permission_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          criteria: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          criteria?: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sector_criteria: {
        Row: {
          created_at: string
          data_type: string
          display_order: number | null
          id: string
          is_required: boolean | null
          name: string
          options: string[] | null
          sector_id: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_type?: string
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          name: string
          options?: string[] | null
          sector_id: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_type?: string
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          name?: string
          options?: string[] | null
          sector_id?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sector_criteria_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      signature_cc_recipients: {
        Row: {
          created_at: string
          email: string
          id: string
          request_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          request_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_cc_recipients_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_delegations: {
        Row: {
          created_at: string
          delegate_email: string
          delegated_at: string
          delegator_email: string
          expires_at: string | null
          id: string
          reason: string | null
          request_id: string
          status: string
        }
        Insert: {
          created_at?: string
          delegate_email: string
          delegated_at?: string
          delegator_email: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          request_id: string
          status?: string
        }
        Update: {
          created_at?: string
          delegate_email?: string
          delegated_at?: string
          delegator_email?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_delegations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_fields: {
        Row: {
          created_at: string
          height: number
          id: string
          label: string
          page: number
          position_x: number
          position_y: number
          properties: Json | null
          required: boolean
          role_id: string | null
          template_id: string
          type: string
          updated_at: string
          width: number
        }
        Insert: {
          created_at?: string
          height?: number
          id?: string
          label: string
          page?: number
          position_x: number
          position_y: number
          properties?: Json | null
          required?: boolean
          role_id?: string | null
          template_id: string
          type: string
          updated_at?: string
          width?: number
        }
        Update: {
          created_at?: string
          height?: number
          id?: string
          label?: string
          page?: number
          position_x?: number
          position_y?: number
          properties?: Json | null
          required?: boolean
          role_id?: string | null
          template_id?: string
          type?: string
          updated_at?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "signature_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "signature_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_logs: {
        Row: {
          action: string
          hash: string | null
          id: string
          ip_address: unknown | null
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          request_id: string
          signatory_email: string
          timestamp: string
        }
        Insert: {
          action: string
          hash?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          request_id: string
          signatory_email: string
          timestamp?: string
        }
        Update: {
          action?: string
          hash?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          request_id?: string
          signatory_email?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_notifications: {
        Row: {
          id: string
          metadata: Json | null
          notification_type: string
          recipient_email: string
          request_id: string
          sent_at: string
          template_used: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          notification_type: string
          recipient_email: string
          request_id: string
          sent_at?: string
          template_used?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          notification_type?: string
          recipient_email?: string
          request_id?: string
          sent_at?: string
          template_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          approval_status: string | null
          certificate_url: string | null
          created_at: string
          creator_id: string | null
          current_signatory_index: number
          custom_message: string | null
          deadline: string
          document_name: string
          id: string
          sent_at: string | null
          sequential_mode: boolean
          signed_document_url: string | null
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          certificate_url?: string | null
          created_at?: string
          creator_id?: string | null
          current_signatory_index?: number
          custom_message?: string | null
          deadline: string
          document_name: string
          id?: string
          sent_at?: string | null
          sequential_mode?: boolean
          signed_document_url?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          certificate_url?: string | null
          created_at?: string
          creator_id?: string | null
          current_signatory_index?: number
          custom_message?: string | null
          deadline?: string
          document_name?: string
          id?: string
          sent_at?: string | null
          sequential_mode?: boolean
          signed_document_url?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      signature_signatories: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: unknown | null
          latitude: number | null
          longitude: number | null
          request_id: string
          signature_order: number
          signed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          request_id: string
          signature_order: number
          signed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          request_id?: string
          signature_order?: number
          signed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_signatories_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_template_versions: {
        Row: {
          created_at: string
          created_by: string | null
          fields_data: Json
          id: string
          template_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          fields_data: Json
          id?: string
          template_id: string
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fields_data?: Json
          id?: string
          template_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "signature_template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "signature_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          document_name: string
          document_url: string | null
          id: string
          is_active: boolean
          name: string
          total_pages: number
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_name: string
          document_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          total_pages?: number
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_name?: string
          document_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          total_pages?: number
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          metadata: Json | null
          product_id: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          metadata?: Json | null
          product_id?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          metadata?: Json | null
          product_id?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          ai_recommendations: boolean | null
          brand_preference: string | null
          budget_range: string | null
          cost_threshold: number | null
          coverage_priorities: string[] | null
          created_at: string
          id: string
          insurance_type: string
          max_latency_ms: number | null
          notification_frequency: string | null
          personalization_level: string | null
          preferred_provider: string | null
          preferred_strategy: string | null
          price_sensitivity: number | null
          real_time_updates: boolean | null
          risk_tolerance: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_recommendations?: boolean | null
          brand_preference?: string | null
          budget_range?: string | null
          cost_threshold?: number | null
          coverage_priorities?: string[] | null
          created_at?: string
          id?: string
          insurance_type: string
          max_latency_ms?: number | null
          notification_frequency?: string | null
          personalization_level?: string | null
          preferred_provider?: string | null
          preferred_strategy?: string | null
          price_sensitivity?: number | null
          real_time_updates?: boolean | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_recommendations?: boolean | null
          brand_preference?: string | null
          budget_range?: string | null
          cost_threshold?: number | null
          coverage_priorities?: string[] | null
          created_at?: string
          id?: string
          insurance_type?: string
          max_latency_ms?: number | null
          notification_frequency?: string | null
          personalization_level?: string | null
          preferred_provider?: string | null
          preferred_strategy?: string | null
          price_sensitivity?: number | null
          real_time_updates?: boolean | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          role_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          role_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          role_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_calculations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: string[]
      }
      get_user_roles_v2: {
        Args: { _user_id: string }
        Returns: {
          role_id: string
          role_name: string
          display_name: string
          level: number
          permissions: string[]
        }[]
      }
      has_permission: {
        Args: { _user_id: string; _permission: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_secure: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "manager"
        | "user"
        | "viewer"
        | "moderator"
        | "developer"
      insurance_category:
        | "auto"
        | "health"
        | "life"
        | "property"
        | "business"
        | "travel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "manager",
        "user",
        "viewer",
        "moderator",
        "developer",
      ],
      insurance_category: [
        "auto",
        "health",
        "life",
        "property",
        "business",
        "travel",
      ],
    },
  },
} as const
