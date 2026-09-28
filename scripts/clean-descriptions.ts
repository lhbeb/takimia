/**
 * Clean leaked source text and fix truncated descriptions
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function cleanDescription(desc: string): string {
  let cleaned = desc;
  
  // Remove "Source product ID: XXXXXXX" lines
  cleaned = cleaned.replace(/Source product ID: \d+\.\s*/g, '');
  
  // Remove "Product information captured from the source retailer page"
  cleaned = cleaned.replace(/Product information captured from the source retailer page\.?\s*/g, '');
  
  // Remove SKU lines from specifications sections
  cleaned = cleaned.replace(/- SKU: \d+\.\s*/gm, '');
  
  // Remove "Model: " lines that look like retailer SKUs (7+ digits)
  cleaned = cleaned.replace(/- Model: \d{7,}\.\s*/gm, '');
  
  // Fix truncated "onli Condition:" (should be removed entirely as it's a fragment)
  cleaned = cleaned.replace(/\s+onli Condition:\s*$/, '');
  
  // Fix truncated "offering the Ha Condition: Brand New."
  cleaned = cleaned.replace(/offering the Ha Condition: Brand New\.\s*$/, '');
  
  // Clean up any double spaces or trailing spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Clean up double newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}

async function main() {
  console.log('🔍 Fetching products with description issues...\n');

  const { data: products } = await supabase
    .from('products')
    .select('id, slug, title, description')
    .order('title');

  if (!products) {
    console.error('No products found');
    return;
  }

  const updates = [];

  for (const product of products) {
    const original = product.description || '';
    const cleaned = cleanDescription(original);
    
    if (original !== cleaned) {
      updates.push({
        id: product.id,
        slug: product.slug,
        title: product.title,
        original,
        cleaned
      });
    }
  }

  if (updates.length === 0) {
    console.log('✅ No description issues found');
    return;
  }

  console.log(`📦 Found ${updates.length} products to clean:\n`);

  for (const update of updates) {
    console.log(`---`);
    console.log(`Title: ${update.title}`);
    console.log(`Slug: ${update.slug}`);
    console.log(`Changes:`);
    
    // Show what was removed
    if (update.original.includes('Source product ID')) {
      console.log('  - Removed: Source product ID reference');
    }
    if (update.original.includes('Product information captured')) {
      console.log('  - Removed: Source capture notice');
    }
    if (update.original.match(/SKU: \d+/)) {
      console.log('  - Removed: SKU numbers');
    }
    if (update.original.includes('onli Condition:')) {
      console.log('  - Fixed: Truncated ending');
    }
    console.log();
  }

  console.log('📝 Updating products...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('products')
      .update({ description: update.cleaned })
      .eq('id', update.id);

    if (error) {
      console.error(`❌ Error updating ${update.slug}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Cleaned ${update.slug}`);
      successCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${updates.length}`);
}

main().catch(console.error);
