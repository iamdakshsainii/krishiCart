"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import { updateFarmerProfile } from "../redux/slices/farmerSlice";
import Loader from "../components/Loader";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
  FaCheck,
  FaEdit,
  FaClock,
  FaTruck,
  FaHandsHelping,
} from "react-icons/fa";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const {
    myFarmerProfile,
    loading: farmerLoading,
    success: farmerSuccess,
  } = useSelector((state) => state.farmers);

  const [userForm, setUserForm] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [farmerForm, setFarmerForm] = useState({
    farmName: "",
    description: "",
    farmingPractices: [],
    establishedYear: "",
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
    acceptsPickup: false,
    acceptsDelivery: false,
    deliveryRadius: 0,
  });

  const [farmingPractice, setFarmingPractice] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "farmer" && myFarmerProfile) {
      setFarmerForm({
        farmName: myFarmerProfile.farmName || "",
        description: myFarmerProfile.description || "",
        farmingPractices: myFarmerProfile.farmingPractices || [],
        establishedYear: myFarmerProfile.establishedYear || "",
        socialMedia: {
          facebook: myFarmerProfile.socialMedia?.facebook || "",
          instagram: myFarmerProfile.socialMedia?.instagram || "",
          twitter: myFarmerProfile.socialMedia?.twitter || "",
        },
        businessHours: {
          monday: myFarmerProfile.businessHours?.monday || {
            open: "",
            close: "",
          },
          tuesday: myFarmerProfile.businessHours?.tuesday || {
            open: "",
            close: "",
          },
          wednesday: myFarmerProfile.businessHours?.wednesday || {
            open: "",
            close: "",
          },
          thursday: myFarmerProfile.businessHours?.thursday || {
            open: "",
            close: "",
          },
          friday: myFarmerProfile.businessHours?.friday || {
            open: "",
            close: "",
          },
          saturday: myFarmerProfile.businessHours?.saturday || {
            open: "",
            close: "",
          },
          sunday: myFarmerProfile.businessHours?.sunday || {
            open: "",
            close: "",
          },
        },
        acceptsPickup: myFarmerProfile.acceptsPickup || false,
        acceptsDelivery: myFarmerProfile.acceptsDelivery || false,
        deliveryRadius: myFarmerProfile.deliveryRadius || 0,
      });
    }
  }, [user, myFarmerProfile]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserForm({
        ...userForm,
        [parent]: {
          ...userForm[parent],
          [child]: value,
        },
      });
    } else {
      setUserForm({
        ...userForm,
        [name]: value,
      });
    }
  };

  const handleFarmerChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFarmerForm({
        ...farmerForm,
        [name]: checked,
      });
      return;
    }

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");

      if (grandchild) {
        setFarmerForm({
          ...farmerForm,
          [parent]: {
            ...farmerForm[parent],
            [child]: {
              ...farmerForm[parent][child],
              [grandchild]: value,
            },
          },
        });
      } else {
        setFarmerForm({
          ...farmerForm,
          [parent]: {
            ...farmerForm[parent],
            [child]: value,
          },
        });
      }
    } else {
      setFarmerForm({
        ...farmerForm,
        [name]: value,
      });
    }
  };

  const handleAddFarmingPractice = () => {
    if (farmingPractice.trim() !== "") {
      setFarmerForm({
        ...farmerForm,
        farmingPractices: [
          ...farmerForm.farmingPractices,
          farmingPractice.trim(),
        ],
      });
      setFarmingPractice("");
    }
  };

  const handleRemoveFarmingPractice = (index) => {
    setFarmerForm({
      ...farmerForm,
      farmingPractices: farmerForm.farmingPractices.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(userForm));
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    dispatch(updateFarmerProfile(farmerForm));
  };

  if (loading || farmerLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-16 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-blue-100 rounded-2xl rotate-12 opacity-25"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-full mb-8 border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm uppercase tracking-wider">Profile Settings</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                <span className="text-gray-900">My</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                  Profile
                </span>
              </h1>

              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-1">
                <button
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 ${
                    activeTab === "general"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  <FaUser className="text-sm" />
                  <span>General Information</span>
                </button>
                {user?.role === "farmer" && (
                  <button
                    className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 ${
                      activeTab === "farm"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                    }`}
                    onClick={() => setActiveTab("farm")}
                  >
                    <FaLeaf className="text-sm" />
                    <span>Farm Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {activeTab === "general" && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <FaEdit className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">General Information</h2>
                    <p className="text-gray-600">Update your basic account details</p>
                  </div>
                </div>

                <form onSubmit={handleUserSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={userForm.name}
                          onChange={handleUserChange}
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={user?.email}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={userForm.phone}
                          onChange={handleUserChange}
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3">
                        Account Type
                      </label>
                      <input
                        type="text"
                        id="role"
                        value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <FaMapMarkerAlt className="text-blue-600" />
                      Address Information
                    </h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address.street"
                          value={userForm.address.street}
                          onChange={handleUserChange}
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="address.city"
                          value={userForm.address.city}
                          onChange={handleUserChange}
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          name="address.state"
                          value={userForm.address.state}
                          onChange={handleUserChange}
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="State"
                        />
                      </div>

                      <input
                        type="text"
                        name="address.zipCode"
                        value={userForm.address.zipCode}
                        onChange={handleUserChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="ZIP / Postal code"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-3"
                      disabled={loading}
                    >
                      <FaCheck />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "farm" && user?.role === "farmer" && (
              <div className="space-y-8">
                {/* Farm Info Card */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <FaLeaf className="text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Farm Profile</h2>
                      <p className="text-gray-600">Manage your farm information and settings</p>
                    </div>
                  </div>

                  <form onSubmit={handleFarmerSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="farmName" className="block text-sm font-semibold text-gray-700 mb-3">
                          Farm Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLeaf className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="farmName"
                            name="farmName"
                            value={farmerForm.farmName}
                            onChange={handleFarmerChange}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="establishedYear" className="block text-sm font-semibold text-gray-700 mb-3">
                          Established Year
                        </label>
                        <input
                          type="number"
                          id="establishedYear"
                          name="establishedYear"
                          value={farmerForm.establishedYear}
                          onChange={handleFarmerChange}
                          className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                        Farm Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={farmerForm.description}
                        onChange={handleFarmerChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell customers about your farm..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Farming Practices
                      </label>
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={farmingPractice}
                          onChange={(e) => setFarmingPractice(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., Organic, No-till, Permaculture"
                        />
                        <button
                          type="button"
                          onClick={handleAddFarmingPractice}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {farmerForm.farmingPractices.map((practice, index) => (
                          <div
                            key={index}
                            className="bg-green-50 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 border border-green-200"
                          >
                            <span className="font-medium">{practice}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFarmingPractice(index)}
                              className="text-green-600 hover:text-green-800 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Media */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Social Media Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="facebook" className="block text-sm font-semibold text-gray-700 mb-2">
                            Facebook
                          </label>
                          <input
                            type="url"
                            id="facebook"
                            name="socialMedia.facebook"
                            value={farmerForm.socialMedia.facebook}
                            onChange={handleFarmerChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="https://facebook.com/yourfarm"
                          />
                        </div>
                        <div>
                          <label htmlFor="instagram" className="block text-sm font-semibold text-gray-700 mb-2">
                            Instagram
                          </label>
                          <input
                            type="url"
                            id="instagram"
                            name="socialMedia.instagram"
                            value={farmerForm.socialMedia.instagram}
                            onChange={handleFarmerChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="https://instagram.com/yourfarm"
                          />
                        </div>
                        <div>
                          <label htmlFor="twitter" className="block text-sm font-semibold text-gray-700 mb-2">
                            Twitter
                          </label>
                          <input
                            type="url"
                            id="twitter"
                            name="socialMedia.twitter"
                            value={farmerForm.socialMedia.twitter}
                            onChange={handleFarmerChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="https://twitter.com/yourfarm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FaClock className="text-blue-600" />
                        Business Hours
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(farmerForm.businessHours).map(([day, hours]) => (
                          <div key={day} className="grid grid-cols-3 gap-4 items-center">
                            <div className="capitalize font-medium text-gray-700">{day}</div>
                            <input
                              type="time"
                              name={`businessHours.${day}.open`}
                              value={hours.open}
                              onChange={handleFarmerChange}
                              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <input
                              type="time"
                              name={`businessHours.${day}.close`}
                              value={hours.close}
                              onChange={handleFarmerChange}
                              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Options */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FaTruck className="text-blue-600" />
                        Order Options
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <input
                            type="checkbox"
                            id="acceptsPickup"
                            name="acceptsPickup"
                            checked={farmerForm.acceptsPickup}
                            onChange={handleFarmerChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor="acceptsPickup" className="font-semibold text-gray-900">
                              Accept Pickup Orders
                            </label>
                            <p className="text-sm text-gray-600">Allow customers to pick up orders from your farm</p>
                          </div>
                          <FaHandsHelping className="text-blue-600 text-xl" />
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                          <input
                            type="checkbox"
                            id="acceptsDelivery"
                            name="acceptsDelivery"
                            checked={farmerForm.acceptsDelivery}
                            onChange={handleFarmerChange}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <label htmlFor="acceptsDelivery" className="font-semibold text-gray-900">
                              Offer Delivery Service
                            </label>
                            <p className="text-sm text-gray-600">Deliver orders directly to customers</p>
                          </div>
                          <FaTruck className="text-green-600 text-xl" />
                        </div>

                        {farmerForm.acceptsDelivery && (
                          <div className="ml-8">
                            <label htmlFor="deliveryRadius" className="block text-sm font-semibold text-gray-700 mb-2">
                              Delivery Radius (miles)
                            </label>
                            <input
                              type="number"
                              id="deliveryRadius"
                              name="deliveryRadius"
                              value={farmerForm.deliveryRadius}
                              onChange={handleFarmerChange}
                              className="w-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              min="0"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-3"
                        disabled={farmerLoading}
                      >
                        <FaCheck />
                        {farmerLoading ? "Saving..." : "Save Farm Profile"}
                      </button>

                      {farmerSuccess && (
                        <div className="flex items-center text-green-600 gap-3 bg-green-50 px-4 py-2 rounded-xl">
                          <FaCheck />
                          <span className="font-medium">Profile updated successfully!</span>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
