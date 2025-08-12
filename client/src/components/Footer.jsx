"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaArrowRight,
  FaHeart,
  FaStar
} from "react-icons/fa";
import { toast } from "react-toastify";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({ email: "", message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message.");
      return;
    }
    toast.success(
      "Thank you for contacting KrishiCart! We'll get back to you soon."
    );
    setFormData({ email: "", message: "" });
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-white rounded-xl blur opacity-25"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-white p-2 rounded-xl shadow-lg">
                  <FaSeedling className="text-blue-900 text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black">KrishiCart</h3>
                <span className="text-[10px] text-blue-200 font-medium">
                  PREMIUM
                </span>
              </div>
            </div>
            <p className="text-blue-100 mb-3 text-sm leading-relaxed">
              Revolutionizing agriculture through technology. Connecting
              passionate farmers with conscious consumers for a sustainable
              future.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { number: "500+", label: "Products" },
                { number: "100+", label: "Farmers" },
                { number: "50K+", label: "Customers" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-base font-bold">{stat.number}</div>
                  <div className="text-[11px] text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
              <div className="flex text-yellow-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-[12px] font-medium">4.9/5 Rating</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-400 to-white"></div>
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { text: "Home", path: "/" },
                { text: "Products", path: "/products" },
                { text: "Farmers", path: "/farmers" },
                { text: "About Us", path: "/about" }
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="group flex items-center space-x-2 text-blue-100 hover:text-white transition-all duration-300"
                  >
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-bold mb-4 relative">
              Contact Us
              <div className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-blue-400 to-white"></div>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Your message"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm placeholder-blue-200 resize-none focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-white to-blue-100 text-blue-900 px-3 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-all"
              >
                Send Message
              </button>
            </form>
            <p className="text-[10px] text-blue-300 mt-2 text-center">
              🔒 Your privacy is protected.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-white/20 text-xs text-blue-200 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1">
            <span>&copy; {currentYear} KrishiCart.</span>
            <span>Made with</span>
            <FaHeart className="text-red-400 animate-pulse" />
            <span>for farmers.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by sustainable tech</span>
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-[10px]">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
