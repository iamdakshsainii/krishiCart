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
import {
  FaLeaf,
  FaUsers,
  FaShoppingBasket,
  FaHandshake,
  FaArrowRight
} from "react-icons/fa";
import logo from "../assets/logo.png";

const HomePage = () => {
  const dispatch = useDispatch();
  const [chatOpen, setChatOpen] = useState(false);

  const { products = [], loading: productLoading } = useSelector(
    (state) => state.products
  );
  const { farmers = [], loading: farmerLoading } = useSelector(
    (state) => state.farmers
  );
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
      icon: <FaLeaf className="text-white text-3xl" />,
      title: "Fresh & Local",
      desc: "Fresh vegetables and fruits from local farmers near you.",
      bgColor: "bg-blue-500"
    },
    {
      icon: <FaUsers className="text-white text-3xl" />,
      title: "Help Farmers",
      desc: "Buy directly from farmers and help them earn better.",
      bgColor: "bg-blue-600"
    },
    {
      icon: <FaShoppingBasket className="text-white text-3xl" />,
      title: "Best Quality",
      desc: "Get the best quality products at fair prices.",
      bgColor: "bg-blue-500"
    },
    {
      icon: <FaHandshake className="text-white text-3xl" />,
      title: "Direct Connect",
      desc: "Connect directly with farmers without middleman.",
      bgColor: "bg-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-300 rounded-full opacity-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Side */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white shadow-md text-blue-700 text-sm font-semibold rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Farm Fresh • Delivered Daily</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Fresh Farm
              <span className="text-blue-600 block">Products</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Buy fresh vegetables and fruits directly from farmers.
              Good quality, good price, direct from farm to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/farmers"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-center"
              >
                Our Farmers
              </Link>
            </div>
          </div>

          {/* Logo Side */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-full p-8 shadow-lg hover:shadow-xl transition-shadow duration-500">
                <img
                  src={logo}
                  alt="KrishiCart Logo"
                  className="w-64 h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Trusted by 10K+ families
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple reasons to buy from KrishiCart
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center group border border-blue-100"
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fresh Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Best quality vegetables and fruits from our farmers
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg group"
            >
              See All Products
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <FaShoppingBasket className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the products you need easily
            </p>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-xl text-blue-600 font-bold text-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <FaLeaf className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No categories yet</p>
            </div>
          )}
        </div>
      </section>

      {/* FARMERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Farmers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Meet the farmers who grow fresh food for you
            </p>
            <Link
              to="/farmers"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg group"
            >
              See All Farmers
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          {farmers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {farmers.slice(0, 3).map((farmer) => (
                <div
                  key={farmer._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <FarmerCard farmer={farmer} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No farmers yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Shopping Fresh Today
          </h2>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            Join us and buy fresh vegetables and fruits directly from farmers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/register"
              className="bg-white text-blue-600 font-semibold rounded-lg px-8 py-4 hover:bg-gray-100 transition-colors duration-300"
            >
              Join Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white font-semibold rounded-lg px-8 py-4 hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Chat */}
      {!chatOpen && <ChatToggleButton onClick={() => setChatOpen(true)} />}
      <AssistantChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default HomePage;
