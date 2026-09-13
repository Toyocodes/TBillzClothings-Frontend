"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  CreditCard,
  Undo2,
  HeadphonesIcon,
  ChevronDown,
  MessageCircle,
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
            <span className="font-medium text-foreground">support@yourstore.com</span> or{" "}
            <a
              href="https://wa.me/2348097662998"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
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
    <div className="mx-auto max-w-[900px] px-5 py-16 md:px-8">
      <div className="mb-12 text-center">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          Help Center
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know about ordering, shipping, and support.
        </p>
      </div>

      <div className="space-y-10">
        {faqs.map((section, sectionIdx) => (
          <div key={section.section}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <section.icon className="h-4 w-4" />
              </span>
              <h2 className="font-display text-lg font-bold text-foreground">
                {section.section}
              </h2>
            </div>

            <div className="space-y-3">
              {section.items.map((item, idx) => {
                const indexKey = `${sectionIdx}-${idx}`;
                const isOpen = openIndex === indexKey;
                return (
                  <div
                    key={indexKey}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <button
                      onClick={() => toggleQuestion(indexKey)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60 md:text-base"
                    >
                      {item.q}
                      <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border p-4 text-sm leading-relaxed text-muted-foreground">
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
      <div className="mt-14 rounded-2xl border border-border bg-card p-8 text-center">
        <MessageCircle className="mx-auto mb-3 h-6 w-6 text-primary" />
        <p className="font-display text-lg font-bold text-foreground">Still have questions?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Our team typically replies within a few hours.
        </p>
        <a
          href="https://wa.me/2348097662998"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}
