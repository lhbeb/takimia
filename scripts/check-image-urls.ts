/**
 * Check product image URLs for Shopify export
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: products } = await supabase
    .from('products')
    .select('slug, title, images')
    .order('title')
    .limit(5);

  if (!products) {
    console.log('No products found');
    return;
  }

  console.log('Sample product images:\n');
  
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Images:`, p.images);
    console.log();
  });
}

main().catch(console.error);
