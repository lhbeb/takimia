import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import {
  filterProductsByCategory,
  POPULAR_CATEGORY_NAMES,
  POPULAR_CATEGORY_IMAGES,
  CATALOG_NAVIGATION,
} from '@/config/categories';

interface PopularCategoriesProps {
  products: Product[];
}

export default function PopularCategories({ products }: PopularCategoriesProps) {
  const categories = POPULAR_CATEGORY_NAMES.map((name) => {
    const categoryProducts = filterProductsByCategory(products, name);
    const navItem = CATALOG_NAVIGATION.find(item => item.label.toLowerCase() === name.toLowerCase());
    const href = navItem?.href || `/search?category=${encodeURIComponent(name)}`;

    const image =
      POPULAR_CATEGORY_IMAGES[name] ||
      categoryProducts.find((product) => product.images?.[0])?.images[0];

    return {
      name,
      href,
      count: categoryProducts.length,
      image,
    };
  }).filter((category) => category.count > 0 && category.image);

  if (categories.length === 0) return null;

  return (
    <section className="bg-[#f3f4f6] py-14 md:py-20" aria-labelledby="popular-categories-title">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 md:mb-10">
            <h2
              id="popular-categories-title"
              className="text-3xl font-bold tracking-tight text-[#2e3868] md:text-4xl"
            >
              Explore Popular Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="relative overflow-hidden rounded-2xl border border-[#2e3868]/10 bg-white shadow-[0_12px_30px_rgba(46,56,104,0.06)] transition-colors duration-200 hover:border-[#2e3868]/25"
                aria-label={`Shop ${category.name}`}
              >
                <div className="relative aspect-square overflow-hidden bg-white p-3 sm:p-5">
                  <Image
                    src={category.image!}
                    alt={`${category.name} collection`}
                    fill
                    sizes="(max-width: 1023px) 50vw, 20vw"
                    className="object-contain p-5 sm:p-7"
                  />
                </div>

                <div className="flex min-h-20 items-center bg-[#2e3868] px-4 py-4 text-[#F0F6FF] sm:px-5">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-tight sm:text-base">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
