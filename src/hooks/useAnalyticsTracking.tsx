
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsMicroservice } from '@/services/microservices/AnalyticsMicroservice';

interface TrackingEvent {
  eventType: string;
  sector?: string;
  country?: string;
  productId?: string;
  companyId?: string;
  properties?: Record<string, any>;
  metadata?: Record<string, any>;
}

export const useAnalyticsTracking = () => {
  const { user } = useAuth();

  // Generate session ID
  const sessionId = useCallback(() => {
    let id = sessionStorage.getItem('analytics_session_id');
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', id);
    }
    return id;
  }, []);

  const trackEvent = useCallback(async (event: TrackingEvent) => {
    try {
      const fullEvent = {
        ...event,
        userId: user?.id,
        sessionId: sessionId(),
        sector: event.sector || 'unknown',
        country: event.country || 'unknown',
        properties: event.properties || {},
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
          ...event.metadata
        }
      };

      await analyticsMicroservice.trackEvent(fullEvent);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, [user, sessionId]);

  const trackPageView = useCallback(async (page: string, sector?: string) => {
    await trackEvent({
      eventType: 'page_view',
      sector,
      properties: {
        page,
        title: document.title
      }
    });
  }, [trackEvent]);

  const trackProductView = useCallback(async (productId: string, sector: string, companyId?: string) => {
    await trackEvent({
      eventType: 'product_view',
      sector,
      productId,
      companyId,
      properties: {
        productId,
        sector
      }
    });
  }, [trackEvent]);

  const trackComparison = useCallback(async (productIds: string[], sector: string) => {
    await trackEvent({
      eventType: 'comparison_started',
      sector,
      properties: {
        productsCompared: productIds,
        comparisonCount: productIds.length
      }
    });
  }, [trackEvent]);

  const trackQuoteRequest = useCallback(async (productId: string, sector: string, amount?: number) => {
    await trackEvent({
      eventType: 'quote_requested',
      sector,
      productId,
      properties: {
        productId,
        amount,
        sector
      }
    });
  }, [trackEvent]);

  const trackSectorNavigation = useCallback(async (fromSector: string, toSector: string) => {
    await trackEvent({
      eventType: 'sector_navigation',
      sector: toSector,
      properties: {
        fromSector,
        toSector
      }
    });
  }, [trackEvent]);

  // Auto-track page views
  useEffect(() => {
    // Get sector from URL if on sector page
    const pathSegments = window.location.pathname.split('/');
    const isOnSectorPage = pathSegments[1] === 'secteur';
    const currentSector = isOnSectorPage ? pathSegments[2] : undefined;

    trackPageView(window.location.pathname, currentSector);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackEvent({
          eventType: 'page_hidden',
          sector: currentSector,
          properties: {
            timeOnPage: Date.now() - (window.performance?.timing?.navigationStart || 0)
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackPageView, trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackComparison,
    trackQuoteRequest,
    trackSectorNavigation
  };
};
