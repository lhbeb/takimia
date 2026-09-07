import type { Product } from '@/types/product';

export interface CategoryNavItem {
  label: string;
  href: string;
  categoryKey: string;
  description: string;
}

export const CATALOG_NAVIGATION: readonly CategoryNavItem[] = [
  {
    label: 'All',
    href: '/#products',
    categoryKey: 'all',
    description: 'Explore our complete collection of premium coffee and espresso machines.',
  },
  {
    label: 'Espresso Machines',
    href: '/espresso-machines',
    categoryKey: 'espresso-machines',
    description: 'Manual, semi-automatic, and dual-boiler espresso machines engineered for cafe-quality extraction.',
  },
  {
    label: 'Coffee Makers',
    href: '/coffee-makers',
    categoryKey: 'coffee-makers',
    description: 'Precision drip coffee makers and thermal carafe brewers for balanced daily cups.',
  },
  {
    label: 'Precision Grinders',
    href: '/precision-grinders',
    categoryKey: 'precision-grinders',
    description: 'Integrated conical burr grinders and precision coffee milling systems.',
  },
  {
    label: 'Bean-to-Cup',
    href: '/search?category=Bean-to-Cup',
    categoryKey: 'bean-to-cup',
    description: 'All-in-one automated bean-to-cup machines with integrated precision grinders.',
  },
  {
    label: 'Barista Accessories',
    href: '/barista-accessories',
    categoryKey: 'barista-accessories',
    description: 'Automatic milk frothers, barista sets, and latte art equipment.',
  },
] as const;

export const POPULAR_CATEGORY_NAMES = [
  'Espresso Machines',
  'Coffee Makers',
  'Precision Grinders',
  'Bean-to-Cup',
  'Barista Accessories',
] as const;

export const POPULAR_CATEGORY_IMAGES: Record<string, string> = {
  'Espresso Machines': 'https://uozcmaheslvjrwfxfzip.supabase.co/storage/v1/object/public/product-images/the-oracle-jet/img1.png',
  'Coffee Makers': 'https://uozcmaheslvjrwfxfzip.supabase.co/storage/v1/object/public/product-images/the-luxe-brewer-thermal/img1.png',
  'Precision Grinders': 'https://uozcmaheslvjrwfxfzip.supabase.co/storage/v1/object/public/product-images/the-dynamic-duo/img3.png',
  'Bean-to-Cup': 'https://uozcmaheslvjrwfxfzip.supabase.co/storage/v1/object/public/product-images/the-grind-control/img1.png',
  'Barista Accessories': 'https://uozcmaheslvjrwfxfzip.supabase.co/storage/v1/object/public/product-images/the-milk-cafe/img1.png',
};

/**
 * Filter coffee products by category, collection, or search term.
 * Ensures that every valid store category in the navbar returns matching, relevant products.
 */
