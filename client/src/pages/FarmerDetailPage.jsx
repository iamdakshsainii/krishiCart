/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  clearFarmerProfile,
} from "../redux/slices/farmerSlice";
import { getProducts } from "../redux/slices/productSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaComment,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaEdit,
  FaCamera,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaCertificate,
  FaTractor,
  FaUsers,
  FaAward,
  FaChevronDown,
  FaChevronUp,
  FaThumbsUp,
  FaFlag,
  FaPaperPlane,
  FaWhatsapp,
  FaTimes,
  FaPlus,
  FaSave,
  FaUpload,
} from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [expandedReview, setExpandedReview] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Edit profile states
  const [profileData, setProfileData] = useState({
    farmName: "",
    description: "",
    establishedYear: "",
    phone: "",
    email: "",
    farmingPractices: [],
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    businessHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });

  // Photo upload states
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);

  // Redux states
  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Mock data for demonstration
  const [farmerStats] = useState({
    totalProducts: 42,
    yearsExperience: 15,
    happyCustomers: 234,
    avgRating: 4.7,
    totalReviews: 89,
  });

  const [reviews] = useState([
    {
      id: 1,
      user: "Rahul Sharma",
      avatar: null,
      rating: 5,
      comment: "Excellent quality organic vegetables! Fresh and delivered on time. Highly recommend this farmer.",
      date: "2024-01-15",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      user: "Priya Patel",
      avatar: null,
      rating: 4,
      comment: "Good quality products. The tomatoes were especially fresh and tasty.",
      date: "2024-01-10",
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      user: "Amit Kumar",
      avatar: null,
      rating: 5,
      comment: "Amazing experience! The farmer is very knowledgeable about organic farming practices.",
      date: "2024-01-05",
      helpful: 15,
      verified: false,
    },
  ]);

  const [certifications] = useState([
    { name: "Organic Certified", authority: "NPOP", year: 2023 },
    { name: "Fair Trade", authority: "FLO", year: 2022 },
    { name: "GAP Certified", authority: "APEDA", year: 2024 },
  ]);

  useEffect(() => {
    dispatch(getFarmerProfile(id));
    dispatch(getProducts({ farmer: id }));

    return () => {
      dispatch(clearFarmerProfile());
    };
  }, [dispatch, id]);

  // Initialize profile data when farmer profile loads
  useEffect(() => {
    if (farmerProfile) {
      const { farmer, profile } = farmerProfile;
      setProfileData({
        farmName: profile?.farmName || farmer.name || "",
        description: profile?.description || "",
        establishedYear: profile?.establishedYear || "",
        phone: farmer.phone || "",
        email: farmer.email || "",
        farmingPractices: profile?.farmingPractices || [],
        socialMedia: {
          facebook: profile?.socialMedia?.facebook || "",
          instagram: profile?.socialMedia?.instagram || "",
          twitter: profile?.socialMedia?.twitter || "",
        },
        businessHours: profile?.businessHours || {
          monday: { open: "", close: "" },
          tuesday: { open: "", close: "" },
          wednesday: { open: "", close: "" },
          thursday: { open: "", close: "" },
          friday: { open: "", close: "" },
          saturday: { open: "", close: "" },
          sunday: { open: "", close: "" },
        },
      });
    }
  }, [farmerProfile]);

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
        receiver: id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Handle review submission
    console.log("Review submitted:", review);
    setShowReviewForm(false);
    setReview({ rating: 5, comment: "" });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${farmerProfile?.farmer?.name}'s Profile`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  // Photo upload handlers
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile update handler
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // Here you would typically dispatch an action to update the profile
    console.log("Profile data to update:", profileData);
    console.log("Profile photo:", profilePhoto);
    console.log("Cover photo:", coverPhoto);

    // For now, just close the modal and show success message
    setShowEditProfile(false);
    alert("Profile updated successfully!");
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setProfileData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleBusinessHoursChange = (day, type, value) => {
    setProfileData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [type]: value
        }
      }
    }));
  };

  const handleFarmingPracticeToggle = (practice) => {
    setProfileData(prev => ({
      ...prev,
      farmingPractices: prev.farmingPractices.includes(practice)
        ? prev.farmingPractices.filter(p => p !== practice)
        : [...prev.farmingPractices, practice]
    }));
  };

  const renderStars = (rating, size = "text-sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={`text-yellow-400 ${size}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={`text-yellow-400 ${size}`} />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`text-gray-300 ${size}`} />);
    }

    return stars;
  };

  if (loading || productsLoading) {
    return <Loader />;
  }

  if (!farmerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-blue-500 mb-4">
              <FaLeaf className="text-6xl mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Farmer Not Found</h2>
            <p className="text-gray-600 mb-6">The farmer profile you're looking for doesn't exist.</p>
            <Link
              to="/farmers"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Farmers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { farmer, profile } = farmerProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/farmers"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Farmers
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            {coverPhotoPreview && (
              <img
                src={coverPhotoPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            {user?._id === farmer._id && (
              <div className="absolute top-4 right-4">
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  onChange={handleCoverPhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="cover-upload"
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-30 transition-all cursor-pointer inline-flex items-center"
                >
                  <FaCamera className="text-lg" />
                </label>
              </div>
            )}
          </div>

          <div className="relative px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex flex-col md:flex-row md:items-end -mt-16 relative">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt={farmer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : farmer.avatar ? (
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaLeaf className="text-white text-3xl" />
                    )}
                  </div>
                </div>
                {user?._id === farmer._id && (
                  <div className="absolute bottom-2 right-2">
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors cursor-pointer inline-flex items-center"
                    >
                      <FaCamera className="text-sm" />
                    </label>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {profileData.farmName || farmer.name}
                    </h1>
                    <div className="flex items-center mb-3">
                      {renderStars(farmerStats.avgRating, "text-lg")}
                      <span className="ml-2 text-gray-600 font-medium">
                        {farmerStats.avgRating} ({farmerStats.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center text-gray-600 gap-4">
                      {farmer.address && (
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-blue-500 mr-2" />
                          <span>{farmer.address.city}, {farmer.address.state}</span>
                        </div>
                      )}
                      {profileData.establishedYear && (
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <span>Est. {profileData.establishedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 rounded-full transition-colors ${
                        isFavorite
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    >
                      <FaShare />
                    </button>
                    {user?._id === farmer._id ? (
                      <button
                        onClick={() => setShowEditProfile(true)}
                        className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
                      >
                        <FaEdit className="mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowContactModal(true)}
                        className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
                      >
                        <FaComment className="mr-2" />
                        Contact
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{farmerStats.totalProducts}</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{farmerStats.yearsExperience}</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{farmerStats.happyCustomers}</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">{farmerStats.avgRating}★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-8">
              {[
                { key: "overview", label: "Overview" },
                { key: "products", label: `Products (${products.length})` },
                { key: "reviews", label: `Reviews (${farmerStats.totalReviews})` },
                { key: "about", label: "About" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Description */}
                {profileData.description && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About the Farm</h3>
                    <p className="text-gray-700 leading-relaxed">{profileData.description}</p>
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaCertificate className="text-blue-500 mr-2" />
                      Certifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {certifications.map((cert, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <FaAward className="text-blue-500 text-xl" />
                            <span className="text-sm text-blue-600 font-medium">{cert.year}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.authority}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Farming Practices */}
                {profileData.farmingPractices && profileData.farmingPractices.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaTractor className="text-green-500 mr-2" />
                      Farming Practices
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profileData.farmingPractices.map((practice, index) => (
                        <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <FaLeaf className="text-green-500 mr-3" />
                          <span className="text-gray-700">{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FaLeaf className="text-blue-500 text-6xl mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                      No Products Available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This farmer doesn't have any products listed at the moment.
                    </p>
                    {user?._id === farmer._id && (
                      <button className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <FaPlus className="mr-2" />
                        Add Product
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-600 mb-2">{farmerStats.avgRating}</div>
                      <div className="flex justify-center mb-2">{renderStars(farmerStats.avgRating, "text-lg")}</div>
                      <div className="text-sm text-gray-600">{farmerStats.totalReviews} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = Math.floor(Math.random() * 30) + 5;
                        const percentage = (count / farmerStats.totalReviews) * 100;
                        return (
                          <div key={star} className="flex items-center mb-2">
                            <span className="text-sm w-3">{star}</span>
                            <FaStar className="text-yellow-400 text-sm mx-2" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Add Review Button */}
                {isAuthenticated && user?._id !== farmer._id && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaStar className="mr-2" />
                      Write a Review
                    </button>
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="text-lg font-semibold mb-4">Write Your Review</h4>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReview({ ...review, rating: star })}
                              className={`text-2xl ${
                                star <= review.rating ? "text-yellow-400" : "text-gray-300"
                              } hover:text-yellow-400 transition-colors`}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                        <textarea
                          value={review.comment}
                          onChange={(e) => setReview({ ...review, comment: e.target.value })}
                          rows="4"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Share your experience..."
                          required
                        ></textarea>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Submit Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((reviewItem) => (
                    <div key={reviewItem.id} className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FaUsers className="text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h5 className="font-medium text-gray-800">{reviewItem.user}</h5>
                              {reviewItem.verified && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              {renderStars(reviewItem.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(reviewItem.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{reviewItem.comment}</p>
                      <div className="flex items-center justify-between">
                        <button className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                          <FaThumbsUp className="mr-1" />
                          Helpful ({reviewItem.helpful})
                        </button>
                        <button className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                          <FaFlag className="mr-1 inline" />
                          Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <FaEnvelope className="text-blue-500 mr-3" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-gray-600">{profileData.email}</div>
                      </div>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <FaPhone className="text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-gray-600">{profileData.phone}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Hours */}
                {profileData.businessHours && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <div className="space-y-3">
                        {Object.entries(profileData.businessHours).map(
                          ([day, hours]) => (
                            <div key={day} className="flex justify-between items-center">
                              <span className="capitalize font-medium">{day}</span>
                              <span className="text-gray-600">
                                {hours.open && hours.close ? `${hours.open} - ${hours.close}` : "Closed"}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                {(profileData.socialMedia?.facebook || profileData.socialMedia?.instagram || profileData.socialMedia?.twitter) && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                    <div className="flex space-x-4">
                      {profileData.socialMedia.facebook && (
                        <a
                          href={profileData.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FaFacebook className="text-xl" />
                        </a>
                      )}
                      {profileData.socialMedia.instagram && (
                        <a
                          href={profileData.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          <FaInstagram className="text-xl" />
                        </a>
                      )}
                      {profileData.socialMedia.twitter && (
                        <a
                          href={profileData.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                        >
                          <FaTwitter className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold mb-6">Contact {farmer.name}</h3>

            <div className="space-y-4">
              {/* Quick Contact Options */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${farmer.phone}`}
                  className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaPhone className="mr-2" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${farmer.phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="mr-2" />
                  WhatsApp
                </a>
              </div>

              {/* Message Form */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Send a Message</h4>
                {showMessageForm ? (
                  <form onSubmit={handleSendMessage}>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                      placeholder="Write your message here..."
                      rows="4"
                      required
                    ></textarea>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaPaperPlane className="mr-2" />
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMessageForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowMessageForm(true)}
                    className="w-full flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaComment className="mr-2" />
                    Write Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                {/* Photo Upload Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaCamera className="text-blue-500 mr-2" />
                    Profile Photos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cover Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Cover Photo</label>
                      <div className="relative">
                        <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg overflow-hidden">
                          {coverPhotoPreview && (
                            <img
                              src={coverPhotoPreview}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <input
                          type="file"
                          id="cover-edit"
                          accept="image/*"
                          onChange={handleCoverPhotoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="cover-edit"
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-lg cursor-pointer hover:bg-opacity-50 transition-all"
                        >
                          <div className="text-center">
                            <FaUpload className="text-2xl mb-2 mx-auto" />
                            <span className="text-sm">Upload Cover</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Profile Photo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                          {profilePhotoPreview ? (
                            <img
                              src={profilePhotoPreview}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaLeaf className="text-white text-3xl" />
                          )}
                        </div>
                        <input
                          type="file"
                          id="profile-edit"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="profile-edit"
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-full cursor-pointer hover:bg-opacity-50 transition-all"
                        >
                          <FaCamera className="text-xl" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaEdit className="text-blue-500 mr-2" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
                      <input
                        type="text"
                        value={profileData.farmName}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your farm name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                      <input
                        type="number"
                        value={profileData.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Year your farm was established"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell customers about your farm, your methods, and what makes you special..."
                    ></textarea>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaPhone className="text-blue-500 mr-2" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="farmer@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Farming Practices */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaTractor className="text-green-500 mr-2" />
                    Farming Practices
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Organic Farming', 'Sustainable Agriculture', 'Crop Rotation', 'Natural Pesticides', 'Water Conservation', 'Companion Planting'].map((practice) => (
                      <label key={practice} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={profileData.farmingPractices.includes(practice)}
                          onChange={() => handleFarmingPracticeToggle(practice)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                        />
                        <span className="text-gray-700 text-sm">{practice}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaShare className="text-blue-500 mr-2" />
                    Social Media
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaFacebook className="text-blue-600 text-xl mr-3" />
                      <input
                        type="url"
                        value={profileData.socialMedia.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://facebook.com/yourfarm"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaInstagram className="text-pink-600 text-xl mr-3" />
                      <input
                        type="url"
                        value={profileData.socialMedia.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://instagram.com/yourfarm"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaTwitter className="text-blue-400 text-xl mr-3" />
                      <input
                        type="url"
                        value={profileData.socialMedia.twitter}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://twitter.com/yourfarm"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    Business Hours
                  </h4>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between">
                        <div className="w-24">
                          <span className="capitalize font-medium text-gray-700">{day}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={profileData.businessHours[day]?.open || ''}
                            onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={profileData.businessHours[day]?.close || ''}
                            onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDetailPage;
