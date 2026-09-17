"use client";

import React, { useEffect, useState } from 'react';
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { ShieldCheck } from 'lucide-react';
import type { ShippingData } from '@/app/checkout/types';

interface Props { clientSecret: string; isAddressVerified: boolean; onLockedPaymentAttempt: () => void; shippingData?: ShippingData; product: { title: string; price: number; currency?: string; images?: string[] }; sellerName?: string | null; }
let stripePromise: Promise<Stripe | null> | null = null;
function getStripe() { if (!stripePromise) stripePromise = fetch('/api/config/stripe').then(r => r.json()).then(d => { if (!d.publishableKey) throw new Error('Stripe is not configured'); return loadStripe(d.publishableKey); }); return stripePromise; }

function Form({ isAddressVerified, onLockedPaymentAttempt, shippingData, product, sellerName }: Omit<Props, 'clientSecret'>) {
  const stripe = useStripe(); const elements = useElements(); const [processing,setProcessing]=useState(false); const [error,setError]=useState('');
  const price = new Intl.NumberFormat('en-US',{style:'currency',currency:product.currency||'USD'}).format(product.price);
  const confirm = async () => {
    if (!isAddressVerified) { onLockedPaymentAttempt(); return; }
    if (!stripe || !elements) return;
    setProcessing(true); setError('');
    const submitted = await elements.submit();
    if (submitted.error) { setError(submitted.error.message || 'Please check your payment details.'); setProcessing(false); return; }
    const result = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${window.location.origin}/thankyou?payment_method=stripe` } });
    if (result.error) { setError(result.error.message || 'Payment could not be completed.'); setProcessing(false); }
  };
  return <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
    <div className="border-b border-gray-100 px-5 py-4"><div className="text-xs font-bold uppercase tracking-widest text-gray-400">Secure payment</div><div className="mt-1 font-semibold text-[#262626]">{product.title}</div><div className="mt-1 text-xl font-extrabold text-[#2e3868]">{price}</div>{sellerName&&<div className="text-xs text-gray-500">Sold by {sellerName}</div>}</div>
    <div className="space-y-5 p-5">
      <ExpressCheckoutElement options={{ buttonType: { applePay:'buy', googlePay:'buy' }, layout: { maxColumns: 1, maxRows: 1, overflow:'never' } }} onClick={({ resolve }) => { if (!isAddressVerified) onLockedPaymentAttempt(); resolve(); }} onConfirm={confirm} />
      <div className="flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200"/>or pay with card<span className="h-px flex-1 bg-gray-200"/></div>
      <PaymentElement options={{ layout:'accordion' }} />
      {error&&<div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#2e3868]"><ShieldCheck className="h-4 w-4"/>SSL encrypted checkout</div>
      <button type="button" onClick={confirm} disabled={!stripe||processing||!isAddressVerified} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2e3868] px-5 py-4 font-bold text-white transition hover:bg-[#1f274a] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">{processing?'Processing…':`Pay ${price}`}</button>
    </div>
  </div>;
}
export default function StripeElementsCheckout({clientSecret,...props}: Props) {
 const [error,setError]=useState(''); useEffect(()=>{getStripe().catch(()=>setError('Payment is temporarily unavailable.'))},[]);
 if(error)return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
 return <Elements stripe={getStripe()} options={{clientSecret,appearance:{theme:'stripe',variables:{colorPrimary:'#2e3868',borderRadius:'10px'}}}}><Form {...props}/></Elements>;
}
