import type { Metadata } from 'next';
import LegalPageSchema from '@/components/LegalPageSchema';

export const metadata: Metadata = {
  title: 'Billing & Payment Policy | Takimia',
  description: 'Takimia billing, payment, authorization, cancellation, and refund information.',
};

export default function BillingPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <LegalPageSchema
        name="Billing & Payment Policy | Takimia"
        description="Takimia billing, payment, authorization, cancellation, and refund information."
        path="/billing-policy"
      />
      <article className="mx-auto max-w-4xl space-y-8 px-4 text-gray-700">
        <header>
          <h1 className="text-4xl font-bold text-[#262626]">Billing & Payment Policy</h1>
          <p className="mt-3 text-gray-600">Clear information about how Takimia processes payments and refunds.</p>
        </header>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Accepted payment methods</h2>
          <p>Takimia accepts major credit and debit cards through Stripe. Where supported by the customer&apos;s device and browser, Apple Pay, Google Pay, and Link may also appear at checkout. Payment options are shown before the customer confirms payment.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Authorization and charges</h2>
          <p>The total product price and any applicable delivery charges are shown before payment. A payment is submitted only after the customer confirms the order. Takimia does not add undisclosed processing, membership, or subscription charges.</p>
          <p>Payment details are processed by the selected payment provider. Takimia does not store complete card numbers.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Order cancellation and failed payments</h2>
          <p>A payment may be declined by the payment provider or held for fraud review. If Takimia cannot fulfill an accepted order, we will contact the customer and issue a refund to the original payment method.</p>
          <p>Customers can contact us promptly about a cancellation request. A cancellation is not guaranteed after an order has entered fulfillment.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Refund timing</h2>
          <p>Approved refunds are sent to the original payment method after the applicable return or cancellation review. Takimia aims to issue approved refunds within five business days; the payment provider or bank may require additional time to display the credit.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Questions</h2>
          <p>For billing questions, contact <a className="font-semibold text-[#2e3868] underline" href="mailto:contact@takimia.com">contact@takimia.com</a> or call +1 (786) 302-5205.</p>
        </section>
      </article>
    </main>
  );
}
