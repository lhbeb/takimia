/**
 * Fix product image URLs that were incorrectly updated to new folder names.
 * The Supabase storage folders still use the OLD names, so image URLs must
 * keep pointing to those old folder paths.
 * Run with: npx tsx scripts/fix-image-urls.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envFilePath = path.resolve(__dirname, '../../new env vars gmc - Takimia.txt');
const envContent = fs.readFileSync(envFilePath, 'utf-8');

const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...valueParts] = trimmed.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

// Map: new (broken) folder name → old (real) folder name in Supabase storage
const FOLDER_FIX: Record<string, string> = {
  'takimia-aero-jet-espresso-machine':    'the-oracle-jet',
  'takimia-dynamic-duo-espresso-grinder': 'the-dynamic-duo',
  'takimia-barista-pro-espresso-machine': 'the-barista-pro',
  'takimia-barista-touch-espresso-machine':'the-barista-touch',
  'takimia-barista-touch-impress':        'the-barista-touch-impress',
  'takimia-bambino-plus-espresso-machine':'the-bambino-plus',
  'takimia-bambino-espresso-machine':     'the-bambino',
  'takimia-dual-boiler-espresso-machine': 'the-dual-boiler',
  'takimia-luxe-thermal-coffee-maker':    'the-luxe-brewer-thermal',
  'takimia-luxe-glass-coffee-maker':      'luxe-brewer-glass',
  'takimia-grind-control-coffee-maker':   'the-grind-control',
  'takimia-milk-cafe-frother':            'the-milk-cafe',
};

function fixImageUrls(images: string[]): string[] {
  return images.map(url => {
    for (const [newFolder, oldFolder] of Object.entries(FOLDER_FIX)) {
      if (url.includes(`/product-images/${newFolder}/`)) {
        return url.replace(`/product-images/${newFolder}/`, `/product-images/${oldFolder}/`);
      }
    }
    return url;
  });
}

async function main() {
  console.log('🔧 Fixing product image URLs...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, images');

  if (error) { console.error('❌', error); return; }

  let fixed = 0;
  let skipped = 0;

  for (const product of products ?? []) {
    const images: string[] = product.images ?? [];
    const updatedImages = fixImageUrls(images);

    const changed = JSON.stringify(images) !== JSON.stringify(updatedImages);
    if (!changed) { skipped++; continue; }

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: updatedImages })
      .eq('id', product.id);

    if (updateError) {
      console.error(`❌ Failed to update ${product.id}:`, updateError.message);
    } else {
      console.log(`✅ Fixed: ${product.id}`);
      console.log(`   Before: ${images[0]}`);
      console.log(`   After:  ${updatedImages[0]}`);
      fixed++;
    }
  }

  console.log(`\n📊 Fixed: ${fixed} | Skipped (already correct): ${skipped}`);
}

main().catch(console.error);
