/**
 * Sync Takimia products to the public Shopify catalog used by Tazoota.
 *
 * This uses Shopify's public products.json endpoint, so it does not require
 * an Admin API token. Products are matched by handle first, then by exact
 * normalized title.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const storeDomain = (process.env.SHOPIFY_PUBLIC_STORE_DOMAIN || 'checkout.tazoota.com').replace(/^https?:\/\//, '').replace(/\/$/, '');
const catalogUrl = `https://${storeDomain}/products.json?limit=250`;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

type ShopifyVariant = {
  id: number;
  title?: string;
  sku?: string | null;
};

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  variants: ShopifyVariant[];
};

type TakimiaProduct = {
  id: string;
  slug: string;
  title: string;
  meta: Record<string, unknown> | null;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const response = await fetch(catalogUrl, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Public Shopify catalog request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json() as { products?: ShopifyProduct[] };
  if (!Array.isArray(payload.products)) {
    throw new Error('Public Shopify catalog response did not contain products.');
  }
  return payload.products;
}

async function fetchTakimiaProducts(): Promise<TakimiaProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, title, meta');

  if (error) throw new Error(`Takimia Supabase read failed: ${error.message}`);
  return (data || []) as TakimiaProduct[];
}

function indexByKey(products: ShopifyProduct[], key: (product: ShopifyProduct) => string): Map<string, ShopifyProduct> {
  const index = new Map<string, ShopifyProduct>();
  for (const product of products) {
    const value = key(product);
    if (value && !index.has(value)) index.set(value, product);
  }
  return index;
}

async function main(): Promise<void> {
  console.log(`Reading public Shopify catalog: ${catalogUrl}`);
  const [shopifyProducts, takimiaProducts] = await Promise.all([
    fetchShopifyProducts(),
    fetchTakimiaProducts(),
  ]);

  const byHandle = indexByKey(shopifyProducts, product => product.handle);
  const byTitle = indexByKey(shopifyProducts, product => normalize(product.title));
  let updated = 0;
  let unmatched = 0;
  let skipped = 0;

  for (const product of takimiaProducts) {
    const shopifyProduct = byHandle.get(product.slug) || byTitle.get(normalize(product.title));
    const variant = shopifyProduct?.variants?.[0];

    if (!shopifyProduct || !variant?.id) {
      unmatched++;
      console.log(`UNMATCHED: ${product.slug}`);
      continue;
    }

    const nextMeta = {
      ...(product.meta || {}),
      shopify_variant_id: String(variant.id),
      shopify_variant_gid: `gid://shopify/ProductVariant/${variant.id}`,
      shopify_product_id: String(shopifyProduct.id),
      shopify_store_domain: storeDomain,
      shopify_handle: shopifyProduct.handle,
      shopify_synced_at: new Date().toISOString(),
      shopify_sync_source: 'public-products-json',
    };

    const { error } = await supabase
      .from('products')
      .update({ meta: nextMeta, checkout_flow: 'shopify' })
      .eq('id', product.id);

    if (error) {
      throw new Error(`Failed updating ${product.slug}: ${error.message}`);
    }

    updated++;
    console.log(`UPDATED: ${product.slug} -> ${variant.id} (${shopifyProduct.handle})`);
  }

  skipped = takimiaProducts.length - updated - unmatched;
  console.log('\nSync complete');
  console.log(`Takimia products: ${takimiaProducts.length}`);
  console.log(`Shopify catalog products: ${shopifyProducts.length}`);
  console.log(`Updated with variant IDs: ${updated}`);
  console.log(`Unmatched: ${unmatched}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
