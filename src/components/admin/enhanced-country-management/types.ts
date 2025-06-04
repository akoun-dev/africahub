
export interface QuickStat {
  title: string;
  value: string | number;
  change: string;
  color: string;
  icon: any;
}

export interface EnhancedCountryManagementProps {
  activeTab?: string;
  onActiveTabChange?: (tab: string) => void;
}
