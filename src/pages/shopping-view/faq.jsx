"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  CreditCard,
  Undo2,
  HeadphonesIcon,
  ChevronDown,
} from "lucide-react";

const faqs = [
  {
    section: "Orders & Shipping",
    icon: Truck,
    items: [
      {
        q: "How long will it take to receive my order?",
        a: "Orders are processed within 24 hours. Delivery within Lagos takes 1–3 working days, while nationwide shipping can take 3–7 working days depending on your location.",
      },
      {
        q: "Do you offer international shipping?",
        a: "Currently, we ship only within Nigeria, but international shipping will be available soon.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order ships, you’ll receive a tracking number via email or SMS so you can monitor its progress.",
      },
    ],
  },
  {
    section: "Products & Warranty",
    icon: Package,
    items: [
      {
        q: "Are your gadgets original?",
        a: "Absolutely. We source our products directly from trusted manufacturers and authorized distributors, ensuring you get 100% authentic devices.",
      },
      {
        q: "Do your products come with a warranty?",
        a: "Yes. Most gadgets come with a 6–12 month manufacturer warranty. Warranty details are listed on each product page.",
      },
      {
        q: "Do you sell refurbished devices?",
        a: "Yes, we sell certified refurbished gadgets that have been thoroughly tested and graded for quality.",
      },
    ],
  },
  {
    section: "Payments",
    icon: CreditCard,
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept debit/credit cards, bank transfers, and secure payment gateways like Paystack or Flutterwave.",
      },
      {
        q: "Can I pay on delivery?",
        a: "Pay-on-delivery is available for select locations. Contact our support team to confirm availability in your area.",
      },
    ],
  },
  {
    section: "Returns & Refunds",
    icon: Undo2,
    items: [
      {
        q: "Can I return a product if I’m not satisfied?",
        a: "Yes. We offer a 7-day return policy for unused products in their original packaging.",
      },
      {
        q: "How do I request a refund?",
        a: "Contact our customer service team with your order number, and we’ll guide you through the process. Refunds are processed within 5–7 business days.",
      },
    ],
  },
  {
    section: "Support & Contact",
    icon: HeadphonesIcon,
    items: [
      {
        q: "How can I contact customer support?",
        a: (
          <>
            You can reach us via email at{" "}
            <span className="font-medium">support@yourstore.com</span> or{" "}
            <a
              href="https://wa.me/2348097662998"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium hover:underline"
            >
              WhatsApp (+234 809 766 2998)
            </a>
            . Our support hours are Mon–Sat, 9 AM – 6 PM.
          </>
        ),
      },
      {
        q: "Do you offer tech assistance after purchase?",
        a: "Yes. Our team can assist with device setup, troubleshooting, and warranty claims.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>

      <div className="px-10 md:px-20 lg:px-40 space-y-6">
        {faqs.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="w-5 h-5 text-[#71c601]" />
              <h2 className="text-xl font-semibold">{section.section}</h2>
            </div>

            <div className="space-y-3">
              {section.items.map((item, idx) => {
                const indexKey = `${sectionIdx}-${idx}`;
                const isOpen = openIndex === indexKey;
                return (
                  <div
                    key={indexKey}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(indexKey)}
                      className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition"
                    >
                      {item.q}
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 text-gray-600 border-t bg-gray-50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-10 text-center">
        <p className="text-gray-700">
          Still have questions?{" "}
          <a
            href="https://wa.me/2348097662998"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline font-medium"
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
