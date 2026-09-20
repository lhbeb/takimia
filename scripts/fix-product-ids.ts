/**
 * Fix Product IDs/Slugs for Takimia GMC Compliance
 * Converts generic product IDs to Takimia-branded IDs
 * Run with: npx tsx scripts/fix-product-ids.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .txt file
const envFilePath = path.resolve(__dirname, '../../new env vars gmc - Takimia.txt');
const envContent = fs.readFileSync(envFilePath, 'utf-8');

// Parse env vars
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...valueParts] = trimmed.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Looking for env file at:', envFilePath);
  console.error('Found vars:', Object.keys(envVars));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapping of old generic IDs to new Takimia-branded IDs
const ID_MAPPING: Record<string, string> = {
  // Espresso Machines
  'THE-ORACLE-JET': 'takimia-aero-jet-espresso-machine',
  'the-oracle-jet': 'takimia-aero-jet-espresso-machine',
  'THE-DYNAMIC-DUO': 'takimia-dynamic-duo-espresso-grinder',
  'the-dynamic-duo': 'takimia-dynamic-duo-espresso-grinder',
  'THE-BARISTA-PRO': 'takimia-barista-pro-espresso-machine',
  'the-barista-pro': 'takimia-barista-pro-espresso-machine',
  'THE-BARISTA-TOUCH': 'takimia-barista-touch-espresso-machine',
  'the-barista-touch': 'takimia-barista-touch-espresso-machine',
  'THE-BARISTA-TOUCH-IMPRESS': 'takimia-barista-touch-impress',
  'the-barista-touch-impress': 'takimia-barista-touch-impress',
  'THE-BAMBINO-PLUS': 'takimia-bambino-plus-espresso-machine',
  'the-bambino-plus': 'takimia-bambino-plus-espresso-machine',
  'THE-BAMBINO': 'takimia-bambino-espresso-machine',
  'the-bambino': 'takimia-bambino-espresso-machine',
  'THE-DUAL-BOILER': 'takimia-dual-boiler-espresso-machine',
  'the-dual-boiler': 'takimia-dual-boiler-espresso-machine',
  
  // Coffee Makers
  'THE-LUXE-BREWER-THERMAL': 'takimia-luxe-thermal-coffee-maker',
  'the-luxe-brewer-thermal': 'takimia-luxe-thermal-coffee-maker',
  'luxe-brewer-glass': 'takimia-luxe-glass-coffee-maker',
  'LUXE-BREWER-GLASS': 'takimia-luxe-glass-coffee-maker',
  'THE-GRIND-CONTROL-BREWER': 'takimia-grind-control-coffee-maker',
  'the-grind-control-brewer': 'takimia-grind-control-coffee-maker',
  'THE-GRIND-CONTROL': 'takimia-grind-control-coffee-maker',
  'the-grind-control': 'takimia-grind-control-coffee-maker',
  'THE-PRECISION-BREWER-THERMAL': 'takimia-precision-thermal-brewer',
  'the-precision-brewer-thermal': 'takimia-precision-thermal-brewer',
  
  // Accessories
  'THE-MILK-CAFE': 'takimia-milk-cafe-frother',
  'the-milk-cafe': 'takimia-milk-cafe-frother',
};

async function fixProductIds() {
  console.log('🔧 Starting Product ID Fix for Takimia GMC Compliance\n');

  // Fetch all products with all fields
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .order('title');

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError);
    return;
  }

  if (!products || products.length === 0) {
    console.log('📭 No products found in database');
    return;
  }

  console.log(`Found ${products.length} products to process\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const oldId = product.id;
    const oldSlug = product.slug;
    
    // Check if product needs updating
    let newId = ID_MAPPING[oldId] || ID_MAPPING[oldSlug];
    
    if (!newId) {
      // Product already has Takimia branding or doesn't need update
      if (oldId.toLowerCase().includes('takimia')) {
        console.log(`✅ SKIP: ${oldId} (already Takimia-branded)`);
        skipped++;
        continue;
      } else {
        // Unknown product - generate Takimia ID
        newId = `takimia-${oldId.toLowerCase().replace(/^the-/, '')}`;
      }
    }

    console.log(`🔄 UPDATE: ${oldId} → ${newId}`);

    try {
      // Update images array (replace old ID with new in image URLs)
      const updatedImages = product.images?.map((img: string) => 
        img.replace(`/product-images/${oldSlug}/`, `/product-images/${newId}/`)
           .replace(`/product-images/${oldId}/`, `/product-images/${newId}/`)
      ) || [];

      // Create a clean product object with all required fields
      // Remove system fields that shouldn't be copied
      const { created_at, updated_at, ...productData } = product;
      
      const newProduct = {
        ...productData,
        id: newId,
        slug: newId,
        images: updatedImages,
      };

      // First, insert new product with new ID
      const { error: insertError } = await supabase
        .from('products')
        .insert(newProduct);

      if (insertError) {
        if (insertError.code === '23505') {
          console.log(`   ⚠️  Product ${newId} already exists, deleting old one`);
          // Just delete the old one
          await supabase
            .from('products')
            .delete()
            .eq('id', oldId);
          skipped++;
          continue;
        }
        console.error(`   ❌ Failed to insert: ${insertError.message}`);
        console.error(`   Details:`, insertError);
        failed++;
        continue;
      }

      // Then delete old product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', oldId);

      if (deleteError) {
        console.error(`   ⚠️  Inserted new but failed to delete old: ${deleteError.message}`);
      }

      // Update orders table references
      await supabase
        .from('orders')
        .update({ product_slug: newId })
        .eq('product_slug', oldSlug);

      console.log(`   ✅ Success`);
      updated++;
    } catch (err) {
      console.error(`   ❌ Error:`, err);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('='.repeat(60));

  if (updated > 0) {
    console.log('\n✅ Product IDs updated successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Update category images in src/config/categories.ts');
    console.log('   2. Clear Google Merchant Center product feed');
    console.log('   3. Re-sync products with new Takimia-branded IDs');
    console.log('   4. Update Supabase storage folders to match new IDs');
  }
}

fixProductIds().catch(console.error);
