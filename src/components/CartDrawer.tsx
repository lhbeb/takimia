"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Loader2, ShoppingCart, Trash2, X } from 'lucide-react';
import { clearCart, getCartItem, type CartItem } from '@/utils/cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');

  const syncCart = useCallback(() => {
    setCartItem(getCartItem());
  }, []);

  useEffect(() => {
    syncCart();
    window.addEventListener('cartUpdated', syncCart);
    return () => window.removeEventListener('cartUpdated', syncCart);
  }, [syncCart]);

  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartDrawerClosed'));
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!cartItem) return;
    setError('');
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/shopify/quick-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: cartItem.product.slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to generate checkout link');
      }

      window.location.assign(data.url);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
  };

  const handleRemove = () => {
    clearCart();
    setCartItem(null);
  };

  const product = cartItem?.product;
  const image = product?.images?.[0] ?? null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#2e3868]/10 bg-[#2e3868] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-[#79D7F2]" />
            <span className="text-base font-bold text-white">Your Cart</span>
            {cartItem && (
              <span className="rounded-full bg-[#79D7F2] px-2 py-0.5 text-xs font-bold text-[#2e3868]">
                1
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!cartItem ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-9 w-9 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-700">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add a product to get started.</p>
              <button
                onClick={onClose}
                className="mt-2 text-sm font-semibold text-[#2e3868] hover:underline"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                  {image ? (
                    <Image
                      src={image}
                      alt={product!.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <ShoppingCart className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                    {product!.title}
                  </p>
                  {product!.brand && (
                    <p className="mb-2 text-xs text-gray-400">{product!.brand}</p>
                  )}
                  {(product as any)?.selectedSize && (
                    <p className="mb-2 text-xs text-gray-500">
                      Size: <span className="font-medium">{(product as any).selectedSize}</span>
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-base font-bold text-[#2e3868]">
                      ${product!.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={handleRemove}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#2e3868]/10 bg-[#eef7fb] px-4 py-3 text-xs font-medium text-[#2e3868]">
                <span>Free shipping across the United States</span>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {cartItem && (
          <div className="space-y-3 border-t border-gray-100 bg-white px-5 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">
                ${product!.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-gray-400">Taxes and final shipping calculated at checkout.</p>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2e3868] px-6 py-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1f274a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading checkout...
                </>
              ) : (
                <>
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 pt-1">
              <span className="text-[10px] text-gray-400">Secure checkout</span>
              <span className="text-[10px] text-gray-400">30-day returns</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
