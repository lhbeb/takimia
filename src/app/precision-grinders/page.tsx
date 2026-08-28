import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCollection, getProductsByCategory } from '@/lib/supabase/products';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Precision Coffee Grinders | Takimia',
  description:
    'Shop Takimia conical and flat burr coffee grinders engineered for low retention and uniform particle size.',
};

export default async function PrecisionGrindersPage() {
  try {
    const products = await getProductsByCollection('coffee-grinders');
    const fallbackProducts = products.length === 0 ? await getProductsByCategory('Precision Grinders') : products;

    return (
      <>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#262626] mb-2">Precision Coffee Grinders</h1>
              <p className="text-gray-600">
                Unlock full coffee bean aroma and balanced extraction with our micro-stepped, zero-retention conical and flat burr grinders.
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
    console.error('Error loading grinders page:', error);
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
