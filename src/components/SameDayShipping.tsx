"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Truck, MapPin, Package } from 'lucide-react';

interface SameDayShippingProps {
  fullWidth?: boolean;
  contained?: boolean;
}

const SameDayShipping: React.FC<SameDayShippingProps> = ({ fullWidth = false, contained = false }) => {
  const content = (
    <div className={`w-full ${fullWidth ? '' : 'max-w-7xl'} mx-auto`}>
      {/* Main Banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Image */}
          <div className="relative min-h-[360px] w-full md:min-h-[400px] md:w-[45%]">
            <Image
              src="/shipimage.png"
              alt="Takimia orders shipped via FedEx for fast, reliable delivery"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Section - Content */}
          <div className="md:w-[55%] bg-[#2e3868] text-[#F0F6FF] p-12 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-[#ffffff]">
              Shipped via FedEx — Fast, Tracked, and Reliable
            </h1>

            <p className="text-lg leading-relaxed font-normal mb-12">
              Every Takimia order is shipped through FedEx, one of the most trusted delivery networks in the United States. From the moment your order leaves our facility, it is handled with care and moving through a proven logistics network built for speed and reliability. Full tracking is provided so you can follow your shipment from dispatch to delivery.
            </p>
            <Link
              href="/shipping-policy"
              className="text-[#F0F6FF]/80 hover:text-[#F0F6FF] text-lg underline underline-offset-2 transition-colors"
            >
              See our shipping policy →
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-[#2e3868] rounded-full p-3 flex-shrink-0">
              <Clock className="w-6 h-6 text-[#F0F6FF]" />
            </div>
            <div>
              <h3 className="font-bold text-[#262626] text-lg mb-2">
                Fast, Reliable Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                We process orders promptly and work with FedEx to move your package quickly and reliably toward its destination.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-[#2e3868] rounded-full p-3 flex-shrink-0">
              <Package className="w-6 h-6 text-[#F0F6FF]" />
            </div>
            <div>
              <h3 className="font-bold text-[#262626] text-lg mb-2">
                Safe, Careful Handling
              </h3>
              <p className="text-gray-600 text-sm">
                Your order is prepared with care and handed to a trusted FedEx delivery network for secure transportation.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-[#2e3868] rounded-full p-3 flex-shrink-0">
              <Truck className="w-6 h-6 text-[#F0F6FF]" />
            </div>
            <div>
              <h3 className="font-bold text-[#262626] text-lg mb-2">
                FedEx Tracking You Can Follow
              </h3>
              <p className="text-gray-600 text-sm">
                FedEx tracking keeps you informed, so you can follow your package from dispatch through delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-gray-500 text-sm mb-2">
            Ready for fast, reliable delivery?
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[#262626]">
            Order today and let FedEx help move it safely toward you
          </p>
        </div>
        <a
          href="#products"
          className="bg-[#2e3868] hover:bg-[#1f274a] text-[#F0F6FF] font-bold py-4 px-10 rounded-xl text-lg transition-colors whitespace-nowrap"
        >
          Browse Products
        </a>
      </div>
    </div>
  );

  if (contained) {
    return (
      <div className="py-8 bg-gray-100 rounded-xl">
        {content}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {content}
      </div>
    </section>
  );
};

export default SameDayShipping;
