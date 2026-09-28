# Shopify CSV Import and Public Variant Sync

This is the no-Shopify-App workflow for connecting Takimia products to the Tazoota Shopify catalog.

The workflow is:

1. Export products from a store as a Shopify-compatible CSV.
2. Import the CSV into the target Shopify store.
3. Wait for Shopify to publish the products.
4. Read the public Shopify catalog from `/products.json`.
5. Match the Shopify products to the store's Supabase products.
6. Save the Shopify variant IDs in Supabase.

No Shopify app, OAuth flow, Admin API token, or Playwright browser session is required.

## 1. Export the products

For Takimia, sign in to the admin dashboard and use the Shopify CSV export action on the Products page. The export endpoint is:

```text
/api/shopify/export-csv
```

The downloaded file is a Shopify product import CSV. It includes product handles, titles, descriptions, prices, inventory settings, SKUs, and image URLs.

The image URLs must be publicly reachable. For Takimia, product images should use Takimia URLs such as:

```text
https://takimia.com/api/product-images/...
```

Do not use private Supabase storage URLs in the CSV.

## 2. Import the CSV into Shopify

In the target Shopify admin:

1. Open Products.
2. Choose Import.
3. Upload the exported CSV.
4. Review the preview.
5. Confirm the import.

Shopify creates the product and variant records during import. The Shopify variant IDs are not supplied by Takimia's CSV and should not be invented manually.

After import, confirm that the products are active and visible on the storefront. Allow a short time for the storefront catalog to update.

## 3. Confirm the public catalog

Open the target storefront catalog endpoint:

```text
https://checkout.tazoota.com/products.json?limit=250
```

A successful response contains products with this shape:

```json
{
  "products": [
    {
      "id": 8307678576709,
      "handle": "takimia-touchpress-espresso-machine-touchscreen-guidance-with-assisted-puck-system",
      "variants": [
        {
          "id": 45885035675717,
          "title": "Default Title"
        }
      ]
    }
  ]
}
```

The `variants[].id` value is the ID needed by Takimia checkout.

## 4. Configure the public storefront domain

In Takimia `.env.local`, set the current public Shopify storefront domain:

```env
SHOPIFY_PUBLIC_STORE_DOMAIN=checkout.tazoota.com
```

This file is local configuration and must not be committed. When the storefront is later moved to `checkout.takimia.com`, change the value and run the sync again:

```env
SHOPIFY_PUBLIC_STORE_DOMAIN=checkout.takimia.com
```

## 5. Run the sync

From the Takimia project directory:

```powershell
npm run shopify:sync-public-variants
```

The script reads:

- Takimia products from Supabase.
- Shopify products from the public `/products.json` endpoint.
- The first Shopify variant for each matched product.

It matches by:

1. Exact product handle.
2. Exact normalized product title when the handles differ.

For each match, it writes these fields into the product `meta` JSON:

```text
shopify_variant_id
shopify_variant_gid
shopify_product_id
shopify_store_domain
shopify_handle
shopify_synced_at
shopify_sync_source
```

It also sets the product checkout flow to `shopify`.

## 6. Verify the result

The sync output should report:

```text
Updated with variant IDs: [expected product count]
Unmatched: 0
```

Verify one product directly with the public endpoint:

```text
https://checkout.tazoota.com/products/takimia-touchpress-espresso-machine-touchscreen-guidance-with-assisted-puck-system.js
```

The current TouchPress variant ID is:

```text
45885035675717
```

A direct cart test is:

```text
https://checkout.tazoota.com/cart/45885035675717:1
```

## 7. Repeat for another store

For another store, repeat the same process:

1. Export that store's products as a Shopify CSV.
2. Import the CSV into the target Shopify storefront.
3. Set `SHOPIFY_PUBLIC_STORE_DOMAIN` to that storefront's public domain.
4. Run `npm run shopify:sync-public-variants` from the corresponding codebase.
5. Confirm that every expected product has a non-empty `meta.shopify_variant_id`.

## Important limitations

- The public catalog must be enabled and reachable.
- Product titles or handles must remain stable enough to match correctly.
- Products with multiple variants currently use the first variant returned by Shopify.
- The CSV import should be completed before running the sync.
- If `/products.json` is blocked or unavailable, use a browser-based fallback such as Playwright to load each public product page and extract its variant data.
