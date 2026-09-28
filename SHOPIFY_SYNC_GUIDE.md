# Shopify Variant ID Sync Guide

This guide explains how to sync Shopify variant IDs from your Shopify store to the Takimia Supabase database.

## Overview

The sync script fetches all products from your Shopify store (tazoota.myshopify.com) and updates the corresponding products in Takimia Supabase with their Shopify variant IDs. This enables the Shopify checkout flow for these products.

## Prerequisites

1. **Shopify Admin API Access Token**: You need a custom app in your Shopify store with Admin API access.
2. **Supabase Credentials**: Already configured in `.env.local`
3. **Matching Product Handles**: Products in Supabase should have slugs that match Shopify product handles.

## Setup Instructions

### Step 1: Create a Shopify Custom App

1. Go to your Shopify Admin: https://admin.shopify.com/store/tazoota/settings/apps/development

2. Click **"Create an app"** or select an existing custom app

3. Name it something like "Takimia Sync" or "Variant ID Sync"

4. Click **"Configure Admin API scopes"**

5. Grant the following scopes:
   - ✅ `read_products` - Required to fetch product data
   - ✅ `read_inventory` - Optional but recommended

6. Click **"Save"**

7. Click **"Install app"** to install it on your store

8. Copy the **Admin API access token** (it starts with `shpat_...`)

### Step 2: Add Shopify Credentials to `.env.local`

Open your `.env.local` file and update the Shopify section:

```env
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=tazoota.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_actual_token_here
```

⚠️ **Important**: Keep this token secure! Never commit it to version control.

### Step 3: Run the Sync Script

```bash
npm run shopify:sync-variants
```

Or using tsx directly:

```bash
tsx scripts/sync-shopify-variants.ts
```

## What the Script Does

1. **Fetches all products** from your Shopify store using the GraphQL Admin API
2. **Matches products** by comparing Shopify handles with Supabase product slugs
3. **Updates each matching product** with:
   - `meta.shopify_variant_id` - Numeric variant ID (e.g., "12345")
   - `meta.shopify_variant_gid` - Full GraphQL ID (e.g., "gid://shopify/ProductVariant/12345")
   - `meta.shopify_store_domain` - Your store domain
   - `meta.shopify_product_id` - Shopify product ID
   - `meta.shopify_handle` - Product handle
   - `meta.shopify_synced_at` - Timestamp of last sync
   - `checkout_flow` - Set to "shopify"

## Expected Output

```
🚀 Starting Shopify Variant Sync

Shopify Store: tazoota.myshopify.com
Supabase URL: https://uozcmaheslvjrwfxfzip.supabase.co

🔄 Fetching products from Shopify...
   Fetched 50 products so far...
✅ Fetched 38 products from Shopify

🔄 Syncing variant IDs to Supabase...

✅ Updated: Bella Pro 12-Cup Programmable Coffee Maker Stainless Steel
   Variant ID: 48829384056128
   Variant GID: gid://shopify/ProductVariant/48829384056128
   Price: $21.99

✅ Updated: Breville the Barista Express Espresso Machine
   Variant ID: 48829384088896
   Variant GID: gid://shopify/ProductVariant/48829384088896
   Price: $419.97

...

📊 Sync Summary:
   ✅ Successfully updated: 38 products
   ⚠️  Not found in Supabase: 0 products
   ❌ Errors: 0 products
   📦 Total Shopify products: 38

✅ Sync completed successfully!
```

## Verification

After running the sync, you can verify the results:

### Check in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/uozcmaheslvjrwfxfzip
2. Navigate to **Table Editor** → **products**
3. Select any product and check the `meta` column
4. You should see the Shopify variant IDs populated

### Check Checkout Flow

1. Visit a product page on Takimia: https://takimia.com/products/bella-pro-12-cup-programmable-coffee-maker-stainless-steel
2. Add the product to cart
3. The cart should now use Shopify checkout links

## Troubleshooting

### Error: "SHOPIFY_ADMIN_ACCESS_TOKEN is not set"

**Solution**: Make sure you've added the token to `.env.local` and restarted any running development servers.

### Error: "Shopify API error: 401"

**Solution**: Your access token is invalid or expired. Generate a new one from Shopify Admin.

### Error: "Shopify API error: 403"

**Solution**: Your custom app doesn't have the required API scopes. Add `read_products` scope and reinstall the app.

### Warning: "Not found in Supabase"

**Solution**: This means the product exists in Shopify but not in your Takimia Supabase database. This is expected if you have products in Shopify that haven't been added to Takimia yet.

**To match products properly:**
- Ensure Shopify product handles match Takimia product slugs
- Example: Shopify handle `bella-pro-12-cup-coffee-maker` should match Takimia slug `bella-pro-12-cup-coffee-maker`

## Re-running the Sync

You can run the sync script multiple times safely. It will:
- ✅ Update existing variant IDs
- ✅ Skip products not found in Supabase
- ✅ Not create duplicate data

Run it whenever:
- You add new products to Shopify
- You need to update variant IDs
- Product prices change (to verify sync)

## Database Schema Reference

The script updates the `products` table with the following meta fields:

```typescript
interface ProductMeta {
  shopify_variant_id?: string;        // e.g., "48829384056128"
  shopify_variant_gid?: string;       // e.g., "gid://shopify/ProductVariant/48829384056128"
  shopify_store_domain?: string;      // e.g., "tazoota.myshopify.com"
  shopify_product_id?: string;        // e.g., "9876543210"
  shopify_handle?: string;            // e.g., "bella-pro-12-cup-coffee-maker"
  shopify_synced_at?: string;         // ISO timestamp
  // ... other meta fields
}
```

## Next Steps

After syncing variant IDs:

1. **Test Checkout Flow**: Try adding products to cart and proceeding to checkout
2. **Verify Cart Links**: Cart should generate Shopify checkout URLs
3. **Monitor Orders**: Check that orders are processed through Shopify
4. **Update Product Metadata**: Ensure all products have correct variant mappings

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your Shopify credentials and API scopes
3. Ensure product handles match between Shopify and Supabase
4. Check that your Supabase connection is working

---

**Last Updated**: 2026-09-19
