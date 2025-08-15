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
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
      desc: "Fresh vegetables and fruits from local farmers.",
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 opacity-30 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-300 opacity-50 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white shadow-md text-blue-700 text-sm font-semibold rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Farm Fresh • Delivered Daily</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Fresh Farm <span className="text-blue-600 block">Products</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Buy fresh vegetables and fruits directly from farmers. Good quality, good price, direct from farm to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-4 font-semibold text-center">
                Shop Now
              </Link>
              <Link to="/farmers" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg px-8 py-4 font-semibold text-center">
                Our Farmers
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-xl opacity-30 transition-opacity group-hover:opacity-50"></div>
              <div className="relative bg-white rounded-full p-8 shadow-lg">
                <img src={logo} alt="KrishiCart Logo" className="w-64 h-64 object-contain" />
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-md shadow-lg">
                Trusted by 10K+ families
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple reasons to buy from KrishiCart</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-transform hover:-translate-y-1">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center ${feature.bgColor} text-white font-bold text-3xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Fresh Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">Best quality products from our farmers</p>
            <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
              See All Products <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find products by category</p>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  to={`/products?category=${category._id}`}
                  key={category._id}
                  className="block bg-white rounded-xl text-center p-6 shadow hover:shadow-lg transition"
                >
                  <div className="mb-4 text-blue-600 rounded-full bg-blue-100 w-12 h-12 mx-auto flex items-center justify-center text-xl">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No categories found</p>
          )}
        </div>
      </section>

      {/* Farmers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Farmers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the farmers who grow fresh food for you
            </p>
            <Link to="/farmers" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
              See All Farmers <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          {farmers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {farmers.slice(0, 3).map((farmer) => (
                <FarmerCard key={farmer._id} farmer={farmer} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No farmers found</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {!isAuthenticated ? (
            <>
              <h2 className="text-4xl font-bold mb-6">Start Shopping Today</h2>
              <p className="text-lg mb-8">
                Join KrishiCart now and enjoy fresh farm products delivered to your home.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/register" className="bg-white text-blue-600 font-semibold rounded px-6 py-3 hover:bg-gray-100">
                  Join Now
                </Link>
                <Link to="/about" className="border-2 border-white rounded px-6 py-3 hover:bg-white hover:text-blue-600">
                  Learn More
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-6">Welcome back, {user?.name}!</h2>
              <p className="text-lg mb-8">
                Ready to explore products or manage your profile?
              </p>
              <div className="flex justify-center gap-4">
                {user?.role === "farmer" ? (
                  <Link to="/farmer/dashboard" className="bg-white text-blue-600 font-semibold rounded px-6 py-3 hover:bg-gray-100">
                    Farmer Dashboard
                  </Link>
                ) : (
                  <Link to="/products" className="bg-white text-blue-600 font-semibold rounded px-6 py-3 hover:bg-gray-100">
                    Shop Now
                  </Link>
                )}
                <Link to="/profile" className="border-2 border-white rounded px-6 py-3 hover:bg-white hover:text-blue-600">
                  My Profile
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Chat components */}
      {!chatOpen && <ChatToggleButton onClick={() => setChatOpen(true)} />}
      <AssistantChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default HomePage;
