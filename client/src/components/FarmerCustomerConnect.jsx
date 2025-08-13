"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setActiveTab } from "../redux/slices/farmConnectSlice";
import CreatePostModal from "./CreatePostModal";
import CreateStoryModal from "./CreateStoryModal";
import PostCard from "./PostCard";
import StoryCard from "./StoryCards";
import {
  FaPlus,
  FaNewspaper,
  FaBook,
  FaLeaf,
  FaUsers,
  FaChartLine, // ✅ Replaced FaTrendingUp
  FaFilter,
  FaSearch
} from "react-icons/fa";

const FarmerCustomerConnect = () => {
  const dispatch = useDispatch();
  const { posts, stories, activeTab } = useSelector((state) => state.farmConnect);
  const { user } = useSelector((state) => state.auth);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [user, dispatch]);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const filteredPosts = posts.filter(
    (post) =>
      (post.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      (story.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    // ✅ fix: comparison, not assignment
    const matchesCategory =
      filterCategory === "All" || story.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const storyCategories = [
    "All",
    "Farming Tips",
    "Success Stories",
    "Organic Farming",
    "Career Change",
    "Women Empowerment",
    "Technology in Farming"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                  <FaLeaf className="text-green-600 mr-3" />
                  Farm Connect
                </h1>
                <p className="text-gray-600 mt-1">
                  Connect, Share, and Grow Together
                </p>
              </div>
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user?.role || "Visitor"}
                  </p>
                </div>
                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                  }
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                />
              </div>
            </div>
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => handleTabChange("posts")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "posts"
                      ? "bg-white text-green-600 shadow-md"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  <FaNewspaper className="w-4 h-4" />
                  <span>Community Posts</span>
                </button>
                <button
                  onClick={() => handleTabChange("stories")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === "stories"
                      ? "bg-white text-green-600 shadow-md"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  <FaBook className="w-4 h-4" />
                  <span>Farmer Stories</span>
                </button>
              </div>
              {/* Create Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
                {user?.role === "farmer" && (
                  <button
                    onClick={() => setShowCreateStory(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
                  >
                    <FaBook className="w-4 h-4" />
                    <span>Share Story</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === "posts" ? "Search posts..." : "Search stories..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white shadow-sm"
            />
          </div>
          {/* Category Filter (for stories) */}
          {activeTab === "stories" && (
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white shadow-sm appearance-none min-w-48"
              >
                {storyCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {posts.length + stories.length}
                </h3>
                <p className="text-gray-600">Total Posts & Stories</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaChartLine className="text-blue-600 text-xl" /> {/* ✅ fixed */}
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {posts.reduce((acc, post) => acc + (post.likes || 0), 0) +
                    stories.reduce((acc, story) => acc + (story.likes || 0), 0)}
                </h3>
                <p className="text-gray-600">Total Engagement</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FaLeaf className="text-emerald-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {[...posts, ...stories].filter(
                    (item) => item.author.type === "farmer"
                  ).length}
                </h3>
                <p className="text-gray-600">Farmer Contributions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Feed */}
        <div className="space-y-6">
          {activeTab === "posts"
            ? filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            : filteredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
      <CreateStoryModal
        isOpen={showCreateStory}
        onClose={() => setShowCreateStory(false)}
      />
    </div>
  );
};

export default FarmerCustomerConnect;
