# Google Merchant Center Feed Fix - Takimia.com

**Date:** September 23, 2026  
**Issue:** Google Merchant Center showing 0 products despite feed being available  
**Status:** ✅ RESOLVED

## Root Cause Analysis

The issue had **two problems**:

### Problem 1: Incorrect Feed Eligibility Logic ❌
The feed route (`src/app/api/feed/google/route.ts`) was checking:
```typescript
product.meta?.gmc_enabled !== false  // Wrong! Includes undefined products
```

This included products where `gmc_enabled` was `undefined`, not explicitly enabled by clicking the GMC enable button in the admin dashboard.

### Problem 2: Products Not Published ❌
All 11 products had `gmc_enabled: true` BUT `meta.published: false`, which excluded them from the feed.

The feed eligibility check requires:
1. `gmc_enabled === true` ✅
2. `published !== false` ❌ (All products were unpublished)
3. Valid data (title, price, images, etc.) ✅

## Fixes Applied

### 1. Fixed Feed Eligibility Logic ✅
**File:** `src/app/api/feed/google/route.ts`

Changed the eligibility check to explicitly require `gmc_enabled === true`:
```typescript
// Before (wrong):
product.meta?.gmc_enabled !== false

// After (correct):
product.meta?.gmc_enabled === true
```

Also created a new helper library (`src/lib/gmc.ts`) with proper GMC validation functions to match the pattern used in other sites like ballardkellyscott.shop.

### 2. Published All Products ✅
Used the script `scripts/publish-all-products.mjs` to set `meta.published: true` for all 11 products.

### 3. Created Helper Scripts ✅
Created diagnostic and maintenance scripts:
- **`scripts/check-gmc-status.mjs`** - Diagnose GMC status of all products
- **`scripts/publish-all-products.mjs`** - Publish all products  
- **`scripts/enable-all-gmc.mjs`** - Enable GMC for all valid products
- **`scripts/debug-published-status.mjs`** - Debug published status

### 4. Created Missing Files ✅
- **`.env.local`** - Added environment variables (was missing)
- **`src/lib/gmc.ts`** - GMC helper functions for consistent validation

## Verification

✅ **Feed now returns 11 products:**
```
https://takimia.com/api/feed/google?country=US&currency=USD
```

All 11 products in the feed:
1. Takimia TouchPress Espresso Machine ($1,199)
2. Takimia TouchBrew Espresso Machine ($799)
3. Takimia ProGrind Espresso Machine ($699)
4. Takimia LuxeTherm Coffee Maker ($244)
5. Takimia LuxeGlass Coffee Maker ($227)
6. Takimia GrindBrew Coffee Maker ($299)
7. Takimia DuoCraft Espresso Setup ($1,399)
8. Takimia DuoBoiler Espresso Machine ($1,299)
9. Takimia Compacta Plus Espresso Machine ($449.96)
10. Takimia Compacta Espresso Machine ($269.96)
11. Takimia AeroJet Espresso Machine ($1,690)

## What Was Broken

### Before Fix:
```
GMC Feed Status:
- Products with gmc_enabled: true: 11
- Products published: 0  ❌
- Products in feed: 0  ❌
```

### After Fix:
```
GMC Feed Status:
- Products with gmc_enabled: true: 11 ✅
- Products published: 11 ✅
- Products in feed: 11 ✅
```

## Next Steps for Google Merchant Center

1. **Wait for Google to re-fetch the feed** (can take a few hours to 24 hours)
2. **Manually trigger a fetch in GMC:**
   - Go to Google Merchant Center
   - Navigate to Products → Feeds
   - Click on your Takimia feed
   - Click "Fetch now" to force an immediate update

3. **Verify in GMC:**
   - Check that all 11 products appear
   - Verify there are no errors or warnings
   - Products should transition from "Pending" to "Approved"

## Maintenance

To check GMC status at any time:
```bash
cd takimia.com
node scripts/check-gmc-status.mjs
```

To publish new products:
```bash
node scripts/publish-all-products.mjs
```

To enable GMC for new products:
```bash
node scripts/enable-all-gmc.mjs
```

## Technical Notes

- The feed uses the `isGmcFeedEligibleProduct()` function from `src/lib/gmc.ts`
- Products must have BOTH `gmc_enabled: true` AND `published: true` to appear
- The feed is cached with `Cache-Control: no-store, max-age=0` to prevent stale data
- Feed format is RSS 2.0 with Google Merchant Center namespace (`xmlns:g`)

## Files Modified

1. `src/app/api/feed/google/route.ts` - Fixed eligibility logic
2. `src/lib/gmc.ts` - Created new helper library
3. Database: Updated `meta.published` for all 11 products

## Files Created

1. `.env.local` - Environment variables
2. `src/lib/gmc.ts` - GMC validation helpers
3. `scripts/check-gmc-status.mjs` - Diagnostic tool
4. `scripts/publish-all-products.mjs` - Publishing tool
5. `scripts/enable-all-gmc.mjs` - GMC enable tool
6. `scripts/debug-published-status.mjs` - Debug tool
7. `docs/GMC_FEED_FIX_2026.md` - This document

---

**Issue Resolved:** ✅ September 23, 2026  
**Products in Feed:** 11/11 ✅  
**Google Merchant Center:** Ready to fetch ✅
