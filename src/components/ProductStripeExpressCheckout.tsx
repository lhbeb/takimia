"use client";

import { useEffect, useState } from 'react';
import { Elements, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import type { Product } from '@/types/product';

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() {
  if (!stripePromise) stripePromise = fetch('/api/config/stripe').then(r => r.json()).then(d => d.publishableKey ? loadStripe(d.publishableKey) : null);
  return stripePromise;
}

export default function ProductStripeExpressCheckout({ product, onNeedsAddress }: { product: Product; onNeedsAddress: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('/api/create-payment-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product }) })
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => { if (!active) return; if (ok && data.clientSecret) setClientSecret(data.clientSecret); else setError(data.error || 'Express Checkout is unavailable.'); })
      .catch(() => active && setError('Express Checkout is unavailable.'));
    return () => { active = false; };
  }, [product]);
  if (error) return null;
  if (!clientSecret) return <div className="h-12" aria-hidden="true" />;
  return <div className="w-full"><Elements stripe={getStripe()} options={{ clientSecret }}><ExpressCheckoutElement options={{ buttonType: { applePay: 'buy', googlePay: 'buy' }, layout: { maxColumns: 1, maxRows: 1, overflow: 'never' } }} onClick={({ reject }) => { onNeedsAddress(); reject(); }} onConfirm={onNeedsAddress} /></Elements></div>;
}
