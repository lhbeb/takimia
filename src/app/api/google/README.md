# Google Merchant Center API Endpoints

These endpoints provide product feeds for Google Merchant Center integration.

## Endpoints

### 1. XML Product Feed (Recommended for GMC)
**URL:** `/api/google/feed`  
**Method:** `GET`  
**Format:** XML (RSS 2.0 with Google Merchant Center namespace)

#### Usage in Google Merchant Center:
1. Go to Google Merchant Center dashboard
2. Navigate to **Products** → **Feeds**
3. Click **Add Feed**
4. Select **Scheduled fetch**
5. Enter feed URL: `https://takimia.com/api/google/feed`
6. Set fetch frequency (recommended: daily)
7. Save and fetch

#### Test the feed:
```bash
curl https://takimia.com/api/google/feed
```

---

### 2. JSON Product Feed (For developers)
**URL:** `/api/google/merchant-center`  
**Method:** `GET` or `POST`  
**Format:** JSON

#### Response format:
```json
{
  "success": true,
  "count": 11,
  "products": [
    {
      "offerId": "takimia-aero-jet-espresso-machine",
      "title": "Takimia Aero Jet Espresso Machine",
      "description": "Premium espresso machine...",
      "link": "https://takimia.com/products/takimia-aero-jet-espresso-machine",
      "imageLink": "https://...",
      "price": {
        "value": "599.99",
        "currency": "USD"
      },
      "availability": "in stock",
      "condition": "new",
      "brand": "Takimia",
      "channel": "online",
      "contentLanguage": "en",
      "targetCountry": "US"
    }
  ]
}
```

#### Test the endpoint:
```bash
# JSON format
curl https://takimia.com/api/google/merchant-center

# XML format
curl -H "Accept: application/xml" https://takimia.com/api/google/merchant-center
```

---

## Product Requirements

Products must meet these criteria to appear in the feed:
- ✅ `published = true`
- ✅ `in_stock = true`

## Product Field Mapping

| Takimia Field | GMC Field | Notes |
|--------------|-----------|-------|
| `id` | `offerId` | Unique product identifier |
| `title` | `title` | Truncated to 150 chars |
| `description` | `description` | Truncated to 5000 chars |
| `slug` | Part of `link` | Full product URL |
| `price` | `price` | Formatted as "599.99 USD" |
| `images[0]` | `imageLink` | Primary image |
| `images[1-10]` | `additionalImageLinks` | Up to 10 additional images |
| `in_stock` | `availability` | "in stock" or "out of stock" |
| `condition` | `condition` | Mapped: new/refurbished/used |
| `brand` | `brand` | Defaults to "Takimia" |
| `category` | `productType` | Product category |

## Condition Mapping

| Takimia Condition | GMC Condition |
|------------------|---------------|
| New | new |
| Refurbished, Open-box, Open Box | refurbished |
| Used, Pre-owned, Preowned | used |

## Cache

Both endpoints cache responses for 1 hour to improve performance.

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=https://takimia.com
```

## Troubleshooting

### No products in feed
- Check that products have `published = true` in database
- Check that products have `in_stock = true`
- Verify environment variables are set

### Products not updating in GMC
- GMC caches feeds - wait up to 24 hours for updates
- Force a manual fetch in GMC dashboard
- Check feed fetch logs in GMC for errors

### Images not showing
- Verify image URLs are publicly accessible
- Check that images are HTTPS (not HTTP)
- Ensure images meet GMC requirements (min 100x100px)

## Next Steps

1. ✅ Deploy these endpoints to production
2. ✅ Set up feed in Google Merchant Center
3. ✅ Test feed fetch in GMC
4. ✅ Monitor for any GMC errors or warnings
5. ✅ Set up automatic daily fetches
