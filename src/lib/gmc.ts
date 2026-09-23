type GmcMetadata = Record<string, unknown> & {
  gmc_enabled?: boolean;
};

type GmcProductLike = {
  meta?: GmcMetadata | null;
  published?: boolean;
  title?: string | null;
  slug?: string | null;
  images?: unknown;
  price?: number | string | null;
  currency?: string | null;
};

/**
 * Check if a product has been explicitly selected for Google Merchant Center feed.
 * Only products with gmc_enabled === true will be included.
 */
export function isGmcSelected(product: GmcProductLike): boolean {
  return product.meta?.gmc_enabled === true;
}

/**
 * Merge GMC selection into product metadata
 */
export function mergeGmcSelection(meta: unknown, gmcEnabled: boolean): GmcMetadata {
  const currentMeta = meta && typeof meta === 'object' && !Array.isArray(meta)
    ? meta as Record<string, unknown>
    : {};

  return {
    ...currentMeta,
    gmc_enabled: gmcEnabled,
  };
}

/**
 * Check if a product is eligible for the Google Merchant Center feed.
 * A product must:
 * - Be explicitly enabled for GMC (gmc_enabled === true)
 * - Be published
 * - Have a title, slug, and at least one image
 * - Have a valid price > 0
 * - Have a currency set
 */
export function isGmcFeedEligibleProduct(product: GmcProductLike): boolean {
  const title = typeof product.title === 'string' ? product.title.trim() : '';
  const slug = typeof product.slug === 'string' ? product.slug.trim() : '';
  const currency = typeof product.currency === 'string' ? product.currency.trim() : '';
  const images = Array.isArray(product.images) ? product.images : [];
  const hasImage = images.some(image => typeof image === 'string' && image.trim().length > 0);
  const price = Number(product.price);

  return isGmcSelected(product)
    && product.published !== false
    && title.length > 0
    && slug.length > 0
    && hasImage
    && Number.isFinite(price)
    && price > 0
    && currency.length > 0;
}
