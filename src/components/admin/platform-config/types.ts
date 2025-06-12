
export interface PlatformConfig {
  platformName: string;
  defaultLanguage: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  supportPhone: string;
}

export interface ConfigTabProps {
  config: PlatformConfig;
  setConfig: (config: PlatformConfig) => void;
}
