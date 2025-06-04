
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePhotoCleanup = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Nettoyer les photos orphelines toutes les heures
    const cleanupInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke('cleanup-orphaned-photos');
        console.log('Photo cleanup completed');
      } catch (error) {
        console.error('Photo cleanup failed:', error);
      }
    }, 60 * 60 * 1000); // 1 heure

    return () => clearInterval(cleanupInterval);
  }, [user]);

  const manualCleanup = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-orphaned-photos');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Manual cleanup failed:', error);
      throw error;
    }
  };

  return { manualCleanup };
};
