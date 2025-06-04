import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  text?: string;
}

/**
 * Composant de spinner de chargement réutilisable
 * Supporte différentes tailles et couleurs
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-afroGreen',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    warning: 'border-yellow-600',
    error: 'border-red-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          borderTopColor: 'transparent'
        }}
      />
      {text && (
        <p className={cn('text-gray-600 font-medium', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Composant de page de chargement pleine page
 */
export const FullPageLoader: React.FC<{ text?: string }> = ({ 
  text = 'Chargement en cours...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

/**
 * Composant de chargement pour les cartes/sections
 */
export const SectionLoader: React.FC<{ text?: string; className?: string }> = ({ 
  text = 'Chargement...', 
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <LoadingSpinner size="md" text={text} />
    </div>
  );
};

/**
 * Composant de chargement inline
 */
export const InlineLoader: React.FC<{ text?: string; className?: string }> = ({ 
  text, 
  className 
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LoadingSpinner size="sm" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};
