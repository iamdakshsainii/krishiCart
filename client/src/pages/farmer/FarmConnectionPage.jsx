import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchStories,
  setActiveTab,
  setShowCreatePostModal,
  setShowCreateStoryModal
} from '../../redux/slices/farmConnectSlice';
import PostCard from '../../components/PostCard';
import StoryCard from '../../components/StoryCards';
import CreatePostModal from '../../components/CreatePostModal';
import CreateStoryModal from '../../components/CreateStoryModal';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const FarmConnectionPage = () => {
  const dispatch = useDispatch();
  const {
    posts,
    stories,
    activeTab,
    postsLoading,
    storiesLoading,
    error
  } = useSelector(state => state.farmConnect);

  useEffect(() => {
    const action = activeTab === 'posts' ? fetchPosts() : fetchStories();
    dispatch(action);

    return () => {
      // Cancel any pending requests if component unmounts
      // This requires axios cancel tokens in your thunks
    };
  }, [dispatch, activeTab]);

  const handleCreatePost = () => dispatch(setShowCreatePostModal(true));
  const handleCreateStory = () => dispatch(setShowCreateStoryModal(true));
  const handleTabChange = (tab) => dispatch(setActiveTab(tab));

  const renderedPosts = useMemo(() =>
    posts.map(post => (
      <PostCard
        key={`post-${post._id}`}
        post={post}
        className="mb-6"
      />
    )),
    [posts]
  );

  const renderedStories = useMemo(() =>
    stories.map(story => (
      <StoryCard
        key={`story-${story._id}`}
        story={story}
        className="h-full"
      />
    )),
    [stories]
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Farm Connect</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCreatePost}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            aria-label="Create new post"
          >
            <span>+</span> Create Post
          </button>
          <button
            onClick={handleCreateStory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            aria-label="Create new story"
          >
            <span>+</span> Create Story
          </button>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'posts'
            ? 'border-b-2 border-green-600 text-green-600'
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('posts')}
        >
          Community Posts
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'stories'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('stories')}
        >
          Farmer Stories
        </button>
      </div>

      {postsLoading || storiesLoading ? (
        <Loader className="min-h-[300px]" />
      ) : activeTab === 'posts' ? (
        <div className="space-y-6">
          {posts.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No Posts Yet"
              description="Be the first to share your farming experience"
              actionText="Create Post"
              onAction={handleCreatePost}
            />
          ) : renderedPosts}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.length === 0 ? (
            <div className="col-span-3">
              <EmptyState
                icon="📖"
                title="No Stories Yet"
                description="Share your farming journey with the community"
                actionText="Create Story"
                onAction={handleCreateStory}
              />
            </div>
          ) : renderedStories}
        </div>
      )}

      <CreatePostModal />
      <CreateStoryModal />
    </div>
  );
};

export default React.memo(FarmConnectionPage);