export function filterProductsByCategory(products: Product[], categoryOrQuery: string): Product[] {
  if (!products || products.length === 0) return [];

  // Exclude non-coffee items (e.g., lawn mowers) that might be in the database
  const coffeeProducts = products.filter((p) => {
    const cat = String(p.category || '').toLowerCase();
    return !cat.includes('lawn');
  });

  const query = categoryOrQuery.trim().toLowerCase();
  if (!query || query === 'all') {
    return coffeeProducts;
  }

  // 1. Coffee Makers & Brewers
  if (
    query.includes('coffee maker') ||
    query.includes('brewer') ||
    query.includes('drip') ||
    query.includes('pour over')
  ) {
    const matched = coffeeProducts.filter((p) => {
      const cat = String(p.category || '').toLowerCase();
      const slug = String(p.slug || '').toLowerCase();
      const title = String(p.title || '').toLowerCase();
      return (
        cat.includes('brewer') ||
        cat.includes('coffee maker') ||
        slug.includes('brewer') ||
        slug.includes('grind-control') ||
        title.includes('brewer') ||
        title.includes('grind control')
      );
    });
    if (matched.length > 0) return matched;
  }

  // 2. Precision Grinders & Grind-equipped machines
  if (query.includes('grinder') || query.includes('grind')) {
    const matched = coffeeProducts.filter((p) => {
      const slug = String(p.slug || '').toLowerCase();
      const title = String(p.title || '').toLowerCase();
      const desc = String(p.description || '').toLowerCase();
      return (
        slug.includes('grind') ||
        slug.includes('dynamic-duo') ||
        slug.includes('oracle') ||
        slug.includes('barista-pro') ||
        slug.includes('barista-touch') ||
        title.includes('grind') ||
        desc.includes('grinder')
      );
    });
    if (matched.length > 0) {
      // Prioritize dedicated grinders (Dynamic Duo / Smart Grinder Pro & Grind Control)
      return matched.sort((a, b) => {
        const aScore = a.slug.includes('dynamic-duo') ? 3 : a.slug.includes('grind') ? 2 : 1;
        const bScore = b.slug.includes('dynamic-duo') ? 3 : b.slug.includes('grind') ? 2 : 1;
        return bScore - aScore;
      });
    }
  }

  // 3. Bean-to-Cup / All-in-one automated machines
  if (
    query.includes('bean-to-cup') ||
    query.includes('bean to cup') ||
    query.includes('automatic')
  ) {
    const matched = coffeeProducts.filter((p) => {
      const slug = String(p.slug || '').toLowerCase();
      return (
        slug.includes('grind-control') ||
        slug.includes('barista-touch') ||
        slug.includes('oracle') ||
        slug.includes('barista-pro')
      );
    });
    if (matched.length > 0) {
      // Prioritize Grind Control (all-in-one bean-to-cup) then Barista Touch Impress
      return matched.sort((a, b) => {
        const aScore = a.slug.includes('grind-control') ? 3 : a.slug.includes('impress') ? 2 : 1;
        const bScore = b.slug.includes('grind-control') ? 3 : b.slug.includes('impress') ? 2 : 1;
        return bScore - aScore;
      });
    }
  }

  // 4. Barista Accessories & Frothers
  if (
    query.includes('accessor') ||
    query.includes('frother') ||
    query.includes('milk') ||
    query.includes('gear') ||
    query.includes('tool')
  ) {
    const matched = coffeeProducts.filter((p) => {
      const slug = String(p.slug || '').toLowerCase();
      const title = String(p.title || '').toLowerCase();
      return (
        slug.includes('milk-cafe') ||
        slug.includes('dynamic-duo') ||
        slug.includes('bambino-plus') ||
        title.includes('milk')
      );
    });
    if (matched.length > 0) return matched;
  }

  // 5. Espresso Machines
  if (query.includes('espresso')) {
    const matched = coffeeProducts.filter((p) => {
      const slug = String(p.slug || '').toLowerCase();
      // Exclude standalone brewers and pure frothers from pure espresso view
      if (slug.includes('brewer') || slug.includes('milk-cafe')) return false;
      const cat = String(p.category || '').toLowerCase();
      return (
        cat.includes('espresso') ||
        slug.includes('oracle') ||
        slug.includes('barista') ||
        slug.includes('bambino') ||
        slug.includes('dual-boiler') ||
        slug.includes('dynamic-duo')
      );
    });
    if (matched.length > 0) return matched;
  }

  // 6. Direct category string match
  const exactMatches = coffeeProducts.filter(
    (p) => String(p.category || '').trim().toLowerCase() === query,
  );
  if (exactMatches.length > 0) return exactMatches;

  // 7. Generic keyword match across title, description, and category
  const keywordMatches = coffeeProducts.filter((p) => {
    const title = String(p.title || '').toLowerCase();
    const desc = String(p.description || '').toLowerCase();
    const cat = String(p.category || '').toLowerCase();
    return title.includes(query) || desc.includes(query) || cat.includes(query);
  });

  return keywordMatches.length > 0 ? keywordMatches : coffeeProducts;
}
