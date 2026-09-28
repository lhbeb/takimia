const BUCKET = 'product-images';
const STORAGE_MARKER = `/storage/v1/object/public/${BUCKET}/`;
const PROXY_MARKER = '/api/product-images/';

function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL || process.env.APP_BASE_URL || 'https://takimia.com';
  try {
    return new URL(configured).origin;
  } catch {
    return 'https://takimia.com';
  }
}

export function encodeStoragePath(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

export function extractProductImageStoragePath(value: string): string | null {
  if (!value || typeof value !== 'string') return null;

  if (value.startsWith(PROXY_MARKER)) {
    return decodeURIComponent(value.slice(PROXY_MARKER.length));
  }

  try {
    const url = new URL(value);
    const proxyIndex = url.pathname.indexOf(PROXY_MARKER);
    if (proxyIndex >= 0) {
      return decodeURIComponent(url.pathname.slice(proxyIndex + PROXY_MARKER.length));
    }

    const storageIndex = url.pathname.indexOf(STORAGE_MARKER);
    if (storageIndex >= 0) {
      return decodeURIComponent(url.pathname.slice(storageIndex + STORAGE_MARKER.length));
    }
  } catch {
    const storageIndex = value.indexOf(STORAGE_MARKER);
    if (storageIndex >= 0) {
      return decodeURIComponent(value.slice(storageIndex + STORAGE_MARKER.length));
    }
  }

  return null;
}

export function productImageProxyUrl(storagePath: string, origin = getSiteOrigin()): string {
  return `${origin}${PROXY_MARKER}${encodeStoragePath(storagePath)}`;
}

export function toTakimiaProductImageUrl(value: string): string {
  const storagePath = extractProductImageStoragePath(value);
  return storagePath ? productImageProxyUrl(storagePath) : value;
}
