/**
 * Google Merchant Center XML Product Feed
 * GET /api/google/feed
 * 
 * Returns an XML feed that GMC can fetch directly
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  condition: string;
  category: string;
  brand: string;
  in_stock: boolean;
  published?: boolean;
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function mapConditionToGMC(condition: string): string {
  const cond = condition.toLowerCase();
  if (cond.includes('refurbish') || cond.includes('open-box') || cond === 'open box') {
    return 'refurbished';
  } else if (cond.includes('used') || cond.includes('pre-owned') || cond.includes('preowned')) {
    return 'used';
  }
  return 'new';
}

function generateProductXml(product: Product, baseUrl: string): string {
  const images = product.images || [];
  const imageLink = images[0] || `${baseUrl}/placeholder.jpg`;
  const additionalImages = images
    .slice(1, 11)
    .map((img) => `    <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
    .join('\n');

  const availability = product.in_stock ? 'in stock' : 'out of stock';
  const condition = mapConditionToGMC(product.condition);
  const brand = escapeXml(product.brand || 'Takimia');
  
  // Clean and truncate title and description
  const title = escapeXml(product.title.substring(0, 150));
  const description = escapeXml(product.description.substring(0, 5000));
  
  return `  <item>
    <g:id>${escapeXml(product.id)}</g:id>
    <g:title>${title}</g:title>
    <g:description>${description}</g:description>
    <g:link>${baseUrl}/products/${escapeXml(product.slug)}</g:link>
    <g:image_link>${escapeXml(imageLink)}</g:image_link>
${additionalImages}
    <g:price>${product.price.toFixed(2)} USD</g:price>
    <g:availability>${availability}</g:availability>
    <g:condition>${condition}</g:condition>
    <g:brand>${brand}</g:brand>
    <g:product_type>${escapeXml(product.category)}</g:product_type>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`;
}

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://takimia.com';
    
    console.log('📦 Fetching products for GMC feed...');

    // Fetch all published, in-stock products
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .eq('in_stock', true)
      .order('title');

    if (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }

    if (!products || products.length === 0) {
      console.log('⚠️ No published products found');
      const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Takimia Product Feed</title>
    <link>${baseUrl}</link>
    <description>Takimia coffee and espresso machines</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
  </channel>
</rss>`;
      
      return new NextResponse(emptyFeed, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    console.log(`✅ Found ${products.length} products for feed`);

    // Generate XML items
    const items = products
      .map((product: Product) => generateProductXml(product, baseUrl))
      .join('\n');

    const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Takimia Product Feed</title>
    <link>${baseUrl}</link>
    <description>Takimia coffee and espresso machines product feed for Google Merchant Center</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    console.log('✅ XML feed generated successfully');

    return new NextResponse(xmlFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('❌ Error generating GMC feed:', error);
    
    const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Takimia Product Feed - Error</title>
    <link>https://takimia.com</link>
    <description>Error generating feed: ${escapeXml(error.message)}</description>
  </channel>
</rss>`;

    return new NextResponse(errorFeed, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}
