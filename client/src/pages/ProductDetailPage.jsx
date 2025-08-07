"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  clearProductDetails,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaComment,
  FaArrowLeft,
  FaCertificate,
  FaCalendarAlt,
} from "react-icons/fa";
import { placeholder } from "../assets";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems, farmerId } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProductDetails(id));

    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user.role === "farmer") {
      alert("Farmers cannot place orders. Please use a consumer account.");
      return;
    }

    if (farmerId && farmerId !== product.farmer._id && cartItems.length > 0) {
      if (
        !confirm(
          "Your cart contains items from a different farm. Would you like to clear your cart and add this item?"
        )
      ) {
        return;
      }
    }

    dispatch(addToCart({ product, quantity }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      return;
    }

    dispatch(
      sendMessage({
        receiver: product.farmer._id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-50 rounded-full opacity-40"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-blue-100 rounded-2xl rotate-45 opacity-30"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaArrowLeft className="text-sm" />
              </div>
              Back to Products
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[activeImage]}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={placeholder}
                      alt="placeholder"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {product.isOrganic && (
                    <div className="absolute top-6 left-6">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <FaCertificate className="text-xs" />
                        Organic
                      </div>
                    </div>
                  )}
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer rounded-2xl overflow-hidden aspect-square transition-all duration-200 ${
                          activeImage === index
                            ? "ring-3 ring-blue-500 ring-offset-2"
                            : "hover:ring-2 ring-gray-200 ring-offset-1"
                        }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={image || placeholder}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                      {product.category?.name || "General"}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                  </h1>

                  <div className="text-3xl font-bold text-blue-600 mb-6">
                    ₨{product.price.toFixed(2)}
                    <span className="text-lg font-normal text-gray-500 ml-2">
                      per {product.unit}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <FaLeaf className="text-green-600 text-sm" />
                      </div>
                      <span className="font-semibold text-gray-900">Available</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {product.quantityAvailable} {product.unit}
                    </div>
                  </div>

                  {product.harvestDate && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FaCalendarAlt className="text-blue-600 text-sm" />
                        </div>
                        <span className="font-semibold text-gray-900">Harvested</span>
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {new Date(product.harvestDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Farmer Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Meet the Farmer</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-800">{product.farmer?.name}</span>
                    </div>

                    {product.farmer?.address && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaMapMarkerAlt className="text-blue-600" />
                        </div>
                        <span className="text-gray-700">
                          {product.farmer.address.city}, {product.farmer.address.state}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/farmers/${product.farmer?._id}`}
                    className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Farm Profile
                  </Link>
                </div>

                {/* Add to Cart Section */}
                {user?.role !== "farmer" && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-1/3">
                        <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          max={product.quantityAvailable}
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="w-full sm:w-2/3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                        <button
                          onClick={handleAddToCart}
                          disabled={product.quantityAvailable === 0}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-3"
                        >
                          <FaShoppingCart />
                          <span>
                            {product.quantityAvailable === 0 ? "Out of Stock" : "Add to Cart"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Farmer */}
                {isAuthenticated && user?.role !== "farmer" && (
                  <div className="border-t border-gray-100 pt-6">
                    {showMessageForm ? (
                      <form onSubmit={handleSendMessage} className="space-y-4">
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                          Message to Farmer
                        </label>
                        <textarea
                          id="message"
                          rows="4"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                          placeholder="Ask a question about this product..."
                          required
                        />
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                          >
                            Send Message
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowMessageForm(false)}
                            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowMessageForm(true)}
                        className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                          <FaComment />
                        </div>
                        <span>Message Farmer</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
