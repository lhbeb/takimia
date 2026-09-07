"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function LiveChatWidget() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isCheckoutRoute = pathname?.startsWith('/checkout');
  const isLiveChatRoute = pathname?.startsWith('/livechat');

  useEffect(() => {
    // Hide or show the custom chat widget on admin/checkout/livechat pages if present in DOM
    const chatContainer = document.getElementById('lc-container');
    if (chatContainer) {
      if (isAdminRoute || isCheckoutRoute || isLiveChatRoute) {
        chatContainer.style.display = 'none';
      } else {
        chatContainer.style.display = 'flex';
      }
    }
  }, [pathname, isAdminRoute, isCheckoutRoute, isLiveChatRoute]);

  if (isAdminRoute || isCheckoutRoute || isLiveChatRoute) {
    return null;
  }

  return (
    <Script
      id="custom-livechat-script"
      src="https://chatapppay-rust.vercel.app/livechat.js"
      strategy="afterInteractive"
      data-color="#2e3868"
      data-position="bottom-right"
      data-button-size="60"
      data-label="Chat with us"
    />
  );
}
