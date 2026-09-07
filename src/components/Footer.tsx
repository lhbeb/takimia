import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const socialIconClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#44518c]/60 text-[#F0F6FF] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#44518c] hover:bg-[#44518c] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2e3868]';

const Footer = () => {
  return (
    <footer className="bg-[#2e3868] text-[#F0F6FF]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/logosvg.svg"
                alt="Takimia Logo"
                width={176}
                height={40}
                className="h-auto w-40 brightness-0 invert sm:w-44"
              />
            </Link>
            <p className="mb-4 text-[#F0F6FF]">
              Premium coffee machines, espresso makers, precision grinders, and barista essentials for home and commercial brewing.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 shrink-0 text-[#4575ba] mr-2" />
                <a href="tel:+17863025205" className="hover:text-[#f5970c] transition-colors duration-300">
                  <span className="font-semibold">United States:</span> +1(786) 302-5205
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#4575ba] mr-2" />
                <a href="mailto:contact@takimia.com" className="hover:text-[#f5970c] transition-colors duration-300">
                  contact@takimia.com
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 shrink-0 text-[#4575ba] mr-2 mt-1" />
                <div>
                  <span className="block font-semibold text-white">Business Address</span>
                  <span>680 N Golden Key St, Gilbert Arizona 85233 United States</span>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <a
                  href="https://www.instagram.com/takimia.house"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialIconClass}
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F0F6FF] mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#f5970c] transition-colors duration-300">Home</Link></li>
              <li><Link href="/#products" className="hover:text-[#f5970c] transition-colors duration-300">Products</Link></li>
              <li><Link href="/#featured" className="hover:text-[#f5970c] transition-colors duration-300">Featured</Link></li>
              <li><Link href="/track" className="hover:text-[#f5970c] transition-colors duration-300">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-[#f5970c] transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#F0F6FF] mb-4">Policies & Info</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-[#f5970c] transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#f5970c] transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-[#f5970c] transition-colors duration-300">About Us</Link></li>
              <li><Link href="/frequently-asked-questions" className="hover:text-[#f5970c] transition-colors duration-300">FAQs</Link></li>
              <li><Link href="/return-policy" className="hover:text-[#f5970c] transition-colors duration-300">Refund & Return Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#f5970c] transition-colors duration-300">Shipping Policy</Link></li>
              <li><Link href="/local-pickup" className="hover:text-[#f5970c] transition-colors duration-300">Local Pickup Guide</Link></li>
              <li><Link href="/contact" className="hover:text-[#f5970c] transition-colors duration-300">Contact Us</Link></li>
              <li><Link href="/cookies" className="hover:text-[#f5970c] transition-colors duration-300">Cookies Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F0F6FF]/20 mt-12 pt-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center">
              <Image
                src="/secure-checkout.png"
                alt="Secure Checkout"
                width={400}
                height={64}
                className="h-16 w-auto max-w-full object-contain brightness-110 contrast-110"
              />
            </div>
            <p className="text-center">© 2025 Takimia. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
