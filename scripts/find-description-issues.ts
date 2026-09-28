/**
 * Find products with leaked source text and truncated descriptions
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
    .select('id, slug, title, description')
    .order('title');

  if (!products) return;

  const issues = products.filter(p => {
    const desc = p.description || '';
    return desc.includes('Product information captured') ||
           desc.includes('Source product ID') ||
           desc.includes('Condition: Brand New.') ||
           desc.match(/\d{7}/) ||
           desc.match(/\s+Condition:\s*$/) ||
           desc.includes('onli Condition:');
  });

  console.log(`Found ${issues.length} products with issues:\n`);
  
  issues.forEach(p => {
    console.log('---');
    console.log('Title:', p.title);
    console.log('Slug:', p.slug);
    console.log('Description:', p.description);
    console.log();
  });
}

main().catch(console.error);
