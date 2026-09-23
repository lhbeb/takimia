/**
 * Script to publish all Takimia products (set meta.published = true)
 * Run with: node scripts/publish-all-products.mjs
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

console.log('📢 Publishing all Takimia products...\n');

// Fetch all products
const { data: products, error } = await supabase
  .from('products')
  .select('slug, title, meta, published')
  .order('created_at', { ascending: false });

if (error) {
  console.error('❌ Error fetching products:', error);
  process.exit(1);
}

console.log(`📦 Found ${products.length} products in database\n`);

// Filter products that need to be published
const productsToPublish = products.filter((product) => {
  const meta = product.meta || {};
  return product.published === false || meta.published === false;
});

console.log(`📊 Products to publish: ${productsToPublish.length}\n`);

if (productsToPublish.length === 0) {
  console.log('✅ All products are already published!');
  process.exit(0);
}

let successCount = 0;
let failCount = 0;

for (const product of productsToPublish) {
  const meta = product.meta || {};
  
  const { error: updateError } = await supabase
    .from('products')
    .update({
      meta: { ...meta, published: true },
      updated_at: new Date().toISOString()
    })
    .eq('slug', product.slug);

  if (updateError) {
    console.error(`❌ Failed to publish ${product.slug}:`, updateError);
    failCount++;
  } else {
    console.log(`✅ Published: ${product.title} (${product.slug})`);
    successCount++;
  }
}

console.log('\n📊 Summary:');
console.log(`   ✅ Successfully published: ${successCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`\n✨ Done! Products should now appear in the Google Merchant Center feed.`);
console.log(`   Feed URL: https://takimia.com/api/feed/google?country=US&currency=USD`);
console.log(`\n💡 Note: You may need to wait a few minutes for Google to re-fetch the feed.`);
