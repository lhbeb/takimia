import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderStripeStatus, getOrderById } from '@/lib/supabase/orders';
import { getProductBySlug } from '@/lib/supabase/products';
import { getStripeConfig } from '@/lib/supabase/payment-settings';

function getSafeStripeError(error: any): string {
  console.error('[Stripe Error Details]:', { type: error.type, code: error.code, message: error.message });
  if (error.type === 'card_error') return 'There was an issue with your payment method. Please try a different card or email contact@takimia.com';
  return 'Payment processing is temporarily unavailable. Please email contact@takimia.com';
}

export async function POST(request: NextRequest) {
  try {
    const stripeConfig = await getStripeConfig();
    if (!stripeConfig.isActive || !stripeConfig.secretKey || !stripeConfig.publishableKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please contact support to complete this order.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeConfig.secretKey, { apiVersion: '2026-01-28.clover' as any });
    const { intentId, orderId, product, shippingData } = await request.json();

    if (!product?.slug) {
      return NextResponse.json({ error: 'Missing required data: product' }, { status: 400 });
    }

    const dbProduct = await getProductBySlug(product.slug);
    if (!dbProduct) return NextResponse.json({ error: 'This product is no longer available for purchase.' }, { status: 404 });
    if (dbProduct.inStock === false) return NextResponse.json({ error: 'Sorry, this item is currently sold out.' }, { status: 409 });

    if (intentId) {
      // UPDATE existing intent
      if (!orderId || !shippingData) {
        return NextResponse.json({ error: 'Missing required data for update: orderId or shippingData' }, { status: 400 });
      }

      const order = await getOrderById(orderId);
      if (!order || order.product_slug !== dbProduct.slug) {
        return NextResponse.json({ error: 'Order does not match this product.' }, { status: 400 });
      }
      if (order.status === 'paid') return NextResponse.json({ error: 'This order has already been paid.' }, { status: 409 });

      const updateOptions: Stripe.PaymentIntentUpdateParams = {
        metadata: {
          order_id: orderId,
          product_slug: dbProduct.slug,
          product_id: dbProduct.id,
          customer_email: shippingData.email,
        },
      };

      if (typeof shippingData.fullName !== 'string' || !shippingData.fullName.trim()) {
        return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
      }
      
      updateOptions.receipt_email = shippingData.email;
      updateOptions.shipping = {
        name: shippingData.fullName.trim(),
        address: {
          line1: shippingData.streetAddress,
          line2: shippingData.addressLine2 || undefined,
          country: shippingData.countryCode || undefined,
          city: shippingData.city,
          state: shippingData.state,
          postal_code: shippingData.zipCode,
        },
      };

      const updatedIntent = await stripe.paymentIntents.update(intentId, updateOptions);
      
      const linked = await updateOrderStripeStatus(orderId, {
        stripe_payment_intent_id: updatedIntent.id,
        stripe_payment_status: updatedIntent.status,
        status: 'pending_payment',
      });
      if (!linked) throw new Error('Failed to link Stripe intent to order');

      return NextResponse.json({ clientSecret: updatedIntent.client_secret, intentId: updatedIntent.id });
    } else {
      // CREATE new intent
      const intentOptions: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(dbProduct.price * 100),
        currency: dbProduct.currency?.toLowerCase() || 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          product_slug: dbProduct.slug,
          product_id: dbProduct.id,
        },
      };

      const paymentIntent = await stripe.paymentIntents.create(intentOptions);
      return NextResponse.json({ clientSecret: paymentIntent.client_secret, intentId: paymentIntent.id });
    }
  } catch (error: any) {
    return NextResponse.json({ error: getSafeStripeError(error) }, { status: 500 });
  }
}
