/**
 * Audit script to check all product IDs in Takimia database
 * Run with: npx tsx scripts/audit-product-ids.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function auditProductIds() {
  console.log('🔍 Auditing Takimia Product IDs...\n');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, brand, category')
    .order('title');

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  if (!products || products.length === 0) {
    console.log('📭 No products found in database');
    return;
  }

  console.log(`Found ${products.length} products:\n`);
  console.log('='.repeat(100));
  console.log('ID'.padEnd(30), '| SLUG'.padEnd(30), '| TITLE'.padEnd(40));
  console.log('='.repeat(100));

  products.forEach((p) => {
    const idMatch = p.id.toLowerCase().includes('takimia');
    const slugMatch = p.slug.toLowerCase().includes('takimia');
    const titleMatch = p.title.toLowerCase().includes('takimia');
    
    const status = (idMatch && slugMatch && titleMatch) ? '✅' : '❌';
    
    console.log(
      `${status} ${p.id.padEnd(28)}`,
      `| ${p.slug.padEnd(28)}`,
      `| ${p.title.substring(0, 38).padEnd(38)}`
    );
  });

  console.log('='.repeat(100));
  console.log('\n📊 Summary:');
  
  const mismatched = products.filter(p => 
    !p.id.toLowerCase().includes('takimia') || 
    !p.slug.toLowerCase().includes('takimia')
  );
  
  if (mismatched.length > 0) {
    console.log(`\n⚠️  ${mismatched.length} products have generic (non-Takimia) IDs/slugs`);
    console.log('\nProducts needing ID/slug updates:');
    mismatched.forEach(p => {
      console.log(`  • ${p.id} → should be: takimia-${p.id.toLowerCase().replace(/^the-/, '')}`);
    });
  } else {
    console.log('✅ All products have Takimia branding in IDs/slugs');
  }
}

auditProductIds().catch(console.error);
