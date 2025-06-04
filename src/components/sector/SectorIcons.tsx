
import { 
  Shield, 
  Banknote, 
  Smartphone, 
  Zap, 
  Car, 
  Home
} from 'lucide-react';

export const iconMap = {
  Shield,
  Banknote,
  Smartphone,
  Zap,
  Car,
  Home,
};

export const getSectorIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Shield;
};
