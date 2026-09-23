# Google Merchant Center - Takimia.com Complete Guide

## ✅ Current Status (September 23, 2026)

**Feed Status:** Working ✅  
**Products in Feed:** 11/11 ✅  
**Feed URL:** https://takimia.com/api/feed/google?country=US&currency=USD

---

## 🚀 Quick Action Required

### Go to Google Merchant Center NOW and force a feed refresh:

1. Visit: https://merchants.google.com/
2. Navigate to: **Products → Feeds**
3. Find your Takimia feed
4. Click: **"Fetch now"** button
5. Wait 5-10 minutes and check the Products tab

**Expected Result:** You should see 11 products appear in GMC

---

## 🔧 What Was Fixed

### Problem 1: Wrong Feed Logic
The feed was checking `gmc_enabled !== false` instead of `gmc_enabled === true`, which included products that weren't explicitly enabled.

**Fix:** Updated `src/app/api/feed/google/route.ts` to only include explicitly enabled products.

### Problem 2: Products Not Published  
All 11 products had `meta.published: false` in the database.

**Fix:** Ran `scripts/publish-all-products.mjs` to set all products to published.

---

## 📋 Products Now in Feed (11 Total)

| # | Product | Price |
|---|---------|-------|
| 1 | Takimia TouchPress Espresso Machine | $1,199.00 |
| 2 | Takimia TouchBrew Espresso Machine | $799.00 |
| 3 | Takimia ProGrind Espresso Machine | $699.00 |
| 4 | Takimia LuxeTherm Coffee Maker | $244.00 |
| 5 | Takimia LuxeGlass Coffee Maker | $227.00 |
| 6 | Takimia GrindBrew Coffee Maker | $299.00 |
| 7 | Takimia DuoCraft Espresso Setup | $1,399.00 |
| 8 | Takimia DuoBoiler Espresso Machine | $1,299.00 |
| 9 | Takimia Compacta Plus Espresso Machine | $449.96 |
| 10 | Takimia Compacta Espresso Machine | $269.96 |
| 11 | Takimia AeroJet Espresso Machine | $1,690.00 |

**Total Product Value:** $9,063.92

---

## 🛠️ Maintenance Scripts

### Check GMC Status
See which products are eligible for the feed:
```bash
cd takimia.com
node scripts/check-gmc-status.mjs
```

### Publish Products
Make products visible on the site and in GMC:
```bash
node scripts/publish-all-products.mjs
```

### Enable GMC for Products
Enable products for Google Merchant Center:
```bash
node scripts/enable-all-gmc.mjs
```

### Debug Publishing Issues
Check the actual database values:
```bash
node scripts/debug-published-status.mjs
```

---

## 📝 How to Add New Products to GMC

### Option 1: Through Admin Dashboard (Recommended)
1. Go to: https://takimia.com/admin/products
2. Edit the product you want to add to GMC
3. Make sure the product is **Published** (toggle at top)
4. Click the **"Enable for GMC"** button
5. Save the product
6. Wait 5-10 minutes for the feed to update
7. Go to GMC and click "Fetch now"

### Option 2: Bulk Enable All Products
```bash
cd takimia.com
node scripts/enable-all-gmc.mjs
node scripts/publish-all-products.mjs
```

---

## 🔍 Feed Requirements

For a product to appear in the GMC feed, it MUST have:

✅ `meta.gmc_enabled === true` (explicitly enabled)  
✅ `meta.published !== false` (published)  
✅ Valid title  
✅ Valid slug  
✅ At least one image  
✅ Valid price > 0  
✅ Currency = "USD"  

---

## 🐛 Troubleshooting

### Products not appearing in GMC?

**Check 1:** Verify products are eligible
```bash
node scripts/check-gmc-status.mjs
```

**Check 2:** Verify feed has products
```bash
curl https://takimia.com/api/feed/google?country=US&currency=USD
```

**Check 3:** Check GMC for errors
- Go to GMC → Diagnostics
- Look for feed errors or product disapprovals

**Check 4:** Force a feed refresh
- GMC → Feeds → Click "Fetch now"

### Feed shows 0 products?

Run this command to see what's wrong:
```bash
node scripts/check-gmc-status.mjs
```

Common issues:
- Products not published (`meta.published: false`)
- Products not enabled for GMC (`meta.gmc_enabled: false`)
- Missing required data (title, images, price)

### GMC showing errors?

Common GMC errors and fixes:

| Error | Fix |
|-------|-----|
| Missing price | Check product has valid `price > 0` |
| Missing image | Check product has at least one image URL |
| Invalid GTIN | Add `identifier_exists: no` (already in feed) |
| Missing description | Check product has description text |

---

## 📊 Feed Specifications

**Feed Format:** RSS 2.0 with Google Merchant Center namespace  
**Feed URL:** https://takimia.com/api/feed/google?country=US&currency=USD  
**Update Frequency:** Real-time (no caching)  
**Supported Markets:** US only (USD)  
**Shipping:** Free Standard Shipping (5-9 days transit)

### Feed Fields Included:
- `g:id` - Product SKU
- `title` - Product title
- `description` - Product description
- `link` - Product page URL
- `g:image_link` - Main product image
- `g:price` - Product price in USD
- `g:availability` - In stock / Out of stock
- `g:condition` - New / Used / Refurbished
- `g:brand` - Takimia
- `g:product_type` - Product category
- `g:identifier_exists` - Set to "no" (no GTINs)
- `g:shipping` - Free shipping details

---

## 🔐 Security Note

The `.env.local` file contains sensitive credentials and should NEVER be committed to git. It's already in `.gitignore`.

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Run diagnostic scripts
3. Check GMC Diagnostics tab
4. Review feed XML directly: https://takimia.com/api/feed/google?country=US&currency=USD

---

## ✅ Verification Checklist

After forcing a feed fetch in GMC, verify:

- [ ] GMC shows 11 products (not 0)
- [ ] No errors in GMC Diagnostics tab
- [ ] Products show status "Approved" or "Pending"
- [ ] Product images load correctly
- [ ] Product prices are correct
- [ ] Product links work

---

**Last Updated:** September 23, 2026  
**Feed Status:** ✅ Operational  
**Next Review:** Monitor GMC for 24-48 hours for approval status
