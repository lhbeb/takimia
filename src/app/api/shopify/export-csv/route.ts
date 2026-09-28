import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

function escapeCsv(value: string | number | null | undefined): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Shopify export format headers
const HEADERS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
  'Published', 'Option1 Name', 'Option1 Value', 'Option1 Linked To',
  'Option2 Name', 'Option2 Value', 'Option2 Linked To',
  'Option3 Name', 'Option3 Value', 'Option3 Linked To',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty',
  'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
  'Variant Compare At Price', 'Variant Requires Shipping', 'Variant Taxable',
  'Unit Price Total Measure', 'Unit Price Total Measure Unit',
  'Unit Price Base Measure', 'Unit Price Base Measure Unit',
  'Variant Barcodes', 'Image Src', 'Image Position', 'Image Alt Text',
  'Gift Card', 'SEO Title', 'SEO Description',
  'Google Shopping / Google Product Category', 'Google Shopping / Gender',
  'Google Shopping / Age Group', 'Google Shopping / MPN',
  'Google Shopping / Condition', 'Google Shopping / Custom Product',
  'Google Shopping / Custom Label 0', 'Google Shopping / Custom Label 1',
  'Google Shopping / Custom Label 2', 'Google Shopping / Custom Label 3',
  'Google Shopping / Custom Label 4',
  'Google: Custom Product (product.metafields.mm-google-shopping.custom_product)',
  'Variant Image', 'Variant Weight Unit', 'Variant Tax Code', 'Cost per item', 'Status'
];

export async function GET(request: NextRequest) {
  // Simple auth check
  const token = request.cookies.get('admin_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('slug, title, description, price, original_price, brand, category, images, meta, in_stock')
    .order('title');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const baseUrl = 'https://takimia.com';
  const rows: string[] = [HEADERS.join(',')];

  for (const product of products || []) {
    const handle = slugify(product.title);
    const rawImages: string[] = Array.isArray(product.images) ? product.images : [];
    
    // Convert all images to absolute URLs
    const images = rawImages
      .filter(img => img) // Remove empty strings
      .map(img => {
        if (img.startsWith('http://') || img.startsWith('https://')) {
          return img;
        }
        const cleanPath = img.startsWith('/') ? img : `/${img}`;
        return `${baseUrl}${cleanPath}`;
      });
    
    // Skip products with no images
    if (images.length === 0) {
      console.warn(`Skipping product ${handle} - no images`);
      continue;
    }
    
    const compareAt = product.original_price ? String(Number(product.original_price).toFixed(2)) : '';
    const price = String(Number(product.price || 0).toFixed(2));
    const sku = `TAKIMIA-${handle.substring(0, 30).toUpperCase()}`;
    const cleanDescription = (product.description || '').replace(/<[^>]+>/g, '');
    const inStock = product.in_stock !== false;

    // First row — full product data with first image
    const firstRow = [
      escapeCsv(handle),                      // Handle
      escapeCsv(product.title),               // Title
      escapeCsv(cleanDescription),            // Body (HTML)
      escapeCsv(product.brand || 'Takimia'), // Vendor
      '',                                      // Product Category
      escapeCsv(product.category || ''),      // Type
      '',                                      // Tags
      'true',                                  // Published
      'Title',                                 // Option1 Name
      'Default Title',                         // Option1 Value
      '',                                      // Option1 Linked To
      '',                                      // Option2 Name
      '',                                      // Option2 Value
      '',                                      // Option2 Linked To
      '',                                      // Option3 Name
      '',                                      // Option3 Value
      '',                                      // Option3 Linked To
      escapeCsv(sku),                         // Variant SKU
      '0.0',                                   // Variant Grams
      '',                                      // Variant Inventory Tracker
      inStock ? '100' : '0',                   // Variant Inventory Qty
      'continue',                              // Variant Inventory Policy
      'manual',                                // Variant Fulfillment Service
      price,                                   // Variant Price
      compareAt,                               // Variant Compare At Price
      'true',                                  // Variant Requires Shipping
      'true',                                  // Variant Taxable
      '',                                      // Unit Price Total Measure
      '',                                      // Unit Price Total Measure Unit
      '',                                      // Unit Price Base Measure
      '',                                      // Unit Price Base Measure Unit
      '',                                      // Variant Barcodes
      escapeCsv(images[0]),                   // Image Src
      '1',                                     // Image Position
      escapeCsv(product.title),               // Image Alt Text
      'false',                                 // Gift Card
      '',                                      // SEO Title
      '',                                      // SEO Description
      '',                                      // Google Shopping / Google Product Category
      '',                                      // Google Shopping / Gender
      '',                                      // Google Shopping / Age Group
      '',                                      // Google Shopping / MPN
      '',                                      // Google Shopping / Condition
      '',                                      // Google Shopping / Custom Product
      '',                                      // Google Shopping / Custom Label 0
      '',                                      // Google Shopping / Custom Label 1
      '',                                      // Google Shopping / Custom Label 2
      '',                                      // Google Shopping / Custom Label 3
      '',                                      // Google Shopping / Custom Label 4
      '',                                      // Google: Custom Product
      '',                                      // Variant Image
      'lb',                                    // Variant Weight Unit
      '',                                      // Variant Tax Code
      '',                                      // Cost per item
      'active'                                 // Status
    ];

    rows.push(firstRow.join(','));

    // Additional image rows (only handle and image fields populated)
    for (let i = 1; i < images.length; i++) {
      const imageRow = Array(HEADERS.length).fill('');
      imageRow[0] = escapeCsv(handle);        // Handle
      imageRow[32] = escapeCsv(images[i]);    // Image Src
      imageRow[33] = String(i + 1);           // Image Position
      imageRow[34] = escapeCsv(product.title); // Image Alt Text
      
      rows.push(imageRow.join(','));
    }
  }

  const csv = rows.join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="takimia-shopify-export.csv"',
    },
  });
}
