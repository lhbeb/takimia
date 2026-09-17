import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getOrderById, updateOrderStripeStatus } from '@/lib/supabase/orders';
import { getStripeConfig } from '@/lib/supabase/payment-settings';

export async function POST(request: NextRequest) {
  try {
    const stripeConfig = await getStripeConfig();
    const stripe = new Stripe(stripeConfig.secretKey || 'sk_test_placeholder', { apiVersion: '2026-01-28.clover' as any });
    const { sessionId } = await request.json();
    if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ status: 'pending', message: 'Payment not completed or still processing' });
    }

    const orderId = session.metadata?.order_id;
    if (!orderId) return NextResponse.json({ error: 'Session missing order metadata' }, { status: 400 });
    let order = await getOrderById(orderId);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (!['stripe', 'stripe-hosted'].includes(order.checkout_flow) || order.stripe_checkout_session_id !== session.id) {
      return NextResponse.json({ error: 'Payment session does not match this order' }, { status: 400 });
    }

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
    if (order.status !== 'paid') {
      const updated = await updateOrderStripeStatus(orderId, {
        status: 'paid',
        stripe_payment_intent_id: paymentIntentId,
        stripe_payment_status: session.payment_status,
        paid_at: new Date().toISOString(),
      });
      if (!updated) throw new Error('Failed to update paid order');
      order = (await getOrderById(orderId)) || order;
    }

    return NextResponse.json({
      status: 'paid',
      orderId: order.id,
      productSlug: order.product_slug,
      productTitle: order.product_title || null,
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email || session.customer_email || null,
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    console.error('[Payment Verification] Error:', error);
    return NextResponse.json({ error: 'Unable to verify payment. Please contact support if you completed a payment.' }, { status: 500 });
  }
}
