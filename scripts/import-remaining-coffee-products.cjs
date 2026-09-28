require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const sellerId = 'c4d811e1-04f7-47d2-8115-3f1f329bd86a';
const records = [
  { id:'nespresso-vertuo-pop-6588349', title:"Nespresso Vertuo Pop+ Coffee and Espresso Maker by De'Longhi with Milk Frother - Liquorice Black", price:119.99, brand:'Nespresso', source:'https://www.bestbuy.com/product/nespresso-vertuo-pop-coffee-and-espresso-maker-by-delonghi-with-milk-frother-liquorice-black/J7G8Z3WRWW/sku/6588349' },
  { id:'bella-pro-12-cup-6553385', title:'bella PRO 12-Cup Programmable Coffee Maker - Stainless Steel', price:29.99, brand:'bella PRO', source:'https://www.bestbuy.com/product/bella-pro-12-cup-programmable-coffee-maker-stainless-steel/J3P5RSSWCT/sku/6553385' },
  { id:'hamilton-beach-flexbrew-5032284836', title:'Hamilton Beach FlexBrew Advanced 5-in-1 Coffee Maker, Single-Serve and 12-Cup Carafe, Ice or Hot Brew', price:87.00, brand:'Hamilton Beach', source:'https://www.walmart.com/ip/Hamilton-Beach-FlexBrew-Advanced-5-in-1-Coffee-Maker-Single-Serve-12-Cup-Carafe-Ice-or-Hot-Brew/5032284836' }
];
(async()=>{
 const ids=records.map(r=>r.id); const {data:existing,error:ee}=await supabase.from('products').select('id').in('id',ids); if(ee) throw ee;
 const existingIds=new Set((existing||[]).map(x=>x.id));
 const payload=records.filter(r=>!existingIds.has(r.id)).map(r=>({id:r.id,slug:r.id,title:r.title,description:`${r.title}. Product information captured from the source retailer page.`,price:r.price,images:[],condition:'New',category:'Coffee Makers',brand:r.brand,payee_email:'',checkout_link:'',checkout_flow:'stripe',currency:'USD',rating:0,review_count:0,reviews:[],meta:{gmc_enabled:false,published:true,source_url:r.source,source_retrieved_via:'browser'},in_stock:true,is_featured:false,listed_by:'jebbar',seller_id:sellerId,collections:['Coffee Makers']}));
 if(payload.length){const {error}=await supabase.from('products').insert(payload);if(error)throw error;}
 const {data:verify,error:ve}=await supabase.from('products').select('id,listed_by,seller_id,checkout_flow,price,meta').in('id',ids);if(ve)throw ve;
 console.log(JSON.stringify({attempted:records.length,inserted:payload.length,verified:verify?.length||0,gmcEnabled:verify?.filter(x=>x.meta?.gmc_enabled===true).length||0,gmcDisabled:verify?.filter(x=>x.meta?.gmc_enabled===false).length||0},null,2));
})().catch(e=>{console.error(e.message);process.exit(1)});
