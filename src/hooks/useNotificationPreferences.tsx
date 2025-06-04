
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  new_offers: boolean;
  price_changes: boolean;
  sector_updates: boolean;
  company_news: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No preferences found, create default ones
        await createDefaultPreferences();
      } else if (error) {
        throw error;
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast.error('Impossible de charger les préférences de notification');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user) return;

    const defaultPrefs: Omit<NotificationPreferences, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      marketing_emails: false,
      new_offers: true,
      price_changes: true,
      sector_updates: true,
      company_news: false,
    };

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert([defaultPrefs])
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast.success('Préférences mises à jour');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Impossible de mettre à jour les préférences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchPreferences
  };
};
