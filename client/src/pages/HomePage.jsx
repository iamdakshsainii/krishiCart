"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import AssistantChat from "../components/AssistantChat";
import ChatToggleButton from "../components/ChatToggleButton";

import { FaLeaf, FaUsers, FaShoppingBasket, FaHandshake, FaStar, FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo.png";

const HomePage = () => {
  const dispatch = useDispatch();
  const [chatOpen, setChatOpen] = useState(false);

  const { products = [], loading: productLoading } = useSelector((state) => state.products);
  const { farmers = [], loading: farmerLoading } = useSelector((state) => state.farmers);
  const { categories = [] } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  if (productLoading || farmerLoading) {
    return <Loader />;
  }

  const features = [
    {
      icon: <FaLeaf className="text-white text-4xl" />,
      title: "Fresh & Local",
      desc: "Fresh vegetables and fruits from local farmers near you.",
      bgColor: "bg-blue-500",
    },
    {
      icon: <FaUsers className="text-white text-4xl" />,
      title: "Help Farmers",
      desc: "Buy directly from farmers and help them earn better.",
      bgColor: "bg-blue-600",
    },
    {
      icon: <FaShoppingBasket className="text-white text-4xl" />,
      title: "Best Quality",
      desc: "Get the best quality products at fair prices.",
      bgColor: "bg-blue-500",
    },
    {
      icon: <FaHandshake className="text-white text-4xl" />,
      title: "Direct Connect",
      desc: "Connect directly with farmers without middleman.",
      bgColor: "bg-blue-600",
    },
  ];

  return (
    <div className="overflow-x-hidden bg-white text-gray-900 relative">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-24 bg-gradient-to-br from-blue-50 to-white">
        {/* Background subtle shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(59, 130, 246, 0.06) 0, rgba(59, 130, 246, 0.06) 1px, transparent 1px, transparent 20px)
            `,
          }}
        />

        {/* Text */}
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full px-5 py-2 mb-6 shadow border border-blue-200">
            <FaStar className="text-blue-600" />
            <span className="uppercase tracking-wide">KrishiCart Premium</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-blue-900">
            Fresh Farm <br />
            <span className="text-3xl sm:text-4xl md:text-5xl font-semibold">Products</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl leading-relaxed">
            Buy fresh vegetables and fruits directly from farmers.
            Good quality, good price, direct from farm to your home.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link to="/products"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow hover:bg-blue-700 transition-colors">
              Shop Now
            </Link>
            <Link to="/farmers"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors">
              Our Farmers
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="relative z-10 mt-16 md:mt-0 flex justify-center md:justify-end">
          <div className="group relative cursor-pointer">
            <img
              src={logo}
              alt="KrishiCart Logo"
              className="w-64 h-64 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 rounded-full pointer-events-none group-hover:shadow-lg group-hover:shadow-green-300/50 transition-shadow duration-300"></div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
              Why Choose <span className="text-blue-700">Us?</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">Simple reasons to buy from KrishiCart</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
                <div className={`w-16 h-16 mb-6 rounded-xl flex items-center justify-center ${item.bgColor}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Fresh Products</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">Best quality vegetables and fruits from our farmers</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg">
              See All Products <FaArrowRight />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-blue-50 rounded-xl">No products yet</div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
              Shop by <span className="text-blue-700">Category</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find the products you need easily</p>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category._id} to={`/products?category=${category._id}`}
                  className="bg-blue-50 rounded-xl p-6 text-center shadow hover:shadow-md border border-blue-100 hover:bg-blue-100">
                  <div className="w-16 h-16 bg-blue-500 rounded-xl text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-blue-900">{category.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-blue-50 rounded-xl">No categories yet</div>
          )}
        </div>
      </section>

      {/* OUR FARMERS */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
              Our <span className="text-blue-700">Farmers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Meet the farmers who grow fresh food for you</p>
            <Link to="/farmers" className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-semibold text-lg">
              See All Farmers <FaArrowRight />
            </Link>
          </div>
          {farmers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {farmers.slice(0, 3).map((farmer) => (
                <div key={farmer._id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-blue-100">
                  <FarmerCard farmer={farmer} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-blue-100">No farmers yet</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Start Shopping Fresh Today
          </h2>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-blue-100">
            Join us and buy fresh vegetables and fruits directly from farmers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-lg mx-auto mb-16">
            <Link to="/register" className="bg-white text-blue-600 font-semibold rounded-xl px-10 py-4 shadow hover:bg-blue-50">
              Join Now
            </Link>
            <Link to="/about" className="border-2 border-white text-white font-semibold rounded-xl px-10 py-4 hover:bg-white hover:text-blue-600">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Chat UI */}
      {!chatOpen && <ChatToggleButton onClick={() => setChatOpen(true)} />}
      <AssistantChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default HomePage;
