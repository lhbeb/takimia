/**
 * Remove retailer text and fix truncations
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
  
  // Remove "Takimia is an independent retailer..." and truncated endings
  cleaned = cleaned.replace(/Takimia is an independent retailer[^.]*\.?\s*$/i, '');
  cleaned = cleaned.replace(/offering the Ha Condition: Brand New\.\s*$/i, '');
  cleaned = cleaned.replace(/\s+Condition:\s*$/i, '');
  cleaned = cleaned.replace(/the included Quick Start Guide and onli Condition:\s*$/i, '');
  
  // Remove any trailing retailer disclaimers
  cleaned = cleaned.replace(/Takimia customers[^.]*\.\s*/g, '');
  cleaned = cleaned.replace(/Takimia espresso machines are designed to use the right dose[^.]*\.\s*/g, '');
  
  // Clean up spacing
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned;
}

async function main() {
  console.log('🔍 Fetching all products...\n');

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
    console.log('✅ No retailer text found');
    return;
  }

  console.log(`📦 Found ${updates.length} products with retailer text:\n`);

  for (const update of updates) {
    console.log(`---`);
    console.log(`Title: ${update.title}`);
    console.log(`Slug: ${update.slug}`);
    
    // Show what was removed
    if (update.original.includes('Takimia is an independent retailer')) {
      console.log('  - Removed: Independent retailer text');
    }
    if (update.original.includes('offering the Ha Condition')) {
      console.log('  - Fixed: Truncated "offering the Ha Condition" ending');
    }
    if (update.original.match(/\s+Condition:\s*$/)) {
      console.log('  - Fixed: Truncated "Condition:" ending');
    }
    if (update.original.includes('onli Condition:')) {
      console.log('  - Fixed: Truncated "onli Condition:" ending');
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
