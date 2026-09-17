"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GOOGLE_ADS_ID, PAGE_VIEW_CONVERSION_LABEL } from '@/lib/googleAds';

export default function GoogleTagTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/checkout') || pathname.startsWith('/thankyou')) return;

    const firePageView = () => {
      if (typeof window === 'undefined' || !window.gtag) return;
      const pagePath = pathname + window.location.search;
      window.gtag('event', 'page_view', { page_path: pagePath, page_location: window.location.href });
      window.gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${PAGE_VIEW_CONVERSION_LABEL}`,
        value: 1,
        currency: 'USD',
      });
    };

    if (window.gtag) {
      firePageView();
    } else {
      const timer = window.setTimeout(firePageView, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
