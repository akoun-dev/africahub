
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <Alert className="fixed top-4 left-1/2 transform -translate-x-1/2 w-auto z-50 bg-orange-50 border-orange-200">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        Mode hors ligne - Certaines fonctionnalités peuvent être limitées
      </AlertDescription>
    </Alert>
  );
};
