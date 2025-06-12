
export interface MockProduct {
  id: string;
  name: string;
  sector: string;
  company: string;
  status: 'active' | 'pending_approval' | 'inactive';
  countries: string[];
  basePrice: number;
  versions: number;
  lastUpdated?: string; // Rendre cette propriété optionnelle
}

export interface ProductManagementProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}
