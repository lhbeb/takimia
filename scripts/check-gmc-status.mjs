/**
 * Diagnostic script to check GMC status of Takimia products
 * Run with: node scripts/check-gmc-status.mjs
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

console.log('🔍 Checking GMC status of all Takimia products...\n');

const { data: products, error } = await supabase
  .from('products')
  .select('slug, title, meta, published, currency, price, images')
  .order('created_at', { ascending: false });

if (error) {
  console.error('❌ Error fetching products:', error);
  process.exit(1);
}

console.log(`📦 Total products in database: ${products.length}\n`);

let gmcEnabled = 0;
let gmcDisabled = 0;
let gmcUndefined = 0;
let notPublished = 0;
let missingData = 0;

const categories = {
  enabled: [],
  disabled: [],
  undefined: [],
  notPublished: [],
  missingData: []
};

products.forEach((product) => {
  const meta = product.meta || {};
  const gmcStatus = meta.gmc_enabled;
  const published = meta.published !== false;
  const hasValidData = 
    product.slug &&
    product.title &&
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    Number.isFinite(Number(product.price)) &&
    Number(product.price) > 0 &&
    product.currency;

  const summary = {
    slug: product.slug,
    title: product.title?.substring(0, 60) || 'Untitled',
    gmc_enabled: gmcStatus,
    published: published,
    price: product.price,
    currency: product.currency,
    hasImages: Array.isArray(product.images) && product.images.length > 0
  };

  if (gmcStatus === true) {
    gmcEnabled++;
    if (!published) {
      notPublished++;
      categories.notPublished.push(summary);
    } else if (!hasValidData) {
      missingData++;
      categories.missingData.push(summary);
    } else {
      categories.enabled.push(summary);
    }
  } else if (gmcStatus === false) {
    gmcDisabled++;
    categories.disabled.push(summary);
  } else {
    gmcUndefined++;
    categories.undefined.push(summary);
  }
});

console.log('📊 GMC Status Summary:');
console.log(`   ✅ GMC Enabled (gmc_enabled === true): ${gmcEnabled}`);
console.log(`   ❌ GMC Disabled (gmc_enabled === false): ${gmcDisabled}`);
console.log(`   ⚠️  GMC Undefined (gmc_enabled is undefined): ${gmcUndefined}`);
console.log(`   📝 Not Published: ${notPublished}`);
console.log(`   ⚠️  Missing Required Data: ${missingData}\n`);

console.log('📋 Products that WILL appear in GMC feed (enabled + published + valid data):');
console.log(`   Total: ${categories.enabled.length}\n`);
if (categories.enabled.length > 0) {
  categories.enabled.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title}`);
    console.log(`      - Slug: ${p.slug}`);
    console.log(`      - Price: ${p.price} ${p.currency}`);
  });
} else {
  console.log('   ⚠️  NO PRODUCTS WILL APPEAR IN THE FEED!');
}

console.log('\n⚠️  Products with GMC enabled but NOT published:');
if (categories.notPublished.length > 0) {
  categories.notPublished.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title} (${p.slug})`);
  });
} else {
  console.log('   None');
}

console.log('\n⚠️  Products with GMC enabled but missing required data:');
if (categories.missingData.length > 0) {
  categories.missingData.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title} (${p.slug})`);
    console.log(`      - Has images: ${p.hasImages}`);
    console.log(`      - Price: ${p.price} ${p.currency}`);
  });
} else {
  console.log('   None');
}

console.log('\n❌ Products explicitly disabled for GMC (gmc_enabled === false):');
if (categories.disabled.length > 0) {
  categories.disabled.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title} (${p.slug})`);
  });
} else {
  console.log('   None');
}

console.log('\n⚠️  Products with undefined GMC status (need to be explicitly enabled):');
if (categories.undefined.length > 0) {
  categories.undefined.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title} (${p.slug})`);
  });
  console.log(`\n   💡 Run the following to enable all undefined products:`);
  console.log(`      node scripts/enable-all-gmc.mjs`);
} else {
  console.log('   None');
}

console.log('\n✅ Diagnostic complete!');
