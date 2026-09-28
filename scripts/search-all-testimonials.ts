/**
 * Search ALL products for fake testimonials
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
  // Get ALL products
  const { data: products } = await supabase
    .from('products')
    .select('id, slug, title, description, brand')
    .order('title');

  if (!products) {
    console.log('No products found');
    return;
  }

  console.log(`Searching ${products.length} products for fake testimonials...\n`);
  
  const withTestimonials = products.filter(p => {
    const desc = p.description || '';
    return desc.toLowerCase().includes('takimia customers') || 
           desc.includes('Takimia customers');
  });

  if (withTestimonials.length === 0) {
    console.log('✅ No fake testimonials found in database');
    return;
  }

  console.log(`⚠️  Found ${withTestimonials.length} products with "Takimia customers":\n`);
  
  withTestimonials.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Brand: ${p.brand}`);
    
    const desc = p.description || '';
    const lines = desc.split('\n');
    lines.forEach((line, lineNum) => {
      if (line.toLowerCase().includes('takimia customers')) {
        console.log(`   Line ${lineNum + 1}: ${line.trim()}`);
      }
    });
    console.log();
  });
}

main().catch(console.error);
