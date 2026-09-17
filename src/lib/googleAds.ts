// Takimia Google Ads configuration.
// Replace these placeholders with Takimia's own Google Ads values before launch.
// Do not copy Bricoc's AW ID or conversion labels into this file.
export const GOOGLE_ADS_ID = 'AW-00000000000';

const PURCHASE_CONVERSION_LABEL = 'TAKIMIA_PURCHASE_PLACEHOLDER';
const ADD_TO_BASKET_CONVERSION_LABEL = 'TAKIMIA_ADD_TO_CART_PLACEHOLDER';
const BEGIN_CHECKOUT_CONVERSION_LABEL = 'TAKIMIA_BEGIN_CHECKOUT_PLACEHOLDER';
export const PAGE_VIEW_CONVERSION_LABEL = 'TAKIMIA_PAGE_VIEW_PLACEHOLDER';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
  }
}

export function getGoogleAdsTag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  }
  return window.gtag;
}

export function queueGoogleAdsAddToBasket(
  value: number,
  currency: string,
  itemData?: { id?: string; name?: string },
): boolean {
  const gtag = getGoogleAdsTag();
  if (!gtag) return false;
  const validValue = Number.isFinite(value) && value > 0 ? value : 1;
  const validCurrency = currency || 'USD';
  gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${ADD_TO_BASKET_CONVERSION_LABEL}`, value: validValue, currency: validCurrency });
  gtag('event', 'add_to_cart', {
    value: validValue,
    currency: validCurrency,
    items: [{ item_id: itemData?.id || 'product', item_name: itemData?.name || 'Product', price: validValue, quantity: 1 }],
  });
  return true;
}

export function queueGoogleAdsBeginCheckout(value: number, currency: string): boolean {
  const gtag = getGoogleAdsTag();
  if (!gtag) return false;
  const validValue = Number.isFinite(value) && value > 0 ? value : 1;
  const validCurrency = currency || 'USD';
  gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${BEGIN_CHECKOUT_CONVERSION_LABEL}`, value: validValue, currency: validCurrency });
  gtag('event', 'begin_checkout', { value: validValue, currency: validCurrency });
  return true;
}

export function queueGoogleAdsPurchase({
  value,
  currency,
  transactionId,
  email,
  contentId,
  contentName,
}: {
  value: number;
  currency: string;
  transactionId: string;
  email?: string | null;
  contentId?: string;
  contentName?: string;
}): boolean {
  const gtag = getGoogleAdsTag();
  if (!gtag || !transactionId || !Number.isFinite(value) || value <= 0) return false;
  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail) gtag('set', 'user_data', { email: normalizedEmail });
  gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${PURCHASE_CONVERSION_LABEL}`,
    value,
    currency: currency || 'USD',
    transaction_id: transactionId,
  });
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency: currency || 'USD',
    items: [{ item_id: contentId || transactionId, item_name: contentName || 'Order Item', price: value, quantity: 1 }],
  });
  console.log('Takimia Google Ads purchase conversion queued:', { transactionId, value, currency });
  return true;
}
