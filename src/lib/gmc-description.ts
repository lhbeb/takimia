/**
 * GMC Description Enrichment
 * 
 * Enriches product descriptions for Google Merchant Center feeds
 * by combining base description with additional attributes from meta fields.
 */

type ProductLike = {
  description?: string | null;
  title?: string | null;
  brand?: string | null;
  condition?: string | null;
  meta?: Record<string, any> | null;
};

/**
 * Enriches a product description for GMC by adding relevant attributes
 * that help with product matching and search visibility.
 */
export function enrichGmcDescription(product: ProductLike): string {
  const baseDescription = product.description || product.title || 'Product';
  const parts: string[] = [baseDescription];

  // Add brand if available
  if (product.brand && !baseDescription.toLowerCase().includes(product.brand.toLowerCase())) {
    parts.push(`Brand: ${product.brand}.`);
  }

  // Add condition if specified
  if (product.condition) {
    parts.push(`Condition: ${product.condition}.`);
  }

  // Add relevant meta attributes
  if (product.meta) {
    const { meta } = product;

    // Add color if available
    if (meta.gmc_color || meta.color) {
      const color = meta.gmc_color || meta.color;
      parts.push(`Color: ${color}.`);
    }

    // Add size if available
    if (meta.gmc_size || meta.size) {
      const size = meta.gmc_size || meta.size;
      parts.push(`Size: ${size}.`);
    }

    // Add material if available
    if (meta.material) {
      parts.push(`Material: ${meta.material}.`);
    }

    // Add weight if available
    if (meta.weight) {
      parts.push(`Weight: ${meta.weight}.`);
    }

    // Add dimensions if available
    if (meta.dimensions) {
      parts.push(`Dimensions: ${meta.dimensions}.`);
    }
  }

  return parts.join(' ').trim();
}
