"use client";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  clearFarmerProfile,
} from "../redux/slices/farmConnectSlice";
import { getProducts } from "../redux/slices/productSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  FaSeedling,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaArrowLeft,
  FaComment,
  FaStar,
  FaLeaf,
  FaAward,
  FaHeart,
  FaShare,
} from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFarmerProfile(id));
    dispatch(getProducts({ farmer: id }));
    return () => {
      dispatch(clearFarmerProfile());
    };
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!message.trim()) return;
    dispatch(sendMessage({
      receiver: id,
      content: message,
    }));
    setMessage("");
    setShowMessageForm(false);
  };

  if (loading || productsLoading) return <Loader />;

  if (!farmerProfile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-red-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <FaSeedling className="text-red-600 text-6xl" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Farmer Not Found
          </h2>
          <p className="mb-8 text-gray-600">
            The farmer you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/farmers"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 shadow transition"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Farmers
          </Link>
        </div>
      </div>
    );

  const { farmer, profile } = farmerProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-20">

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <Link
          to="/farmers"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors duration-300 mb-6"
        >
          <div className="bg-blue-100 p-2 rounded-xl mr-3">
            <FaArrowLeft />
          </div>
          Back to Farmers
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto bg-white/80 backdrop-blur-lg border border-blue-100 rounded-3xl shadow-lg overflow-hidden px-8 py-6 max-w-7xl">
        <div className="relative h-48 rounded-t-3xl bg-gradient-to-r from-blue-600 to-blue-800 mb-24">
          <div className="absolute inset-0">
            <div className="absolute top-8 left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-8 right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center -mt-36 gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="rounded-3xl bg-gradient-to-r from-blue-500 to-blue-700 border-4 border-white shadow-xl w-44 h-44 flex items-center justify-center">
              <FaSeedling className="text-white text-8xl" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 border-4 border-white shadow-lg flex items-center justify-center">
              <FaAward className="text-white text-lg" />
            </div>
          </div>

          {/* Name and Info */}
          <div className="flex-grow">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
              {profile?.farmName || farmer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-700 mb-8">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="font-medium">4.9 (127 reviews)</span>
              </div>
              <div className="bg-blue-100 rounded-full px-4 py-1 text-blue-700 font-semibold">
                Verified
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-blue-700 text-base font-medium">
              {farmer.address && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  <span>
                    {farmer.address.city}, {farmer.address.state}
                  </span>
                </div>
              )}
              {profile?.establishedYear && (
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  <span>Since {profile.establishedYear}</span>
                </div>
              )}
            </div>
            <div className="mt-10 flex flex-wrap gap-5">
              <button className="flex items-center gap-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-6 py-3 font-bold shadow-lg transition-transform hover:scale-105">
                <FaHeart /> Follow
              </button>
              <button className="flex items-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl px-6 py-3 font-semibold shadow-inner transition-transform hover:scale-105">
                <FaShare /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Static Navigation Tabs */}
      <nav className="bg-white border-y border-blue-100 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6">
          <ul className="flex gap-8 text-blue-700 text-lg font-semibold overflow-x-auto no-scrollbar py-3">
            {[
              { id: "products", label: "Products", Icon: FaLeaf },
              { id: "reviews", label: "Reviews", Icon: FaStar },
              { id: "contact", label: "Contact", Icon: FaComment },
            ].map(({ id, label, Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 transition ${
                    activeTab === id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-blue-100"
                  }`}
                  aria-pressed={activeTab === id}
                >
                  <Icon />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {activeTab === "products" && (
          <>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center max-w-3xl mx-auto">
              Available Products
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                  <FaLeaf className="text-white text-7xl" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-700">
                  No Products Available
                </h3>
                <p className="mb-8 text-gray-600">
                  This farmer currently has no products listed.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "reviews" && (
          <>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center max-w-3xl mx-auto">
              Customer Reviews
            </h2>
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400 text-2xl">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="font-extrabold text-2xl">4.9</span>
                <span className="text-gray-700">based on 127 reviews</span>
              </div>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  rating: 5,
                  date: "2 weeks ago",
                  comment: "Amazing fresh vegetables! The quality is outstanding.",
                },
                {
                  name: "Mike Chen",
                  rating: 5,
                  date: "1 month ago",
                  comment: "Best tomatoes ever!",
                },
                {
                  name: "Emma Wilson",
                  rating: 4,
                  date: "1 month ago",
                  comment: "Great products and services.",
                },
              ].map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
                >
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
                        {review.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {review.name}
                        </h4>
                        <p className="text-gray-600">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "contact" && (
          <>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center max-w-3xl mx-auto">
              Contact the Farmer
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              {isAuthenticated && user?.role !== "farmer" ? (
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
                  {showMessageForm ? (
                    <form
                      onSubmit={handleSendMessage}
                      className="space-y-6"
                      aria-label="Send Message Form"
                    >
                      <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                      <textarea
                        rows={6}
                        className="w-full p-4 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-bold shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                        >
                          Send Message
                        </button>
                        <button
                          type="button"
                          className="flex-1 border border-gray-300 rounded-xl py-3 font-semibold hover:bg-gray-100"
                          onClick={() => setShowMessageForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => setShowMessageForm(true)}
                        className="inline-flex items-center gap-4 bg-blue-50 text-blue-700 rounded-xl px-6 py-4 font-semibold shadow-lg hover:bg-blue-100 transition"
                      >
                        <FaComment className="text-2xl" />
                        Message Farmer
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-600 p-8">
                  Please log in to contact the farmer.
                </div>
              )}

              <div className="space-y-6">
                {farmer.phone && (
                  <div className="flex items-center gap-6 bg-blue-50 rounded-xl p-6 shadow border border-blue-100">
                    <FaPhone className="text-blue-700 w-12 h-12" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-lg">Phone</h4>
                      <p className="text-blue-700">{farmer.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-6 bg-blue-50 rounded-xl p-6 shadow border border-blue-100">
                  <FaEnvelope className="text-blue-700 w-12 h-12" />
                  <div>
                    <h4 className="font-semibold text-blue-900 text-lg">Email</h4>
                    <p className="text-blue-700">{farmer.email}</p>
                  </div>
                </div>
                {farmer.address && (
                  <div className="flex items-center gap-6 bg-blue-50 rounded-xl p-6 shadow border border-blue-100">
                    <FaMapMarkerAlt className="text-blue-700 w-12 h-12" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-lg">Location</h4>
                      <p className="text-blue-700">
                        {farmer.address.city}, {farmer.address.state}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FarmerDetailPage;
