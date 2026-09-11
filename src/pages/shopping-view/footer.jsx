import { ShoppingBag } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-14 md:px-10 lg:px-12">
      <div className="mx-auto grid max-w-[1344px] grid-cols-1 gap-10 md:grid-cols-4">
        {/* BRAND */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-gradient-brand">
              <ShoppingBag className="h-[15px] w-[15px] text-white" />
            </span>
            <span className="font-display text-lg font-bold text-foreground">
              Nexa Gadgets
            </span>
          </div>
          <p className="max-w-[260px] text-sm text-muted-foreground">
            Genuine gadgets, fast delivery, real warranty &mdash; across Nigeria.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaFacebookF size={15} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaTwitter size={15} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaYoutube size={15} />
            </a>
          </div>
        </div>

        {/* SHOP LINKS */}
        <div>
          <h3 className="mb-4 text-sm font-bold text-foreground">Shop</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="/shop/listing?category=headphones" className="transition-colors hover:text-foreground">
                Headphones
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=airpods" className="transition-colors hover:text-foreground">
                AirPods
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=powerbanks" className="transition-colors hover:text-foreground">
                Power Banks
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=phones" className="transition-colors hover:text-foreground">
                Phones
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=smartwatch" className="transition-colors hover:text-foreground">
                Smartwatch
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=laptop" className="transition-colors hover:text-foreground">
                Laptop
              </a>
            </li>
          </ul>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h3 className="mb-4 text-sm font-bold text-foreground">Customer Service</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="/shop/faq" className="transition-colors hover:text-foreground">
                FAQs
              </a>
            </li>
            <li>
              <a href="/shop/account" className="transition-colors hover:text-foreground">
                Order Tracking
              </a>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="mb-4 text-sm font-bold text-foreground">Stay Updated</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Subscribe for the latest deals &amp; tech drops.
          </p>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-brand p-2">
              <FiSend size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mx-auto mt-10 max-w-[1344px] border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Nexa Gadgets. All rights reserved.
      </div>
    </footer>
  );
}
