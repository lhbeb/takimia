import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { getAllProducts } from '@/lib/data';
import { filterProductsByCategory } from '@/config/categories';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Espresso Machines | Takimia',
  description:
    'Discover Takimia manual, semi-automatic, and dual-boiler espresso machines designed for cafe-quality espresso at home.',
};

export default async function EspressoMachinesPage() {
  try {
    const allProducts = await getAllProducts();
    const products = filterProductsByCategory(allProducts, 'Espresso Machines');

    return (
      <>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#262626] mb-2">Espresso Machines</h1>
              <p className="text-gray-600">
                Explore our lineup of commercial-grade home espresso machines with precision PID control and 15-bar extraction.
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
    console.error('Error loading espresso machines page:', error);
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
