import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchStories,
  setActiveTab,
  setShowCreatePostModal,
  setShowCreateStoryModal
} from '../../redux/slices/farmConnectSlice';
import PostCard from '../../components/PostCard';
import CreatePostModal from '../../components/CreatePostModal';
import Loader from '../../components/Loader';

const FarmConnectionPage = () => {
  const dispatch = useDispatch();
  const {
    posts,
    stories,
    activeTab,
    postsLoading,
    storiesLoading,
    showCreatePostModal,
    showCreateStoryModal
  } = useSelector(state => state.farmConnect);

  useEffect(() => {
    if (activeTab === 'posts') {
      dispatch(fetchPosts());
    } else {
      dispatch(fetchStories());
    }
  }, [dispatch, activeTab]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Farm Connect</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => dispatch(setShowCreatePostModal(true))}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Create Post
          </button>
          <button
            onClick={() => dispatch(setShowCreateStoryModal(true))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Story
          </button>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'posts' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
          onClick={() => dispatch(setActiveTab('posts'))}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'stories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => dispatch(setActiveTab('stories'))}
        >
          Stories
        </button>
      </div>

      {postsLoading || storiesLoading ? (
        <Loader />
      ) : activeTab === 'posts' ? (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet. Be the first to share your farming journey!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id || post.id} post={post} />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {stories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No stories yet. Share your daily farming moments!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stories.map(story => (
                <div key={story._id || story.id} className="relative">
                  <img
                    src={story.image}
                    alt="Story"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg">
                    <p className="text-white text-sm line-clamp-2">{story.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <CreatePostModal />
      {/* Add CreateStoryModal component here when ready */}
    </div>
  );
};

export default FarmConnectionPage;
