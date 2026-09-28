require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
(async () => {
  const { data, error } = await supabase.from('products').select('listed_by,seller_id,checkout_flow,meta').limit(1000);
  if (error) throw error;
  const counts = (key) => Object.entries(data.reduce((m, x) => { const value = x[key] ?? 'NULL'; m[value] = (m[value] || 0) + 1; return m; }, {}));
  console.log(JSON.stringify({
    total: data.length,
    listedBy: counts('listed_by'),
    sellerAssigned: data.filter((x) => x.seller_id).length,
    checkoutFlows: counts('checkout_flow'),
    gmcEnabled: data.filter((x) => x.meta?.gmc_enabled === true).length,
    gmcDisabled: data.filter((x) => x.meta?.gmc_enabled === false).length,
    gmcMissing: data.filter((x) => x.meta?.gmc_enabled === undefined).length,
  }, null, 2));
})().catch((error) => { console.error(error.message); process.exit(1); });
