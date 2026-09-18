"use client";

import { Zap } from 'lucide-react';
import type { Product } from '@/types/product';

export default function ProductStripeExpressCheckout({
  product,
  onNeedsAddress,
}: {
  product: Product;
  onNeedsAddress: () => void;
}) {
  const label = product.checkoutFlow === 'stripe-hosted'
    ? 'Checkout with Stripe'
    : 'Buy Now';

  return (
    <button
      type="button"
      onClick={onNeedsAddress}
      className="w-full bg-transparent border-2 border-[#2e3868] hover:border-[#1f274a] text-[#2e3868] hover:text-[#1f274a] py-4 px-6 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Zap className="h-5 w-5 mr-2" />
      {label}
    </button>
  );
}
