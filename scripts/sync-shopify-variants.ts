/**
 * Sync Shopify Variant IDs to Takimia Supabase
 * 
 * This script fetches all products from your Shopify store (tazoota.myshopify.com)
 * and updates the corresponding products in Takimia Supabase with their Shopify variant IDs.
 * 
 * Required environment variables:
 * - SHOPIFY_STORE_DOMAIN: Your Shopify store domain (e.g., tazoota.myshopify.com)
 * - SHOPIFY_ADMIN_ACCESS_TOKEN: Your Shopify Admin API access token
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Shopify API configuration
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'tazoota.myshopify.com';
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = '2024-01';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN is not set in .env.local');
  console.log('\nTo get your Shopify Admin API access token:');
  console.log('1. Go to: https://admin.shopify.com/store/tazoota/settings/apps/development');
  console.log('2. Create a custom app (if not already created)');
  console.log('3. Configure Admin API scopes: read_products, read_inventory');
  console.log('4. Install the app and copy the Admin API access token');
  console.log('5. Add to .env.local: SHOPIFY_ADMIN_ACCESS_TOKEN=your_token_here\n');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials are not set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  variants: Array<{
    id: string;
    title: string;
    sku?: string;
    price: string;
  }>;
}

interface ShopifyGraphQLResponse {
  data: {
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                sku?: string;
                price: string;
              };
            }>;
          };
        };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

/**
 * Fetch all products from Shopify using GraphQL Admin API
 */
async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  console.log('🔄 Fetching products from Shopify...');

  while (hasNextPage) {
    const query = `
      query GetProducts($cursor: String) {
        products(first: 50, after: $cursor) {
          edges {
            node {
              id
              title
              handle
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    try {
      const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query,
          variables: { cursor },
        }),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
      }

      const result: ShopifyGraphQLResponse = await response.json();

      if (!result.data?.products) {
        throw new Error('Invalid response from Shopify API');
      }

      // Transform GraphQL response to our interface
      for (const edge of result.data.products.edges) {
        const node = edge.node;
        products.push({
          id: node.id,
          title: node.title,
          handle: node.handle,
          variants: node.variants.edges.map(v => ({
            id: v.node.id,
            title: v.node.title,
            sku: v.node.sku,
            price: v.node.price,
          })),
        });
      }

      hasNextPage = result.data.products.pageInfo.hasNextPage;
      cursor = result.data.products.pageInfo.endCursor;

      console.log(`   Fetched ${products.length} products so far...`);
    } catch (error) {
      console.error('❌ Error fetching Shopify products:', error);
      throw error;
    }
  }

  console.log(`✅ Fetched ${products.length} products from Shopify\n`);
  return products;
}

/**
 * Extract numeric variant ID from Shopify GID
 * Example: "gid://shopify/ProductVariant/12345" => "12345"
 */
function extractVariantId(gid: string): string {
  const match = gid.match(/\/(\d+)$/);
  return match ? match[1] : gid;
}

/**
 * Match Shopify products to Supabase products and update variant IDs
 */
async function syncVariantIds(shopifyProducts: ShopifyProduct[]) {
  console.log('🔄 Syncing variant IDs to Supabase...\n');

  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (const shopifyProduct of shopifyProducts) {
    const handle = shopifyProduct.handle;
    
    // Get the first variant (most products have only one variant)
    const firstVariant = shopifyProduct.variants[0];
    if (!firstVariant) {
      console.log(`⚠️  No variants found for: ${shopifyProduct.title}`);
      notFoundCount++;
      continue;
    }

    const variantId = extractVariantId(firstVariant.id);
    const variantGid = firstVariant.id;

    try {
      // Find product in Supabase by slug (handle)
      const { data: existingProduct, error: fetchError } = await supabase
        .from('products')
        .select('id, slug, title, meta')
        .eq('slug', handle)
        .single();

      if (fetchError || !existingProduct) {
        console.log(`⚠️  Not found in Supabase: ${shopifyProduct.title} (handle: ${handle})`);
        notFoundCount++;
        continue;
      }

      // Update product with Shopify variant information
      const updatedMeta = {
        ...(existingProduct.meta || {}),
        shopify_variant_id: variantId,
        shopify_variant_gid: variantGid,
        shopify_store_domain: SHOPIFY_STORE_DOMAIN,
        shopify_product_id: extractVariantId(shopifyProduct.id),
        shopify_handle: handle,
        shopify_synced_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('products')
        .update({
          meta: updatedMeta,
          checkout_flow: 'shopify', // Set checkout flow to Shopify
        })
        .eq('id', existingProduct.id);

      if (updateError) {
        console.error(`❌ Error updating ${existingProduct.title}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✅ Updated: ${existingProduct.title}`);
        console.log(`   Variant ID: ${variantId}`);
        console.log(`   Variant GID: ${variantGid}`);
        console.log(`   Price: $${firstVariant.price}\n`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${shopifyProduct.title}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Sync Summary:');
  console.log(`   ✅ Successfully updated: ${successCount} products`);
  console.log(`   ⚠️  Not found in Supabase: ${notFoundCount} products`);
  console.log(`   ❌ Errors: ${errorCount} products`);
  console.log(`   📦 Total Shopify products: ${shopifyProducts.length}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Shopify Variant Sync\n');
  console.log(`Shopify Store: ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`Supabase URL: ${SUPABASE_URL}\n`);

  try {
    // Fetch products from Shopify
    const shopifyProducts = await fetchShopifyProducts();

    if (shopifyProducts.length === 0) {
      console.log('⚠️  No products found in Shopify store');
      return;
    }

    // Sync variant IDs to Supabase
    await syncVariantIds(shopifyProducts);

    console.log('\n✅ Sync completed successfully!');
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
