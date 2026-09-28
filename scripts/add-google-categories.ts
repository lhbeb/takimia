/**
 * Add Google Product Categories to Takimia Products
 * 
 * Maps Takimia product categories to Google Merchant Center taxonomy IDs
 * https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Google Product Category Taxonomy
// https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
const GOOGLE_CATEGORIES = {
  // Home & Garden > Kitchen & Dining > Kitchen Appliances > Coffee Makers & Espresso Machines
  ESPRESSO_MACHINES: '2901',
  COFFEE_MAKERS: '2901',
  COFFEE_GRINDERS: '2901',
  // Home & Garden > Kitchen & Dining > Kitchen Appliances > Small Kitchen Appliances
  MILK_FROTHERS: '2901',
  BARISTA_ACCESSORIES: '2901',
} as const;

interface ProductUpdate {
  id: string;
  slug: string;
  category: string;
  title: string;
  currentMeta: any;
  suggestedGmcCategory: string;
}

function determineGoogleCategory(product: any): string {
  const cat = String(product.category || '').toLowerCase();
  const slug = String(product.slug || '').toLowerCase();
  const title = String(product.title || '').toLowerCase();

  // All coffee/espresso equipment falls under the same Google category
  // Home & Garden > Kitchen & Dining > Kitchen Appliances > Coffee Makers & Espresso Machines
  return GOOGLE_CATEGORIES.ESPRESSO_MACHINES;
}

async function main() {
  console.log('🔍 Fetching Takimia products...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('title');

  if (error) {
    console.error('❌ Error fetching products:', error);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log('No products found');
    return;
  }

  const updates: ProductUpdate[] = [];

  for (const product of products) {
    const currentMeta = product.meta || {};
    const suggestedCategory = determineGoogleCategory(product);

    // Check if already has gmc_category
    if (currentMeta.gmc_category === suggestedCategory) {
      continue; // Already set correctly
    }

    updates.push({
      id: product.id,
      slug: product.slug,
      category: product.category || 'Uncategorized',
      title: product.title,
      currentMeta,
      suggestedGmcCategory: suggestedCategory,
    });
  }

  if (updates.length === 0) {
    console.log('✅ All products already have Google categories set');
    return;
  }

  console.log(`📦 Found ${updates.length} products to update:\n`);

  updates.forEach((update, index) => {
    console.log(`${index + 1}. ${update.title}`);
    console.log(`   Category: ${update.category}`);
    console.log(`   Google Category ID: ${update.suggestedGmcCategory}`);
    console.log(`   Current gmc_category: ${update.currentMeta.gmc_category || 'Not set'}\n`);
  });

  console.log('📝 Updating products with Google categories...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const newMeta = {
      ...update.currentMeta,
      gmc_category: update.suggestedGmcCategory,
    };

    const { error } = await supabase
      .from('products')
      .update({ meta: newMeta })
      .eq('id', update.id);

    if (error) {
      console.error(`❌ Error updating ${update.slug}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Updated ${update.slug}`);
      successCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${updates.length}`);

  console.log('\n💡 Note: Google Category 2901 = "Home & Garden > Kitchen & Dining > Kitchen Appliances > Coffee Makers & Espresso Machines"');
  console.log('   This category applies to all Takimia products (espresso machines, coffee makers, grinders, frothers)');
}

main().catch(console.error);
