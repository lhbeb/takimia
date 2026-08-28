import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCollection, getProductsByCategory } from '@/lib/supabase/products';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Coffee Makers & Brewers | Takimia',
  description:
    'Explore Takimia drip coffee makers, single-serve brewers, pour-over drippers, and cold brew systems.',
};

export default async function CoffeeMakersPage() {
  try {
    const products = await getProductsByCollection('coffee-makers');
    const fallbackProducts = products.length === 0 ? await getProductsByCategory('Coffee Makers') : products;

    return (
      <>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#262626] mb-2">Coffee Makers & Brewers</h1>
              <p className="text-gray-600">
                Rich, aromatic coffee made effortless with our precision drip brewers, pour-overs, and specialty makers.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={null}>
              <ProductGrid products={fallbackProducts} showHeader={false} />
            </Suspense>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading coffee makers page:', error);
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
