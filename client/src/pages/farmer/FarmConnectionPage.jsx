// src/pages/farmer/FarmConnectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentUser,
  setActiveTab,
  fetchPosts,
  fetchStories,
  likePost,
  addComment
} from '../../redux/slices/farmConnectSlice';
import CreatePostModal from '../../pages/farmer/CreatePostModal';
import CreateStoryModal from '../../pages/farmer/CreateStoryModal';
import PostCard from '../../pages/farmer/PostCard';
import StoryCard from '../../pages/farmer/StoryCards';
import { usePermissions } from '../../components/PrivateRoute';
import {
  FaPlus,
  FaNewspaper,
  FaBook,
  FaLeaf,
  FaUsers,
  FaChartLine, // ✅ replaced invalid FaTrendingUp
  FaFilter,
  FaSearch,
  FaLock,
  FaEye,
  FaUserPlus
} from 'react-icons/fa';

const FarmConnectionPage = () => {
  const dispatch = useDispatch();
  const { posts = [], stories = [], activeTab = 'posts'} =
    useSelector(state => state.farmConnect || {});
  const {
    isAuthenticated,
    user,
    canAccessFarmConnect,
    canCreateContent,
    canInteractWithContent
  } = usePermissions();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    if (isAuthenticated && canAccessFarmConnect()) {
      dispatch(setCurrentUser(user));
      dispatch(fetchPosts());
      dispatch(fetchStories());
    }
  }, [user, isAuthenticated, dispatch, canAccessFarmConnect]);

  // 🚫 Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to join our farming community.
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="w-full bg-green-500 text-white py-3 rounded-xl mb-3 hover:bg-green-600"
          >
            Login
          </button>
          <button
            onClick={() => (window.location.href = '/register')}
            className="w-full border border-green-500 text-green-600 py-3 rounded-xl hover:bg-green-50"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // 🚫 Authenticated but not allowed
  if (!canAccessFarmConnect()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Only farmers and customers can access Farm Connect.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleTabChange = tab => dispatch(setActiveTab(tab));
  const handleLikePost = postId => {
    if (canInteractWithContent()) dispatch(likePost(postId));
  };
  const handleAddComment = (postId, content) => {
    if (canInteractWithContent()) dispatch(addComment({ postId, content }));
  };

  const filteredPosts = posts.filter(
    post =>
      (post.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStories = stories.filter(story => {
    const matchesSearch =
      (story.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'All' || story.category === filterCategory; // ✅ fixed comparison
    return matchesSearch && matchesCategory;
  });

  const storyCategories = [
    'All',
    'Farming Tips',
    'Success Stories',
    'Organic Farming',
    'Career Change',
    'Women Empowerment',
    'Technology in Farming'
  ];

  const totalPosts = posts.length + stories.length;
  const totalEngagement =
    posts.reduce(
      (acc, post) =>
        acc + (Array.isArray(post.likes) ? post.likes.length : post.likes || 0),
      0
    ) +
    stories.reduce(
      (acc, story) =>
        acc + (Array.isArray(story.likes) ? story.likes.length : story.likes || 0),
      0
    );
  const farmerContributions = [...posts, ...stories].filter(
    item => item.author?.role === 'farmer'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <FaLeaf className="text-green-600 mr-3" />
                Farm Connect
                {!canCreateContent() && (
                  <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center">
                    <FaEye className="mr-1" /> Viewer Mode
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {canCreateContent()
                  ? 'Connect, Share, and Grow Together'
                  : 'Explore and Learn from Our Farming Community'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => handleTabChange('posts')}
                className={`px-6 py-3 rounded-xl ${
                  activeTab === 'posts'
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-gray-600 hover:text-green-600'
                } flex items-center space-x-2`}
              >
                <FaNewspaper /> <span>Community Posts</span>
              </button>
              <button
                onClick={() => handleTabChange('stories')}
                className={`px-6 py-3 rounded-xl ${
                  activeTab === 'stories'
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-gray-600 hover:text-green-600'
                } flex items-center space-x-2`}
              >
                <FaBook /> <span>Farmer Stories</span>
              </button>
            </div>

            {canCreateContent() && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center space-x-2"
                >
                  <FaPlus /> <span>Create Post</span>
                </button>
                <button
                  onClick={() => setShowCreateStory(true)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 flex items-center space-x-2"
                >
                  <FaBook /> <span>Share Story</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'posts' ? 'Search posts...' : 'Search stories...'
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
          />
        </div>
        {activeTab === 'stories' && (
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl"
            >
              {storyCategories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <div className="p-3 bg-green-100 rounded-xl">
            <FaUsers className="text-green-600 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold">{totalPosts}</h3>
            <p>Total Posts & Stories</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FaChartLine className="text-blue-600 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold">{totalEngagement}</h3>
            <p>Total Engagement</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex items-center">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <FaLeaf className="text-emerald-600 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold">{farmerContributions}</h3>
            <p>Farmer Contributions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {activeTab === 'posts'
          ? filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLikePost}
                onComment={handleAddComment}
                canInteract={canInteractWithContent()}
              />
            ))
          : filteredStories.map(story => (
              <StoryCard
                key={story.id}
                story={story}
                canInteract={canInteractWithContent()}
              />
            ))}
      </div>

      {/* Modals */}
      {canCreateContent() && showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
        />
      )}
      {canCreateContent() && showCreateStory && (
        <CreateStoryModal
          isOpen={showCreateStory}
          onClose={() => setShowCreateStory(false)}
        />
      )}
    </div>
  );
};

export default FarmConnectionPage;
