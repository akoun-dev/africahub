
import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface PremiumTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const PremiumTabNavigation: React.FC<PremiumTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("border-b border-gray-200", className)}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "group relative py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200",
              activeTab === tab.id
                ? "border-afroGreen text-afroGreen"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && (
                <span className={cn(
                  "transition-colors",
                  activeTab === tab.id ? "text-afroGreen" : "text-gray-400 group-hover:text-gray-600"
                )}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "ml-2 py-0.5 px-2 rounded-full text-xs font-medium",
                  activeTab === tab.id
                    ? "bg-afroGreen/10 text-afroGreen"
                    : "bg-gray-100 text-gray-500"
                )}>
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};
