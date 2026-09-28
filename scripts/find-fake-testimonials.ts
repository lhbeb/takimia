/**
 * Find products with fake "Takimia customers" testimonials
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
    .select('id, slug, title, description, brand')
    .order('title');

  if (!products) return;

  const issues = products.filter(p => {
    const desc = p.description || '';
    return desc.includes('Takimia customers') || 
           desc.includes('Takimia espresso machines are designed to use the right dose');
  });

  console.log(`Found ${issues.length} products with fake testimonials:\n`);
  
  issues.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Brand: ${p.brand}`);
    
    const desc = p.description || '';
    const customerMatch = desc.match(/Takimia customers[^.]*\./);
    if (customerMatch) {
      console.log(`   Fake testimonial: "${customerMatch[0]}"`);
    }
    
    if (desc.includes('Takimia espresso machines are designed to use the right dose')) {
      console.log(`   Has fake "4 Keys Formula" text`);
    }
    
    console.log();
  });
}

main().catch(console.error);
