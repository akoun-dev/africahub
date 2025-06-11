
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Loader2, Bell, Mail, MessageSquare, Megaphone } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const { preferences, loading, updatePreferences } = useNotificationPreferences();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Aucune préférence de notification trouvée</p>
        </CardContent>
      </Card>
    );
  }

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>
          Choisissez comment vous souhaitez être notifié
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canaux de notification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h3 className="text-sm font-medium">Canaux de notification</h3>
          </div>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Label htmlFor="email-notifications" className="text-sm">
                  Notifications par email
                </Label>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.email_notifications}
                onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="push-notifications" className="text-sm">
                  Notifications push
                </Label>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.push_notifications}
                onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <Label htmlFor="sms-notifications" className="text-sm">
                  Notifications SMS
                </Label>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.sms_notifications}
                onCheckedChange={(checked) => handleToggle('sms_notifications', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Types de contenu */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Types de notifications</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-offers" className="text-sm">
                Nouvelles offres
              </Label>
              <Switch
                id="new-offers"
                checked={preferences.new_offers}
                onCheckedChange={(checked) => handleToggle('new_offers', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="price-changes" className="text-sm">
                Changements de prix
              </Label>
              <Switch
                id="price-changes"
                checked={preferences.price_changes}
                onCheckedChange={(checked) => handleToggle('price_changes', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sector-updates" className="text-sm">
                Mises à jour sectorielles
              </Label>
              <Switch
                id="sector-updates"
                checked={preferences.sector_updates}
                onCheckedChange={(checked) => handleToggle('sector_updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="company-news" className="text-sm">
                Actualités des entreprises
              </Label>
              <Switch
                id="company-news"
                checked={preferences.company_news}
                onCheckedChange={(checked) => handleToggle('company_news', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Marketing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <h3 className="text-sm font-medium">Communications marketing</h3>
          </div>
          
          <div className="ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-emails" className="text-sm">
                Emails promotionnels
              </Label>
              <Switch
                id="marketing-emails"
                checked={preferences.marketing_emails}
                onCheckedChange={(checked) => handleToggle('marketing_emails', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
