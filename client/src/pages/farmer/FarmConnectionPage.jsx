import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchStories,
  setActiveTab,
  setShowCreatePostModal,
  setShowCreateStoryModal,
  clearError,
} from '../../redux/slices/farmConnectSlice';
import PostCard from '../../components/PostCard';
import StoryCard from '../../components/StoryCards';
import CreatePostModal from '../../components/CreatePostModal';
import CreateStoryModal from '../../components/CreateStoryModal';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { Plus, Users, BookOpen, Sprout, TrendingUp } from 'lucide-react';

const FarmConnectionPage = () => {
  const dispatch = useDispatch();
  const {
    posts,
    stories,
    activeTab,
    postsLoading,
    storiesLoading,
    error,
  } = useSelector((state) => state.farmConnect);
  const { user } = useSelector((state) => state.auth);

  // Deduplicate posts based on _id
  const uniquePosts = useMemo(() =>
    posts.filter((post, idx, arr) => arr.findIndex(p => p._id === post._id) === idx)
  , [posts]);

  // Deduplicate stories based on _id
  const uniqueStories = useMemo(() =>
    stories.filter((story, idx, arr) => arr.findIndex(s => s._id === story._id) === idx)
  , [stories]);

  useEffect(() => {
    const action = activeTab === 'posts' ? fetchPosts() : fetchStories();
    dispatch(action);
    return () => {
      // Optionally cancel pending requests here if implemented
    };
  }, [dispatch, activeTab]);

  const handleCreatePost = () => dispatch(setShowCreatePostModal(true));
  const handleCreateStory = () => dispatch(setShowCreateStoryModal(true));
  const handleTabChange = (tab) => dispatch(setActiveTab(tab));

  const renderedPosts = useMemo(() =>
    uniquePosts.map((post) => (
      <PostCard
        key={`post-${post._id}`}
        post={post}
        className="mb-6 transform hover:scale-[1.01] transition-all duration-200 hover:shadow-lg"
      />
    )),
    [uniquePosts]
  );

  const renderedStories = useMemo(() =>
    uniqueStories.map((story) => (
      <StoryCard
        key={`story-${story._id}`}
        story={story}
        className="h-full transform hover:scale-[1.02] transition-all duration-200 hover:shadow-xl"
      />
    )),
    [uniqueStories]
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="relative bg-white rounded-3xl shadow-xl mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-5"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            ></div>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Farm Connect
                </h1>
                <p className="text-gray-600 mt-1">Connect, Share, and Grow Together</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCreatePost}
                className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                aria-label="Create new post"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Create Post</span>
              </button>
              <button
                onClick={handleCreateStory}
                className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                aria-label="Create new story"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Create Story</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{uniquePosts.length}</h3>
                <p className="text-gray-600 text-sm">Community Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{uniqueStories.length}</h3>
                <p className="text-gray-600 text-sm">Farmer Stories</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{uniquePosts.length + uniqueStories.length}</h3>
                <p className="text-gray-600 text-sm">Total Content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex relative">
            <button
              className={`relative flex-1 px-8 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
              onClick={() => handleTabChange('posts')}
            >
              <Users className="w-5 h-5" />
              <span>Community Posts</span>
              {activeTab === 'posts' && uniquePosts.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                  {uniquePosts.length}
                </span>
              )}
            </button>
            <button
              className={`relative flex-1 px-8 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'stories'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => handleTabChange('stories')}
            >
              <BookOpen className="w-5 h-5" />
              <span>Farmer Stories</span>
              {activeTab === 'stories' && uniqueStories.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                  {uniqueStories.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative">
          {postsLoading || storiesLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <Loader className="min-h-[300px]" />
            </div>
          ) : activeTab === 'posts' ? (
            <div className="space-y-6">
              {uniquePosts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12">
                  <EmptyState
                    icon="📝"
                    title="No Posts Yet"
                    description="Be the first to share your farming experience with the community"
                    actionText="Create Your First Post"
                    onAction={handleCreatePost}
                  />
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {renderedPosts}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueStories.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl shadow-lg p-12">
                  <EmptyState
                    icon="📖"
                    title="No Stories Yet"
                    description="Share your farming journey and inspire others in the community"
                    actionText="Share Your Story"
                    onAction={handleCreateStory}
                  />
                </div>
              ) : (
                <div className="col-span-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {renderedStories}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Buttons for Mobile */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden">
          <button
            onClick={handleCreateStory}
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
            aria-label="Create story"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            onClick={handleCreatePost}
            className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110"
            aria-label="Create post"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
      <CreatePostModal />
      <CreateStoryModal />
    </div>
  );
};

export default React.memo(FarmConnectionPage);
