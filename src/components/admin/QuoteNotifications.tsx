
import React, { useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

export const QuoteNotifications: React.FC = () => {
  const { data: notifications } = useNotifications(5, true);
  const processedNotifications = useRef(new Set<string>());

  useEffect(() => {
    if (notifications?.notifications) {
      notifications.notifications.forEach((notification) => {
        if (
          notification.type === 'quote_request' && 
          !notification.is_read &&
          !processedNotifications.current.has(notification.id)
        ) {
          const quoteData = notification.data;
          
          toast({
            title: "📋 Nouvelle demande de devis !",
            description: `${quoteData?.customer_name} demande un devis pour ${quoteData?.insurance_type} depuis ${quoteData?.country}`,
            duration: 10000,
          });

          // Mark this notification as processed to avoid duplicates
          processedNotifications.current.add(notification.id);
        }
      });
    }
  }, [notifications]);

  return null; // This component doesn't render anything visible
};
