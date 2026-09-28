require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
(async () => {
  const { data: sellers, error: se } = await s.from('sellers').select('id,username,name').order('username');
  if (se) throw se;
  const { data: products, error: pe } = await s.from('products').select('listed_by,seller_id,checkout_flow').limit(1000);
  if (pe) throw pe;
  console.log(JSON.stringify({ sellers, productOwnership: products.reduce((m,p) => { const k = `${p.listed_by || 'NULL'}|${p.seller_id || 'NULL'}|${p.checkout_flow || 'NULL'}`; m[k]=(m[k]||0)+1; return m; }, {}) }, null, 2));
})().catch(e => { console.error(e.message); process.exit(1); });
