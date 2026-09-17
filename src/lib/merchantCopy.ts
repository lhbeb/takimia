const UNSUPPORTED_AFFILIATION_PATTERNS: RegExp[] = [
  /\b(?:official|authorized|authorised|certified|exclusive)\s+(?:takimia|reseller|retailer|dealer|distributor|partner|supplier)\b/gi,
  /\b(?:official|authorized|authorised|certified|exclusive)\s+(?:[a-z0-9&.-]+\s+){0,2}(?:reseller|retailer|dealer|distributor|partner|supplier)\b/gi,
  /\b(?:official|authorized|authorised|certified)\s+(?:brand|store|seller|shop)\b/gi,
  /\b(?:exclusive|preferred)\s+(?:brand|sales?)\s+partner\b/gi,
  /\b(?:factory[- ]direct|directly from the manufacturer|direct from the manufacturer)\b/gi,
];

/**
 * Removes unsupported affiliation claims while preserving factual manufacturer
 * and model references. Manufacturer names must remain when they accurately
 * identify the product being sold.
 */
export function sanitizeMerchantCopy(value: string | null | undefined): string {
  if (!value) return '';

  let sanitized = value;
  for (const pattern of UNSUPPORTED_AFFILIATION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  return sanitized
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([([{])\s+/g, '$1')
    .replace(/\s+([)\]}])/g, '$1')
    .trim();
}

export function merchantBrand(brand: string | null | undefined): string {
  return sanitizeMerchantCopy(brand) || 'Takimia';
}
