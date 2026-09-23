/**
 * Debug script to check the actual published status in the database
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data: products, error } = await supabase
  .from('products')
  .select('slug, title, meta')
  .limit(3);

if (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}

console.log('📊 Sample products from database:\n');
products.forEach((p, i) => {
  console.log(`${i + 1}. ${p.title}`);
  console.log(`   Slug: ${p.slug}`);
  console.log(`   Meta object:`, JSON.stringify(p.meta, null, 2));
  console.log(`   meta.published value: ${p.meta?.published}`);
  console.log(`   meta.published === false: ${p.meta?.published === false}`);
  console.log(`   meta.published !== false: ${p.meta?.published !== false}`);
  console.log('');
});
