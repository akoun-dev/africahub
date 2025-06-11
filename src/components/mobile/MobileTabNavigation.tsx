
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart3, FileText, User, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

interface MobileTabNavigationProps {
  currentSectorSlug?: string;
}

export const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({ 
  currentSectorSlug 
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) return null;

  const baseTabs: TabItem[] = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      path: '/'
    },
    {
      id: 'search',
      label: 'Recherche',
      icon: Search,
      path: '/compare'
    },
    {
      id: 'quote',
      label: 'Devis',
      icon: FileText,
      path: currentSectorSlug ? `/secteur/${currentSectorSlug}/devis` : '/quote-request'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      path: '/dashboard'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg mobile-safe-area"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-around items-center py-2">
        {baseTabs.map((tab) => {
          const isTabActive = isActive(tab.path);
          const IconComponent = tab.icon;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="flex flex-col items-center justify-center min-h-[60px] px-3 relative"
            >
              <motion.div
                className={`p-2 rounded-xl transition-colors duration-200 ${
                  isTabActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-600 hover:text-primary'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <IconComponent className="h-5 w-5" />
                {tab.badge && tab.badge > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </motion.div>
                )}
              </motion.div>
              
              <span 
                className={`text-xs mt-1 transition-colors duration-200 ${
                  isTabActive ? 'text-primary font-medium' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>

              {isTabActive && (
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
