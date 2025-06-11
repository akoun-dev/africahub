
import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumDashboardLayout: React.FC<PremiumDashboardLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gray-50/30",
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  action
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-gray-600 font-light">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

interface DashboardSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  children,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
