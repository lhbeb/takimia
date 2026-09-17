import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderStripeStatus, getOrderById } from '@/lib/supabase/orders';
import { getProductBySlug } from '@/lib/supabase/products';
import { getStripeConfig } from '@/lib/supabase/payment-settings';
import { resolveBaseUrl } from '@/lib/url';

export async function POST(request: NextRequest) {
  try {
    const stripeConfig = await getStripeConfig();
    const stripe = new Stripe(stripeConfig.secretKey || 'sk_test_placeholder', { apiVersion: '2026-01-28.clover' as any });
    const { orderId, product, shippingData } = await request.json();
    if (!orderId || !product?.slug || !shippingData) {
      return NextResponse.json({ error: 'Missing required data: orderId, product or shippingData' }, { status: 400 });
    }
    if (typeof shippingData.fullName !== 'string' || !shippingData.fullName.trim()) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }
    shippingData.fullName = shippingData.fullName.trim();

    const dbProduct = await getProductBySlug(product.slug);
    if (!dbProduct) return NextResponse.json({ error: 'This product is no longer available for purchase.' }, { status: 404 });
    if (dbProduct.inStock === false) return NextResponse.json({ error: 'Sorry, this item is currently sold out.' }, { status: 409 });
    const order = await getOrderById(orderId);
    if (!order || order.product_slug !== dbProduct.slug) {
      return NextResponse.json({ error: 'Order does not match this product. Please start checkout again.' }, { status: 400 });
    }
    if (order.status === 'paid') return NextResponse.json({ error: 'This order has already been paid.' }, { status: 409 });

    const origin = process.env.NODE_ENV === 'development' ? request.nextUrl.origin : resolveBaseUrl();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: dbProduct.currency?.toLowerCase() || 'usd',
          product_data: { name: `Takimia order - ${orderId}` },
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?payment=cancelled&provider=stripe-hosted`,
      client_reference_id: orderId,
      customer_email: shippingData.email,
      payment_intent_data: {
        shipping: {
          name: shippingData.fullName || shippingData.email,
          address: {
            line1: shippingData.streetAddress,
            line2: shippingData.addressLine2 || undefined,
            country: shippingData.countryCode || undefined,
            city: shippingData.city,
            state: shippingData.state,
            postal_code: shippingData.zipCode,
          },
        },
      },
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      metadata: { order_id: orderId, product_slug: dbProduct.slug, product_id: dbProduct.id },
    });

    const linked = await updateOrderStripeStatus(orderId, {
      stripe_checkout_session_id: session.id,
      status: 'pending_payment',
      checkout_expires_at: new Date(Date.now() + 31 * 60 * 1000).toISOString(),
    });
    if (!linked) throw new Error('Failed to link Stripe session to order');
    if (!session.url) throw new Error('Stripe did not return a hosted Checkout URL');
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[Stripe Hosted Error]', error);
    return NextResponse.json({ error: 'Payment processing is temporarily unavailable. Please email contact@takimia.com' }, { status: 500 });
  }
}
