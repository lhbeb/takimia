import React, { Suspense } from 'react';
import Hero from '@/components/Hero';
import SameDayShipping from '@/components/SameDayShipping';
import ProductGrid from '@/components/ProductGrid';
import HomeReviews from '@/components/HomeReviews';
import CategorySection from '@/components/CategorySection';
import PopularCategories from '@/components/PopularCategories';
import { getFeaturedProducts, getProducts } from '@/lib/data';
import { homeReviews, homeReviewsStats } from '@/lib/homeReviews';
import ScrollToTop from '@/components/ScrollToTop';
import { FEATURED_PRODUCT_LIMIT } from '@/config/products';

export default async function HomePage() {
  try {
    const [featuredProducts, products] = await Promise.all([
      getFeaturedProducts(),
      getProducts(),
    ]);

    const espressoProducts = featuredProducts.filter(p =>
      p.collections?.includes('espresso-machines') || p.category?.toLowerCase().includes('espresso')
    );

    const grindersAndGear = products.filter((product) =>
      (product.collections?.includes('coffee-grinders') || product.collections?.includes('barista-gear')) &&
      product.category.trim().toLowerCase() !== 'espresso machines'
    );

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Hero />

      <PopularCategories products={products} />

      <CategorySection
        products={featuredProducts}
        title="Featured Coffee Machines"
        subtitle="A considered selection of premium espresso machines, brewers, and barista gear."
        maxDisplay={FEATURED_PRODUCT_LIMIT}
        shuffleForVisitor
        visitorShuffleKey="home-featured"
      />

      <SameDayShipping />

      {espressoProducts.length > 0 && (
        <Suspense fallback={null}>
          <ProductGrid
            products={espressoProducts}
            sectionId="espresso-machines-collection"
            title=""
            editorialCard={{
              title: 'Masterful Extraction in Every Cup',
              description:
                'Takimia coffee and espresso machines combine precision PID temperature control, durable stainless steel craftsmanship, and consistent 15-bar pressure. Elevate your morning brew with cafe-quality flavor in the comfort of your home.',
            }}
            randomizeForVisitor
            visitorShuffleKey="home-espresso"
          />
        </Suspense>
      )}

      {grindersAndGear.length > 0 && (
        <Suspense fallback={null}>
          <ProductGrid
            products={grindersAndGear}
            sectionId="precision-grinders-accessories"
            title="Precision Grinders & Barista Essentials"
            randomizeForVisitor
            visitorShuffleKey="home-grinders-gear"
          />
        </Suspense>
      )}

      <HomeReviews
        reviews={homeReviews}
        averageRating={homeReviewsStats.averageRating}
        totalReviews={homeReviewsStats.totalReviews}
      />
    </>
  );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <>
        <Hero />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-[#262626] mb-4">Unable to load products</h2>
          <p className="text-gray-600">Please refresh the page or try again later.</p>
        </div>
      </>
    );
  }
}
