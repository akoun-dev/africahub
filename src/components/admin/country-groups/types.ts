
export interface CountryGroup {
  id: string;
  name: string;
  description: string;
  countries: string[];
  currency: string;
  activeCountries: number;
  totalUsers: number;
  avgRevenue: number;
  isActive: boolean;
  color: string;
}

export interface CountryGroupManagerProps {
  selectedGroup?: string;
  onGroupSelect?: (groupId: string) => void;
}
