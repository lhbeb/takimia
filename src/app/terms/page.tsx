import React from 'react';
import LegalPageSchema from '@/components/LegalPageSchema';

const TermsPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 py-12">
      <LegalPageSchema
        name="Terms of Service | Takimia"
        description="Takimia terms of service for its ecommerce store, products, payments, shipping, returns, and customer support."
        path="/terms"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#262626] mb-2">Takimia Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: {currentDate}</p>
        
        <div className="prose max-w-none text-gray-700 space-y-8">
          <p className="text-lg leading-relaxed">
            Welcome to Takimia. We are a coffee and espresso machine brand that designs and sells premium coffee equipment. By accessing or using our website or services, you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree, please discontinue using the site.
          </p>

          {/* Section 1: Overview */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">1. Overview</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Takimia is a coffee and espresso machine brand operating as an online retailer.</li>
              <li>We sell espresso machines, coffee brewers, precision grinders, and barista accessories.</li>
              <li>Every product listing is reviewed by our team before it is published.</li>
              <li>Takimia is the seller and primary point of contact for purchases made through our website. All purchases are processed under these Terms.</li>
            </ul>
          </div>

          {/* Section 2: Account Terms */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">2. Account Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be 18 years or older to use this service.</li>
              <li>You must provide accurate and complete information during account creation.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized access or security concerns.</li>
            </ul>
          </div>

          {/* Section 3: Sourcing and Fulfillment Terms */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">3. Sourcing and Fulfillment Terms</h2>
            <p className="mb-4">
              Takimia sources products through vetted suppliers and wholesale channels. Products are offered for sale by Takimia unless a product page clearly states otherwise. Products are offered for sale by Takimia unless a product page clearly states otherwise.
            </p>

            <h3 className="text-xl font-bold text-[#262626] mt-6 mb-3">3.1 Supplier Review Process</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Inventory sources are reviewed before items are listed.</li>
              <li>Product information, condition, pricing, and images are checked before publication.</li>
            </ul>

            <h3 className="text-xl font-bold text-[#262626] mt-6 mb-3">3.2 Fulfillment Process</h3>
            <p className="mb-2">When you purchase an item from Takimia:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The product page provides the available product details, price, condition, and delivery information.</li>
              <li>Our team prepares the order for shipment through the fulfillment method available for that item.</li>
              <li>If an item cannot be fulfilled as listed, we will contact you, cancel the order, or issue a refund.</li>
            </ul>
            <p className="mb-4">
              Takimia reserves the right to reject, refund, or cancel any order if the item is unavailable, fails final review, or cannot be shipped as described.
            </p>

            <h3 className="text-xl font-bold text-[#262626] mt-6 mb-3">3.3 Product Accuracy</h3>
            <p className="mb-2">Takimia works to keep product pages accurate by reviewing:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Product titles, images, and descriptions</li>
              <li>Condition notes and availability</li>
              <li>Price, shipping, and return information</li>
            </ul>
            <p>
              If we discover inaccurate information, we may update the listing, contact affected customers, cancel the order, or issue a refund.
            </p>
          </div>

          {/* Section 4: Product Terms */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">4. Product Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We aim to provide accurate and detailed product descriptions.</li>
              <li>Products may be new, open-box, or refurbished. Condition is clearly labeled on each product page.</li>
              <li>All used or open-box electronics are tested prior to sale.</li>
              <li>Product availability is not guaranteed until an order is processed.</li>
              <li>Prices may change at any time due to market conditions and sourcing costs.</li>
              <li>We reserve the right to modify, limit, or discontinue any product or listing.</li>
            </ul>
          </div>

          {/* Section 5: Sourcing Transparency */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">5. Product Quality</h2>
            <p className="mb-4">
              Takimia is committed to offering quality coffee and espresso equipment. Before any product is listed on our website:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Product condition and specifications are reviewed and confirmed.</li>
              <li>Products are sourced through vetted suppliers and wholesale partners.</li>
              <li>Minor cosmetic variations on open-box or display items are noted in the listing.</li>
            </ul>
            <p>
              Our goal is to give every customer accurate information before they buy.
            </p>
          </div>

          {/* Section 6: Shipping Policy */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">6. Shipping Policy</h2>
            <p className="mb-4">
              Free standard shipping applies to all orders within the United States.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Same-day shipping is available for orders placed before 2:00 PM EST.</li>
              <li>Standard processing time is 0 to 1 business day.</li>
              <li>Domestic USA delivery time is 5 to 9 business days.</li>
              <li>All orders qualify for free standard shipping with no minimum spend required.</li>
              <li>Tracking information is sent to the customer via email once the order ships.</li>
            </ul>
            <p className="mt-4">
              Takimia is not responsible for delays caused by carriers or incorrect shipping information provided by the customer.
            </p>
          </div>

          {/* Section 7: Payment Terms */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">7. Payment Terms</h2>
            <p className="mb-4">We accept the following payment methods:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Credit and debit cards</li>
              <li>Visa, Mastercard, American Express</li>
              <li>PayPal</li>
              <li>Shop Pay</li>
              <li>Apple Pay</li>
            </ul>
            <p className="mt-4">
              All payments must be received in full before an order is processed.
            </p>
          </div>

          {/* Section 8: Returns and Satisfaction Guarantee */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">8. Returns and Satisfaction Guarantee</h2>
            <p className="mb-4">Your satisfaction is our priority.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We offer a 30 day hassle free return policy.</li>
              <li>Items must be returned in the same condition received.</li>
              <li>Refunds are issued after the item passes inspection at our warehouse.</li>
              <li>Exchanges are available when inventory permits.</li>
              <li>We work quickly to resolve any concerns, disputes, or issues.</li>
            </ul>
            <p className="mt-4">
              Products manufactured by Takimia and products retailed from our approved suppliers follow this same return process unless a product page clearly states otherwise.
            </p>
          </div>

          {/* Section 9: Limitation of Liability */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              Takimia is not liable for indirect, incidental, punitive, or consequential damages arising from your use of our services, products, or platform.
            </p>
            <p>
              However, we are committed to resolving legitimate customer concerns and will work with you to reach a fair and reasonable solution.
            </p>
          </div>

          {/* Section 10: Fraud Prevention and Compliance */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">10. Fraud Prevention and Compliance</h2>
            <p className="mb-4">
              Takimia monitors orders for unusual activity to protect customers and sellers.
            </p>
            <p className="mb-4">
              We reserve the right to cancel or delay orders suspected of fraud or unauthorized use of payment methods.
            </p>
            <p>
              Creating false accounts, listing products fraudulently, or misrepresenting product ownership is strictly prohibited.
            </p>
          </div>

          {/* Section 11: Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-[#262626] mt-10 mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div>
                <div className="font-medium text-[#262626] mb-1">Phone:</div>
                <div className="text-gray-600">+1(786) 302-5205</div>
              </div>
              <div>
                <div className="font-medium text-[#262626] mb-1">Email:</div>
                <div className="text-gray-600">contact@takimia.com</div>
              </div>
              <div>
                <div className="font-medium text-[#262626] mb-1">Business Address:</div>
                <div className="text-gray-600">680 N Golden Key St, Gilbert Arizona 85233 United States</div>
              </div>
              <div>
                <div className="font-medium text-[#262626] mb-1">Hours:</div>
                <div className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM EST</div>
                <div className="text-gray-600">Saturday - Sunday: Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 
