/**
 * Check specific products for fake testimonials
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
  // Check products that might have "Takimia" brand
  const { data: products } = await supabase
    .from('products')
    .select('id, slug, title, description, brand, images')
    .ilike('brand', '%Takimia%')
    .order('title');

  if (!products || products.length === 0) {
    console.log('No Takimia brand products found');
    return;
  }

  console.log(`Found ${products.length} Takimia brand products:\n`);
  
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Brand: ${p.brand}`);
    console.log(`   Images:`, p.images?.[0] || 'None');
    console.log(`   Description (first 400 chars):`);
    console.log(`   ${p.description?.substring(0, 400) || 'No description'}...`);
    console.log();
  });
}

main().catch(console.error);
