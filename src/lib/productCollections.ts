export const PRODUCT_COLLECTION_OPTIONS = [
  { value: 'espresso-machines', label: 'Espresso Machines' },
  { value: 'coffee-makers', label: 'Coffee Makers & Brewers' },
  { value: 'coffee-grinders', label: 'Precision Coffee Grinders' },
  { value: 'barista-gear', label: 'Barista Tools & Accessories' },
] as const;

export function getCollectionsForCategory(category: string): string[] {
  const normalized = category.toLowerCase().trim();

  if (/espresso|semi-auto|manual|capsule|pod|dual boiler|lever|bean-to-cup/.test(normalized)) {
    return ['espresso-machines'];
  }

  if (/grinder|burr|single dose|dosing/.test(normalized)) {
    return ['coffee-grinders'];
  }

  if (/tamper|pitcher|frother|portafilter|knock box|scale|filter|kettle|mat|tool|accessory/.test(normalized)) {
    return ['barista-gear'];
  }

  if (/maker|brewer|drip|french press|pour over|cold brew|percolator/.test(normalized)) {
    return ['coffee-makers'];
  }

  return ['espresso-machines'];
}
