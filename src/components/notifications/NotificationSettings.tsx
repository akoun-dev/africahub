
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Wifi, WifiOff } from 'lucide-react';
import { PushNotificationService } from '@/services/notifications/PushNotificationService';
import { NotificationPreferences } from '@/domain/entities/Notification';
import { OfflineCacheService } from '@/services/cache/OfflineCacheService';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newOffers: true,
    priceChanges: true,
    sectorUpdates: false,
    companyNews: false
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  const pushService = PushNotificationService.getInstance();
  const cacheService = OfflineCacheService.getInstance();

  useEffect(() => {
    loadPreferences();
    checkNotificationStatus();
    updateCacheSize();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPreferences = async () => {
    const userPrefs = await pushService.getPreferences('default-user');
    if (userPrefs) {
      setPreferences(userPrefs);
    }
  };

  const checkNotificationStatus = async () => {
    const initialized = await pushService.initialize();
    setIsEnabled(initialized);
  };

  const updateCacheSize = async () => {
    const size = await cacheService.getCacheSize();
    setCacheSize(size);
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await pushService.updatePreferences('default-user', newPreferences);
    
    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences de notification ont été sauvegardées."
    });
  };

  const enableNotifications = async () => {
    const success = await pushService.initialize();
    setIsEnabled(success);
    
    if (success) {
      toast({
        title: "Notifications activées",
        description: "Vous recevrez maintenant des notifications push."
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications push.",
        variant: "destructive"
      });
    }
  };

  const clearCache = async () => {
    await cacheService.clear();
    await updateCacheSize();
    
    toast({
      title: "Cache vidé",
      description: "Toutes les données en cache ont été supprimées."
    });
  };

  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {isOnline ? (
                <Wifi className="h-8 w-8 text-green-500" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="font-semibold">État de connexion</p>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? "En ligne" : "Hors ligne"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {isEnabled ? (
                <Bell className="h-8 w-8 text-blue-500" />
              ) : (
                <BellOff className="h-8 w-8 text-gray-400" />
              )}
              <div>
                <p className="font-semibold">Notifications Push</p>
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {isEnabled ? "Activées" : "Désactivées"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences de notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                Activez les notifications push pour recevoir des alertes en temps réel.
              </p>
              <Button onClick={enableNotifications} size="sm">
                Activer les notifications
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nouvelles offres</p>
                <p className="text-sm text-gray-600">Alertes pour les nouvelles offres d'assurance</p>
              </div>
              <Switch
                checked={preferences.newOffers}
                onCheckedChange={(value) => handlePreferenceChange('newOffers', value)}
                disabled={!isEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Changements de prix</p>
                <p className="text-sm text-gray-600">Notifications lors de variations de prix</p>
              </div>
              <Switch
                checked={preferences.priceChanges}
                onCheckedChange={(value) => handlePreferenceChange('priceChanges', value)}
                disabled={!isEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mises à jour sectorielles</p>
                <p className="text-sm text-gray-600">Nouvelles dans votre secteur d'activité</p>
              </div>
              <Switch
                checked={preferences.sectorUpdates}
                onCheckedChange={(value) => handlePreferenceChange('sectorUpdates', value)}
                disabled={!isEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Actualités des compagnies</p>
                <p className="text-sm text-gray-600">Nouvelles des compagnies d'assurance</p>
              </div>
              <Switch
                checked={preferences.companyNews}
                onCheckedChange={(value) => handlePreferenceChange('companyNews', value)}
                disabled={!isEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion du cache (Mode hors ligne)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Taille du cache</p>
              <p className="text-sm text-gray-600">{formatCacheSize(cacheSize)} utilisés</p>
            </div>
            <Button variant="outline" onClick={clearCache}>
              Vider le cache
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Le mode hors ligne permet d'accéder aux données même sans connexion internet. 
              Les données sont automatiquement mises en cache pour une utilisation ultérieure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
