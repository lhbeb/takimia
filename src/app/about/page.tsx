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
  Leaf,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Clock,
  Coffee,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Takimia',
  description:
    'Takimia is a coffee and espresso machine brand based in the United States. We design and sell premium espresso machines, coffee brewers, and barista accessories for home and professional use.',
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
          'Takimia is a coffee and espresso machine brand that designs and sells premium brewing equipment to customers across the United States.',
        'mainEntity': {
          '@id': 'https://takimia.com/#organization',
        },
      },
      {
        '@type': 'Brand',
        '@id': 'https://takimia.com/#organization',
        'name': 'Takimia',
        'url': 'https://takimia.com',
        'description':
          'Takimia is a coffee and espresso machine brand offering premium espresso makers, coffee brewers, precision grinders, and barista accessories.',
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
            Takimia is a coffee and espresso machine brand built for people who take their brew seriously. We design and sell premium espresso machines, coffee brewers, and barista accessories crafted to deliver consistent, café-quality results at home and in professional settings.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-12">

        {/* Who We Are */}
        <section className="mb-12 border-y border-[#2e3868]/15 py-9">
          <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2e3868] text-white">
                <Coffee className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-[#262626]">Who We Are</h2>
            </div>
            <div className="space-y-4 text-base leading-7 text-gray-700">
              <p>
                Takimia is a dedicated coffee and espresso machine brand. Every product in our lineup — from single-boiler espresso machines to automatic drip brewers and precision burr grinders — is selected and tested to meet the standards of coffee enthusiasts and professional baristas alike.
              </p>
              <p>
                We are based in Gilbert, Arizona and serve customers across the United States with fast, reliable shipping and knowledgeable customer support.
              </p>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#2e3868]/10 p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#2e3868]/10 rounded-xl">
              <Package className="h-8 w-8 text-[#2e3868]" />
            </div>
            <h2 className="text-3xl font-bold text-[#262626]">What We Offer</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">
            The Takimia catalog covers the full spectrum of home and professional coffee brewing equipment.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Espresso Machines', desc: 'From entry-level semi-automatics to dual-boiler professional machines designed for precision extraction.' },
              { title: 'Coffee Brewers', desc: 'Automatic drip brewers, pour-over systems, and French press setups for every brewing preference.' },
              { title: 'Precision Grinders', desc: 'Burr grinders engineered for consistent grind size — the foundation of any great cup.' },
              { title: 'Barista Accessories', desc: 'Tampers, milk frothers, portafilters, knock boxes, and everything else a serious barista needs.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-[#2e3868] flex-shrink-0" />
                  <h3 className="font-bold text-[#262626]">{title}</h3>
                </div>
                <p className="text-gray-600 text-sm ml-8">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-gradient-to-r from-[#2e3868] to-[#2e3868] rounded-2xl shadow-lg p-10 mb-12 text-[#F0F6FF] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#79D7F2]/15 rounded-full mb-6">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-[#F0F6FF]/85 mb-4">
            To make premium coffee and espresso equipment accessible to every home brewer and professional barista in the United States.
          </p>
          <p className="text-lg text-[#F0F6FF]/85">
            Great coffee starts with great equipment. Takimia exists to put the right tools in the hands of people who care about what is in their cup.
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
                <Coffee className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Coffee-Only Focus</h3>
              </div>
              <p className="text-gray-700">We specialize exclusively in coffee and espresso equipment. Every product we carry is chosen by people who understand the craft of brewing.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Transparent Listings</h3>
              </div>
              <p className="text-gray-700">Every product page clearly states condition, specifications, and what is included in the box. No surprises at delivery.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Quality You Can Trust</h3>
              </div>
              <p className="text-gray-700">All products are inspected and verified before shipping. We stand behind what we sell with clear return and support policies.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Headphones className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">Real Customer Support</h3>
              </div>
              <p className="text-gray-700">Free shipping across the United States, a 30-day return policy, and a support team that actually knows coffee equipment.</p>
            </div>

            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Leaf className="h-6 w-6 text-[#2e3868]" />
                <h3 className="text-xl font-bold text-[#262626]">US-Based and Reliable</h3>
              </div>
              <p className="text-gray-700">We ship from within the United States with fast processing times. Local pickup is available from our Gilbert, Arizona location for eligible orders.</p>
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
            {[
              { icon: Shield, label: 'Integrity' },
              { icon: Award, label: 'Quality' },
              { icon: Users, label: 'Customer Trust' },
              { icon: Zap, label: 'Continuous Improvement' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-[#F0F6FF] rounded-xl p-6 text-center border border-[#2e3868]/10">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#79D7F2]">
                  <Icon className="h-8 w-8 text-[#2e3868]" />
                </div>
                <h3 className="font-bold text-[#262626] text-lg">{label}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-gradient-to-r from-[#2e3868] to-[#2e3868] rounded-2xl shadow-lg p-10 mb-12 text-[#F0F6FF]">
          <h3 className="text-3xl font-bold mb-8 text-center">By the Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '5,000+', label: 'happy customers' },
              { value: '1,000+', label: 'machines sold' },
              { value: '99%', label: 'satisfaction rate' },
              { value: '24/7', label: 'support available' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center p-6 bg-[#F0F6FF]/10 backdrop-blur-sm rounded-xl border border-[#F0F6FF]/20">
                <div className="text-4xl font-bold mb-2">{value}</div>
                <div className="text-[#F0F6FF]/80 text-sm">{label}</div>
              </div>
            ))}
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
              <div className="text-gray-600 ml-8">680 N Golden Key St, Gilbert, Arizona 85233, United States</div>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Phone</div>
              </div>
              <div className="ml-8 text-gray-600">
                <a href="tel:+17863025205" className="hover:text-[#2e3868] transition-colors">
                  +1 (786) 302-5205
                </a>
              </div>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Email</div>
              </div>
              <div className="text-gray-600 ml-8">contact@takimia.com</div>
            </div>
            <div className="bg-[#F0F6FF] rounded-xl p-6 border border-[#2e3868]/10">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-[#2e3868]" />
                <div className="font-medium text-[#262626]">Business Hours</div>
              </div>
              <div className="text-gray-600 ml-8 space-y-1">
                <div>Monday – Friday: 9:00 AM – 5:00 PM EST</div>
                <div>Saturday – Sunday: Closed</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
