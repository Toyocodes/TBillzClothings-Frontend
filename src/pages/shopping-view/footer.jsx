import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white py-12 md:px-24 px-12 mt-12">
      {/* Curved Top Border */}
      <div className="absolute top-0 left-0 w-full h-10 bg-black -translate-y-1/2 rounded-t-[50%]"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* SHOP LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2">
            <li>
              <a href="/shop/listing?category=men" className="text-gray-400 hover:text-white transition">
                Men
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=women" className="text-gray-400 hover:text-white transition">
                Women
              </a>
            </li>
            <li>
              <a href="/shop/listing?category=kids" className="text-gray-400 hover:text-white transition">
                Kids
              </a>
            </li>
          </ul>
        </div>

        {/* CUSTOMER SERVICE */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-white transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/shop/account" className="text-gray-400 hover:text-white transition">
                Order Tracking
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-4">
            Subscribe for the latest deals & fashion trends.
          </p>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 p-2 rounded-md">
              <FiSend size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TBillzStore. All rights reserved.
      </div>
    </footer>
  );
}
