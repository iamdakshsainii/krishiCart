/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStories,
  setShowCreateStoryModal,
  likeStory,
  clearError,
  invalidateStoriesCache,
  setStoriesFilter
} from '../redux/slices/farmConnectSlice';
import CreateStoryModal from './CreateStoryModal';
import StoryCard from './StoryCard';
import { toast } from 'react-toastify';
import { FaBookOpen, FaPlus, FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const StoriesFeed = () => {
  const dispatch = useDispatch();
  const {
    stories,
    storiesLoading,
    error,
    showCreateStoryModal,
    pagination,
    filters,
    isOnline
  } = useSelector((state) => state.farmConnect);

  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredStories, setFilteredStories] = useState([]);

  const storyCategories = [
    'Success Stories',
    'Farming Tips',
    'Organic Farming',
    'Career Change',
    'Women Empowerment',
    'Technology in Farming',
    'Sustainable Practices',
    'Community Impact',
    'Innovation',
    'Challenges Overcome',
    'Market Insights',
    'Weather & Climate',
    'Crop Management',
    'Livestock Care'
  ];

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchStories({ page: 1, refresh: true }));
  }, [dispatch]);

  // Filter stories based on search and category
  useEffect(() => {
    let filtered = [...stories];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(story =>
        story.title?.toLowerCase().includes(query) ||
        story.content?.toLowerCase().includes(query) ||
        story.excerpt?.toLowerCase().includes(query) ||
        story.user?.name?.toLowerCase().includes(query) ||
        story.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(story => story.category === selectedCategory);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredStories(filtered);
  }, [stories, searchQuery, selectedCategory]);

  // Handle create story button click
  const handleCreateStory = () => {
    if (!user || user.role !== 'farmer') {
      toast.error('Only farmers can create stories');
      return;
    }
    dispatch(setShowCreateStoryModal(true));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(invalidateStoriesCache());
    dispatch(fetchStories({ page: 1, refresh: true }));
  };

  // Load more stories
  const loadMoreStories = () => {
    if (pagination.stories.hasMore && !storiesLoading) {
      dispatch(fetchStories({
        page: pagination.stories.page + 1
      }));
    }
  };

  // Handle story like
  const handleLikeStory = (storyId) => {
    dispatch(likeStory(storyId));
  };

  // Handle story click (could navigate to full view)
  const handleStoryClick = (story) => {
    // You can implement navigation to full story view here
    console.log('Navigate to story:', story._id);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategory('');
  };

  // Render loading state
  if (storiesLoading && stories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-gray-600">Loading stories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <FaBookOpen className="text-purple-600 mr-3 text-2xl" />
              <h1 className="text-3xl font-bold text-gray-800">Farm Stories</h1>
            </div>
            <p className="text-gray-600">Discover inspiring stories from farmers around the world</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Online Status */}
            <div className={`flex items-center px-3 py-2 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {isOnline ? 'Online' : 'Offline'}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showFilters || selectedCategory || searchQuery
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter className="mr-2" />
              Filters
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={storiesLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              🔄 Refresh
            </button>

            {/* Create Story Button */}
            {user?.role === 'farmer' && (
              <button
                onClick={handleCreateStory}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Share Your Story
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories, authors, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {storyCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {selectedCategory && (
                  <button
                    onClick={clearCategoryFilter}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
                    Search: "{searchQuery}"
                    <button onClick={clearSearch} className="ml-1 hover:text-purple-900">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                    Category: {selectedCategory}
                    <button onClick={clearCategoryFilter} className="ml-1 hover:text-blue-900">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-700 hover:text-red-900"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Stories Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredStories.length} of {stories.length} stories
        </p>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchQuery || selectedCategory ? 'No matching stories found' : 'No stories yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCategory
              ? 'Try adjusting your search or filters'
              : user?.role === 'farmer'
                ? "Be the first to share your farming story with the community!"
                : "Farmers haven't shared their stories yet. Check back later!"
            }
          </p>
          {user?.role === 'farmer' && !searchQuery && !selectedCategory && (
            <button
              onClick={handleCreateStory}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Share Your First Story
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                isOptimistic={story.isTemporary}
                onLike={() => handleLikeStory(story._id)}
                onClick={handleStoryClick}
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.stories.hasMore && !searchQuery && !selectedCategory && (
            <div className="text-center py-8">
              <button
                onClick={loadMoreStories}
                disabled={storiesLoading}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {storiesLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading More...
                  </span>
                ) : (
                  'Load More Stories'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Story Modal */}
      <CreateStoryModal />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
              <span>You're offline. Stories will be synced when connection is restored.</span>
            </div>
            <button className="text-yellow-700 hover:text-yellow-900">
              ℹ️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesFeed;
