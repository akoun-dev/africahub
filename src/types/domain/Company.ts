
export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  country_availability?: string[];
  sectors?: string[];
  is_partner: boolean;
  is_active: boolean;
  commission_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerAgreement {
  id: string;
  company_id: string;
  contract_reference?: string;
  signature_date: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  agreement_type: string;
  country_code: string;
  commission_rate?: number;
  revenue_share?: number;
  minimum_volume?: number;
  auto_activate?: boolean;
  sector_ids?: string[];
  product_type_ids?: string[];
  signed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
