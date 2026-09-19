import type { Metadata } from 'next';
import LegalPageSchema from '@/components/LegalPageSchema';

export const metadata: Metadata = {
  title: 'Warranty & Replacement Policy | Takimia',
  description: 'Takimia warranty support, defective-product replacement, and customer service information.',
};

export default function WarrantyReplacementPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <LegalPageSchema
        name="Warranty & Replacement Policy | Takimia"
        description="Takimia warranty support, defective-product replacement, and customer service information."
        path="/warranty-replacement"
      />
      <article className="mx-auto max-w-4xl space-y-8 px-4 text-gray-700">
        <header>
          <h1 className="text-4xl font-bold text-[#262626]">Warranty & Replacement Policy</h1>
          <p className="mt-3 text-gray-600">Information for customers who receive a defective, damaged, or incorrect product.</p>
        </header>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Product-specific warranty</h2>
          <p>Any manufacturer warranty or seller warranty that applies to a product is identified on the product page or in the order documentation. Takimia does not claim to be an authorized manufacturer or service center unless that relationship is expressly stated and documented.</p>
          <p>Warranty coverage may differ by product condition, seller, and manufacturer. Customers should contact Takimia before sending an item back so the correct process can be confirmed.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Defective, damaged, or incorrect items</h2>
          <p>Contact us within 30 days of delivery with the order number, a description of the issue, and clear photographs when appropriate. We will review the request and provide the available remedy, which may include troubleshooting, replacement, repair coordination, or a refund.</p>
          <p>For an eligible return approved by Takimia, we provide return instructions and a prepaid label. Do not ship an item to an unconfirmed address.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Inspection and resolution</h2>
          <p>Returned products may be inspected to confirm the reported issue and condition. Approved refunds are issued to the original payment method within five business days after approval; banks and payment providers may take longer to display the credit.</p>
          <p>Replacement availability depends on current inventory. If a replacement is unavailable, Takimia will offer the applicable refund or another available resolution.</p>
        </section>
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-[#262626]">Contact support</h2>
          <p>Email <a className="font-semibold text-[#2e3868] underline" href="mailto:contact@takimia.com">contact@takimia.com</a> or call +1 (786) 302-5205, Monday through Friday, 9:00 AM–5:00 PM EST.</p>
          <p>This policy should be read together with the <a className="font-semibold text-[#2e3868] underline" href="/return-policy">Return & Exchange Policy</a>.</p>
        </section>
      </article>
    </main>
  );
}
