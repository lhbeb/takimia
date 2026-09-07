import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { getAllProducts } from '@/lib/data';
import { filterProductsByCategory } from '@/config/categories';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Barista Accessories & Tools | Takimia',
  description:
    'Calibrated tampers, stainless steel milk pitchers, bottomless portafilters, precision scales, and cleaning kits by Takimia.',
};

export default async function BaristaAccessoriesPage() {
  try {
    const allProducts = await getAllProducts();
    const products = filterProductsByCategory(allProducts, 'Barista Accessories');

    return (
      <>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#262626] mb-2">Barista Accessories & Tools</h1>
              <p className="text-gray-600">
                Precision scales, calibrated spring tampers, WDT distribution tools, stainless pitchers, and pro portafilters.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={null}>
              <ProductGrid products={products} showHeader={false} />
            </Suspense>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading barista accessories page:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#262626] mb-4">Unable to load products</h2>
          <p className="text-gray-600">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }
}
