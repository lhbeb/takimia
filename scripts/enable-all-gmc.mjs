/**
 * Script to enable GMC for all published Takimia products
 * Run with: node scripts/enable-all-gmc.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Enabling GMC for all valid Takimia products...\n');

// Fetch all products
const { data: products, error } = await supabase
  .from('products')
  .select('slug, title, meta, published, currency, price, images')
  .order('created_at', { ascending: false });

if (error) {
  console.error('❌ Error fetching products:', error);
  process.exit(1);
}

console.log(`📦 Found ${products.length} products in database\n`);

// Filter products that should be enabled for GMC
const productsToEnable = products.filter((product) => {
  const meta = product.meta || {};
  const published = product.published !== false && meta.published !== false;
  const hasValidData = 
    product.slug &&
    product.title &&
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) > 0 &&
    product.currency;
  
  // Enable if:
  // 1. Not already enabled (gmc_enabled !== true)
  // 2. Published
  // 3. Has valid data
  return meta.gmc_enabled !== true && published && hasValidData;
});

console.log(`📊 Products to enable: ${productsToEnable.length}\n`);

if (productsToEnable.length === 0) {
  console.log('✅ All valid products are already enabled for GMC!');
  process.exit(0);
}

let successCount = 0;
let failCount = 0;

for (const product of productsToEnable) {
  const meta = product.meta || {};
  
  const { error: updateError } = await supabase
    .from('products')
    .update({
      meta: { ...meta, gmc_enabled: true },
      updated_at: new Date().toISOString()
    })
    .eq('slug', product.slug);

  if (updateError) {
    console.error(`❌ Failed to enable GMC for ${product.slug}:`, updateError);
    failCount++;
  } else {
    console.log(`✅ Enabled GMC for: ${product.title} (${product.slug})`);
    successCount++;
  }
}

console.log('\n📊 Summary:');
console.log(`   ✅ Successfully enabled: ${successCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`\n✨ Done! Google Merchant Center feed should now include these products.`);
console.log(`   Feed URL: https://takimia.com/api/feed/google?country=US&currency=USD`);
