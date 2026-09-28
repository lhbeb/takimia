import { NextRequest, NextResponse } from 'next/server';

const BUCKET = 'product-images';

function encodeStoragePath(path: string[]): string {
  return path
    .filter(Boolean)
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;

    if (!Array.isArray(path) || path.length < 2 || path.some(segment => segment === '..' || segment.includes('\\'))) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Image storage is not configured' }, { status: 500 });
    }

    const storagePath = encodeStoragePath(path);
    const upstreamUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: request.headers.get('accept') || 'image/avif,image/webp,image/*,*/*;q=0.8',
      },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Image not found' }, { status: upstream.status === 404 ? 404 : 502 });
    }

    const headers = new Headers();
    headers.set('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Product image proxy error:', error);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
