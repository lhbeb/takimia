import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AboutNotifier from '@/components/AboutNotifier';
import {
  Users,
  Shield,
  Heart,
  Zap,
  CheckCircle2,
  Award,
  Target,
  Sparkles,
  Package,
  Eye,
  DollarSign,
  Leaf,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Takimia',
  description:
    'Learn about Takimia, your trusted source for premium coffee machines, espresso makers, precision grinders, and barista gear. Serving coffee enthusiasts across the United States and UK with fair prices and quality service.',
};

export default function AboutPage() {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://takimia.com/about#webpage',
        'url': 'https://takimia.com/about',
        'name': 'About Takimia',
        'description':
          'Takimia is an ecommerce retailer serving customers across the United States with premium coffee machines and barista essentials.',
        'mainEntity': {
          '@id': 'https://takimia.com/#organization',
        },
      },
      {
        '@type': 'OnlineStore',
        '@id': 'https://takimia.com/#organization',
        'name': 'Takimia',
        'url': 'https://takimia.com',
        'description':
          'Ecommerce store serving the United States with premium coffee machines, espresso makers, precision grinders, and barista essentials.',
        'email': 'contact@takimia.com',
        'telephone': ['+17863025205'],
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '680 N Golden Key St',
          'addressLocality': 'Gilbert',
          'addressRegion': 'AZ',
          'postalCode': '85233',
          'addressCountry': 'US',
        },
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'telephone': '+17863025205',
            'contactType': 'customer service',
            'areaServed': ['US'],
            'availableLanguage': ['en'],
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F6FF]">
      {/* Schema.org AboutPage & OnlineStore Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <AboutNotifier />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2e3868] to-[#2e3868] text-[#F0F6FF] py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6">About Takimia</h1>
          <p className="text-xl text-[#F0F6FF]/85 leading-relaxed max-w-3xl mx-auto">
            Welcome to Takimia, your trusted source for premium coffee machines, espresso makers, and specialty barista equipment. Based in the United States, we help coffee lovers discover commercial-grade performance, rich extractions, and durable appliances at fair and transparent prices.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        {/* US Presence */}
        <section className="mb-12 border-y border-[#2e3868]/15 py-9">
          <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2e3868] text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#262626]">Proudly US-based</h2>
            </div>
            <div className="space-y-4 text-base leading-7 text-gray-700">
              <p>
                Takimia operates out of Gilbert, Arizona, serving coffee enthusiasts and businesses across the United States. Our central warehouse and fulfillment operations are designed to get your coffee equipment to you safely and fast.
              </p>
              <p>
                Eligible products can be collected locally from our Gilbert, Arizona location. Our team confirms the available pickup address and collection time for each order before you travel.
              </p>
              <Link href="/local-pickup" className="inline-flex font-semibold text-[#2e3868] hover:text-[#1f274a] hover:underline">
                View the local pickup guide
              </Link>
            </div>
          </div>
        </section>

        {/* How We Keep Prices Low */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2e3868]/10 p-8 mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#262626]">How We Keep Prices Low While Staying 100 Percent Legit</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">
            Our business model is based on experience, smart sourcing, and efficiency. The reason our items are often 30 to 50 percent below retail is because we purchase differently from traditional stores.
          </p>

          <div className="space-y-6">
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 border-l-4 border-l-[#2e3868]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#2e3868] text-[#F0F6FF] rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#262626] mb-2">We win thousands of online auctions before items reach the public</h3>
                  <p className="text-gray-700">
                    Our sourcing team participates daily in high volume auctions across multiple platforms. By buying in bulk before products reach regular marketplaces, we secure lower costs and pass those savings directly to our customers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 border-l-4 border-l-[#2e3868]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#2e3868] text-[#F0F6FF] rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#262626] mb-2">We compare supplier options before purchasing</h3>
                  <p className="text-gray-700">
                    Our team reviews available inventory from independent suppliers, resale channels, wholesale sources, and local opportunities. We compare product details and market pricing before buying, which helps us keep inventory useful and competitively priced.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 border-l-4 border-l-[#2e3868]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#2e3868] text-[#F0F6FF] rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#262626] mb-2">We buy vetted overstock, return, and liquidation inventory</h3>
                  <p className="text-gray-700 mb-2">
                    When suitable inventory is available, we purchase from established wholesale, liquidation, and surplus channels. These lots may include overstock, open-box items, shelf pulls, refurbished pieces, and customer returns.
                  </p>
                  <p className="text-gray-700">
                    Every product is carefully inspected, tested, cleaned, or refurbished before being listed.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 border-l-4 border-l-[#2e3868]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#2e3868] text-[#F0F6FF] rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#262626] mb-2">We review local and wholesale opportunities</h3>
                  <p className="text-gray-700">
                    Our team may review local auctions, regional wholesalers, surplus sellers, and liquidation centers. This helps us find useful equipment and value-priced inventory that fits the Takimia catalog.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 border-l-4 border-l-[#2e3868]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#2e3868] text-[#F0F6FF] rounded-full flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#262626] mb-2">Fair pricing keeps our store competitive</h3>
                  <p className="text-gray-700">
                    Instead of adding heavy markups, we focus on fair margins and fast turnover. This approach keeps our prices consistent, honest, and genuinely competitive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Review Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2e3868]/10 p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#2e3868]/10 rounded-xl">
              <Users className="h-8 w-8 text-[#2e3868]" />
            </div>
            <h2 className="text-3xl font-bold text-[#262626]">How We Review Inventory Before It Goes Live</h2>
          </div>
          <p className="text-gray-700 mb-4 text-lg">
            Takimia may source products from vetted suppliers, wholesalers, liquidation channels, local auctions, and other independent inventory sources.
          </p>
          <p className="text-gray-700 mb-6">
            Before a product is listed, our team reviews the available product details and confirms that the listing is clear for customers. This includes:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#F0F6FF] rounded-lg p-4 border border-[#2e3868]/10">
              <CheckCircle2 className="h-6 w-6 text-[#2e3868] mb-2" />
              <p className="text-gray-700 font-medium">reviewing the listed condition</p>
            </div>
            <div className="bg-[#F0F6FF] rounded-lg p-4 border border-[#2e3868]/10">
              <Zap className="h-6 w-6 text-[#2e3868] mb-2" />
              <p className="text-gray-700 font-medium">checking product details and availability</p>
            </div>
            <div className="bg-[#F0F6FF] rounded-lg p-4 border border-[#2e3868]/10">
              <DollarSign className="h-6 w-6 text-[#2e3868] mb-2" />
              <p className="text-gray-700 font-medium">validating price, shipping, and return information</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6 bg-[#F0F6FF] rounded-lg p-4 border border-[#2e3868]/10">
            We update or remove listings when information changes, and we contact customers if an order cannot be fulfilled as described.
          </p>

          <div className="bg-[#F0F6FF] rounded-lg p-6 border border-[#2e3868]/10">
            <h3 className="text-xl font-bold text-[#262626] mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#2e3868]" />
              How it works for customers
            </h3>
            <p className="text-gray-700 mb-3">
              Product pages are designed to show the information customers need before purchase, including condition, pricing, availability, shipping, and return details.
            </p>
            <p className="text-gray-700 mb-3">
              If the final fulfillment review shows that an item is unavailable or different from the listing, we cancel or refund the order instead of shipping something unexpected.
            </p>
            <p className="text-gray-700">
              This keeps the shopping experience transparent while allowing us to offer a broader selection of coffee equipment at competitive prices.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-gradient-to-r from-[#2e3868] to-[#2e3868] rounded-2xl shadow-lg p-10 mb-12 text-[#F0F6FF] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#79D7F2]/15 rounded-full mb-6">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-[#F0F6FF]/85 mb-4">
            To give every coffee lover and barista access to premium espresso machines and coffee gear at honest, accessible prices.
          </p>
          <p className="text-lg text-[#F0F6FF]/85">
            Whether you need a dual-boiler espresso machine, precision burr grinder, or automatic drip brewer, you should enjoy cafe-quality coffee without unnecessary markups.
          </p>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2e3868]/10 p-8 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#79D7F2] rounded-xl">
              <Sparkles className="h-8 w-8 text-[#2e3868]" />
            </div>
            <h2 className="text-3xl font-bold text-[#262626]">What Makes Us Different</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Curated Inventory</h3>
              </div>
              <p className="text-gray-700">Every product is carefully inspected and verified before it is shipped to the customer.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Transparent Product Details</h3>
              </div>
              <p className="text-gray-700">We clearly list whether an item is new, open box, refurbished, or pre owned. Customers always know what they are buying.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Real Value</h3>
              </div>
              <p className="text-gray-700">We constantly compare and track market prices to ensure every listing is a genuine deal.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Headphones className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Customer Focus</h3>
              </div>
              <p className="text-gray-700">We offer fast and free shipping within the United States, a 30 day return policy, and reliable human support.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Sustainable Shopping</h3>
              </div>
              <p className="text-gray-700">By reselling returns, overstock, and refurbished goods, you help reduce waste and support a more sustainable buying cycle.</p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2e3868]/10 p-8 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#79D7F2] rounded-xl">
              <Heart className="h-8 w-8 text-[#2e3868]" />
            </div>
            <h2 className="text-3xl font-bold text-[#262626]">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F0F6FF] rounded-xl p-6 text-center border border-[#2e3868]/10">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#79D7F2]">
                <Shield className="h-8 w-8 text-[#2e3868]" />
              </div>
              <h3 className="font-bold text-[#262626] text-lg">Integrity</h3>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 text-center border border-[#2e3868]/10">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#79D7F2]">
                <Award className="h-8 w-8 text-[#2e3868]" />
              </div>
              <h3 className="font-bold text-[#262626] text-lg">Quality</h3>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 text-center border border-[#2e3868]/10">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#79D7F2]">
                <Users className="h-8 w-8 text-[#2e3868]" />
              </div>
              <h3 className="font-bold text-[#262626] text-lg">Customer Trust</h3>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 text-center border border-[#2e3868]/10">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#79D7F2]">
                <Zap className="h-8 w-8 text-[#2e3868]" />
              </div>
              <h3 className="font-bold text-[#262626] text-lg">Innovation and continuous improvement</h3>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-gradient-to-r from-[#2e3868] to-[#2e3868] rounded-2xl shadow-lg p-10 mb-12 text-[#F0F6FF]">
          <h3 className="text-3xl font-bold mb-8 text-center">Company Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-[#F0F6FF]/10 backdrop-blur-sm rounded-xl border border-[#F0F6FF]/20">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-[#F0F6FF]/80 text-sm">happy customers</div>
            </div>
            <div className="text-center p-6 bg-[#F0F6FF]/10 backdrop-blur-sm rounded-xl border border-[#F0F6FF]/20">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-[#F0F6FF]/80 text-sm">products sold</div>
            </div>
            <div className="text-center p-6 bg-[#F0F6FF]/10 backdrop-blur-sm rounded-xl border border-[#F0F6FF]/20">
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-[#F0F6FF]/80 text-sm">satisfaction rate</div>
            </div>
            <div className="text-center p-6 bg-[#F0F6FF]/10 backdrop-blur-sm rounded-xl border border-[#F0F6FF]/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-[#F0F6FF]/80 text-sm">support available</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2e3868]/10 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#2e3868]/10 rounded-xl">
              <Phone className="h-8 w-8 text-[#2e3868]" />
            </div>
            <h3 className="text-2xl font-bold text-[#262626]">Contact Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Business Address</div>
              </div>
              <div className="text-gray-600 ml-8">680 N Golden Key St, Gilbert Arizona 85233 United States</div>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Phone</div>
              </div>
              <div className="ml-8 space-y-3 text-gray-600">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-1">
                  <a href="tel:+17863025205" className="whitespace-nowrap hover:text-[#2e3868] transition-colors">
                    +1(786) 302-5205
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Email:</div>
              </div>
              <div className="text-gray-600 ml-8">contact@takimia.com</div>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Business Hours:</div>
              </div>
              <div className="text-gray-600 ml-8 space-y-1">
                <div>Monday - Friday: 9:00 AM - 5:00 PM EST</div>
                <div>Saturday - Sunday: Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
