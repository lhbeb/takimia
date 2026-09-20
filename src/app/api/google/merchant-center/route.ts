/**
 * Google Merchant Center Product Feed API
 * POST /api/google/merchant-center
 * 
 * Pushes all published Takimia products to Google Merchant Center
 */

import { NextRequest, NextResponse } from 'next/server';
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

interface GMCProduct {
  offerId: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImageLinks?: string[];
  price: {
    value: string;
    currency: string;
  };
  availability: 'in stock' | 'out of stock';
  condition: 'new' | 'refurbished' | 'used';
  brand: string;
  gtin?: string;
  mpn?: string;
  productType?: string;
  channel: 'online';
  contentLanguage: 'en';
  targetCountry: 'US';
}

function transformProductToGMC(product: Product, baseUrl: string): GMCProduct {
  // Map Takimia conditions to GMC conditions
  let gmcCondition: 'new' | 'refurbished' | 'used' = 'new';
  const condition = product.condition.toLowerCase();
  
  if (condition.includes('refurbish') || condition.includes('open-box')) {
    gmcCondition = 'refurbished';
  } else if (condition.includes('used') || condition.includes('pre-owned')) {
    gmcCondition = 'used';
  }

  // Get product images
  const images = product.images || [];
  const imageLink = images[0] || `${baseUrl}/placeholder-product.jpg`;
  const additionalImageLinks = images.slice(1, 11); // GMC allows up to 10 additional images

  return {
    offerId: product.id,
    title: product.title.substring(0, 150), // GMC max 150 chars
    description: product.description.substring(0, 5000), // GMC max 5000 chars
    link: `${baseUrl}/products/${product.slug}`,
    imageLink,
    additionalImageLinks: additionalImageLinks.length > 0 ? additionalImageLinks : undefined,
    price: {
      value: product.price.toFixed(2),
      currency: 'USD',
    },
    availability: product.in_stock ? 'in stock' : 'out of stock',
    condition: gmcCondition,
    brand: product.brand || 'Takimia',
    productType: product.category,
    channel: 'online',
    contentLanguage: 'en',
    targetCountry: 'US',
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://takimia.com';

    // Fetch all published products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .eq('in_stock', true)
      .order('title');

    if (error) {
      console.error('❌ Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: 'No published products found', count: 0, products: [] },
        { status: 200 }
      );
    }

    // Transform products to GMC format
    const gmcProducts = products.map((product: Product) =>
      transformProductToGMC(product, baseUrl)
    );

    // Return the GMC-formatted products
    return NextResponse.json(
      {
        success: true,
        count: gmcProducts.length,
        products: gmcProducts,
        message: `Successfully formatted ${gmcProducts.length} products for Google Merchant Center`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error in GMC product feed:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://takimia.com';

    // Fetch all published products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .eq('in_stock', true)
      .order('title');

    if (error) {
      console.error('❌ Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: 'No published products found', count: 0, products: [] },
        { status: 200 }
      );
    }

    // Transform products to GMC format
    const gmcProducts = products.map((product: Product) =>
      transformProductToGMC(product, baseUrl)
    );

    // Return as JSON (for API consumers) or RSS feed format
    const acceptHeader = request.headers.get('accept');
    
    if (acceptHeader?.includes('application/rss+xml') || acceptHeader?.includes('application/xml')) {
      // Return as RSS/XML feed
      const xmlFeed = generateGMCXMLFeed(gmcProducts, baseUrl);
      return new NextResponse(xmlFeed, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Return as JSON
    return NextResponse.json(
      {
        success: true,
        count: gmcProducts.length,
        products: gmcProducts,
        message: `Successfully formatted ${gmcProducts.length} products for Google Merchant Center`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error in GMC product feed:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

function generateGMCXMLFeed(products: GMCProduct[], baseUrl: string): string {
  const timestamp = new Date().toISOString();
  
  const items = products
    .map((product) => {
      const additionalImages = product.additionalImageLinks
        ?.map((img) => `    <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
        .join('\n') || '';

      return `  <item>
    <g:id>${escapeXml(product.offerId)}</g:id>
    <g:title>${escapeXml(product.title)}</g:title>
    <g:description>${escapeXml(product.description)}</g:description>
    <g:link>${escapeXml(product.link)}</g:link>
    <g:image_link>${escapeXml(product.imageLink)}</g:image_link>
${additionalImages}
    <g:price>${product.price.value} ${product.price.currency}</g:price>
    <g:availability>${product.availability}</g:availability>
    <g:condition>${product.condition}</g:condition>
    <g:brand>${escapeXml(product.brand)}</g:brand>
    ${product.productType ? `<g:product_type>${escapeXml(product.productType)}</g:product_type>` : ''}
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Takimia Product Feed</title>
    <link>${baseUrl}</link>
    <description>Takimia coffee and espresso machines product feed for Google Merchant Center</description>
    <lastBuildDate>${timestamp}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
