
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface PWAState {
  isInstallable: boolean;
  isOffline: boolean;
  isInstalled: boolean;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isOffline: false,
    isInstalled: false,
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check online status
    const updateOnlineStatus = () => {
      setPWAState(prev => ({ ...prev, isOffline: !navigator.onLine }));
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPWAState(prev => ({ ...prev, isInstallable: true }));
    };

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          console.log('Service Worker registered');
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial state
    setPWAState({
      isInstallable: false,
      isOffline: !navigator.onLine,
      isInstalled,
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: "Application installée",
        description: "AssurCompare est maintenant disponible sur votre écran d'accueil",
      });
      setPWAState(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
    }
    
    setDeferredPrompt(null);
  };

  return {
    ...pwaState,
    installApp,
  };
};
