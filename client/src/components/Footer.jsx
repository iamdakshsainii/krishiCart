"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

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

    // Placeholder success — replace with your integration/request
    toast.success("Thank you for contacting KrishiCart! We'll get back to you soon.");
    setFormData({ email: "", message: "" });
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-white rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-white p-3 rounded-xl shadow-lg">
                  <FaSeedling className="text-blue-900 text-2xl" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  KrishiCart
                </h3>
                <span className="text-xs text-blue-200 font-medium -mt-1 tracking-wider">
                  PREMIUM
                </span>
              </div>
            </div>

            <p className="text-blue-100 mb-4 leading-relaxed text-base">
              Revolutionizing agriculture through technology. Connecting passionate farmers
              with conscious consumers for a sustainable future.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { number: "500+", label: "Products" },
                { number: "100+", label: "Farmers" },
                { number: "50K+", label: "Customers" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs text-blue-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <span className="text-sm font-medium text-blue-100">4.9/5 Rating</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-white"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { text: "Home", path: "/" },
                { text: "Products", path: "/products" },
                { text: "Farmers", path: "/farmers" },
                { text: "About Us", path: "/about" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="group flex items-center space-x-2 text-blue-100 hover:text-white transition-all duration-300 text-lg"
                  >
                    <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Form */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white relative">
              Contact Us
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-white"></div>
            </h3>

            <p className="text-blue-200 mb-4 text-sm leading-relaxed">
              Have questions or want to connect? Send us a message!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your email here"
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-blue-200 text-base"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Your message"
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-blue-200 text-base resize-none"
              />
              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-white to-blue-100 text-blue-900 px-5 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>

            <p className="text-xs text-blue-300 mt-3 text-center">
              🔒 Your privacy is protected. We do not share your data.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-blue-200 text-sm select-none">
            <div className="flex items-center space-x-2">
              <span>&copy; {currentYear} KrishiCart.</span>
              <span>Made with</span>
              <FaHeart className="text-red-400 animate-pulse" />
              <span>for farmers and communities.</span>
            </div>

            <div className="flex items-center space-x-6">
              <span>Powered by sustainable technology</span>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
