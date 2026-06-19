import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        const trackPageView = async () => {
            try {
                await supabase.from('analytics_events').insert({
                    event_type: 'page_view',
                    path: location.pathname,
                    meta: {
                        referrer: document.referrer,
                        userAgent: navigator.userAgent,
                        timestamp: new Date().toISOString()
                    }
                });
            } catch (error) {
                // Fail silently to not impact user experience
                console.error('Analytics error:', error);
            }
        };

        trackPageView();
    }, [location]);
};
