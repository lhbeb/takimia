require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const images = {
  'keurig-k-express-111488395': 'https://i5.walmartimages.com/seo/Keurig-K-Express-Essentials-Single-Serve-K-Cup-Pod-Coffee-Maker-Black_1f5cf20c-92af-4f8b-b2a6-fd273417fc49.2d0167b955af894b47a893e2b7c9e055.jpeg?odnHeight=573&odnWidth=573&odnBg=FFFFFF',
  'ninja-dualbrew-pro-6471084': 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6471/6471084_sd.jpg;maxHeight=1080;maxWidth=900?format=webp',
  'ninja-luxe-cafe-6582908': 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6582/6582908_sd.jpg;maxHeight=1080;maxWidth=900?format=webp',
  'delonghi-magnifica-start-6588878': 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6588/6588878_sd.jpg;maxHeight=1080;maxWidth=900?format=webp',
  'keurig-k-elite': 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/1277/12779813_sd.jpg;maxHeight=1080;maxWidth=900?format=webp',
  'delonghi-la-specialista-6573737': 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6573/6573737_sd.jpg;maxHeight=1080;maxWidth=900?format=webp',
  'delonghi-classic-6615146': 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6615/6615146_sd.jpg;maxHeight=1080;maxWidth=900?format=webp'
};
(async()=>{
 let updated=0;
 for (const [id,url] of Object.entries(images)) {
   const {data:row,error:re}=await supabase.from('products').select('id,images').eq('id',id).maybeSingle(); if(re) throw re;
   if(!row) { console.log('missing record',id); continue; }
   const {error}=await supabase.from('products').update({images:[url]}).eq('id',id); if(error) throw error; updated++;
 }
 const {data:verify,error:ve}=await supabase.from('products').select('id,title,images').in('id',Object.keys(images)); if(ve) throw ve;
 console.log(JSON.stringify({updated,verified:verify.length,missingImages:verify.filter(x=>!Array.isArray(x.images)||x.images.length===0).map(x=>x.id),records:verify.map(x=>({id:x.id,title:x.title,imageCount:x.images?.length||0}))},null,2));
})().catch(e=>{console.error(e.message);process.exit(1)});
