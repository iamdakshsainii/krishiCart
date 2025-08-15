/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  setShowCreatePostModal,
  setActiveTab,
  likePost,
  addComment,
  invalidatePostsCache,
  clearError
} from '../redux/slices/farmConnectSlice';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';

const FarmConnectFeed = () => {
  const dispatch = useDispatch();
  const {
    posts,
    postsLoading,
    error,
    showCreatePostModal,
    activeTab,
    pagination,
    isOnline
  } = useSelector((state) => state.farmConnect);
  const { user } = useSelector((state) => state.auth);

  // Deduplicate posts based on _id before rendering
  const uniquePosts = posts.filter(
    (post, idx, arr) => arr.findIndex(p => p._id === post._id) === idx
  );

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, refresh: true }));
  }, [dispatch]);

  // Handle create post button click
  const handleCreatePost = () => {
    if (!user || user.role !== 'farmer') {
      alert('Only farmers can create posts'); // fallback alert if toast not configured
      return;
    }
    dispatch(setShowCreatePostModal(true));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(invalidatePostsCache());
    dispatch(fetchPosts({ page: 1, refresh: true }));
  };

  // Load more posts on demand
  const loadMorePosts = () => {
    if (pagination.posts.hasMore && !postsLoading) {
      dispatch(fetchPosts({
        page: pagination.posts.page + 1
      }));
    }
  };

  // Render loading state if no posts yet
  if (postsLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Farm Connect</h1>
            <p className="text-gray-600">Connect with fellow farmers</p>
          </div>
          <div className="flex gap-2">
            {/* Online Status */}
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {isOnline ? 'Online' : 'Offline'}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={postsLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              aria-label="Refresh posts"
            >
              🔄 Refresh
            </button>

            {/* Create Post Button */}
            {user?.role === 'farmer' && (
              <button
                onClick={handleCreatePost}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                aria-label="Create new post"
              >
                ✏️ Create Post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-700 hover:text-red-900 font-bold"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {uniquePosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">
              {user?.role === 'farmer'
                ? "Be the first to share something with the farming community!"
                : "Farmers haven't shared anything yet. Check back later!"}
            </p>
            {user?.role === 'farmer' && (
              <button
                onClick={handleCreatePost}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Post
              </button>
            )}
          </div>
        ) : (
          <>
            {uniquePosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isOptimistic={post.isTemporary}
                onLike={() => dispatch(likePost(post._id))}
                onComment={(content) => dispatch(addComment({ postId: post._id, content }))}
              />
            ))}

            {/* Load More Button */}
            {pagination.posts.hasMore && (
              <div className="text-center py-6">
                <button
                  onClick={loadMorePosts}
                  disabled={postsLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  aria-label="Load more posts"
                >
                  {postsLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && <CreatePostModal />}

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>You're offline. Posts will be synced when connection is restored.</span>
            </div>
            <button className="text-yellow-700 hover:text-yellow-900" aria-label="Information about offline status">
              ℹ️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmConnectFeed;
