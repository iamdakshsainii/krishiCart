// src/components/StoryCard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../redux/slices/farmConnectSlice';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaEye,
  FaClock,
  FaMapMarkerAlt,
  FaLeaf,
  FaUser,
  FaQuoteLeft,
  FaAward,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const StoryCard = ({ story, userRole, canInteract = true }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth || {});
  const isArrayLikes = Array.isArray(story.likes);
  const [isLiked, setIsLiked] = useState(story.userLiked || false);
  const [likesCount, setLikesCount] = useState(isArrayLikes ? story.likes.length : (story.likes || 0));
  const [showFullStory, setShowFullStory] = useState(false);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const storyTime = new Date(timestamp);
    const diffInHours = Math.floor((now - storyTime) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return storyTime.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!canInteract || !user) return;
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prev => prevLiked ? prev - 1 : prev + 1);
    try {
      await dispatch(likePost(story.id)).unwrap();
    } catch (error) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('Failed to like story:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Farming Tips': 'bg-green-100 text-green-800 border-green-200',
      'Success Stories': 'bg-blue-100 text-blue-800 border-blue-200',
      'Organic Farming': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Career Change': 'bg-purple-100 text-purple-800 border-purple-200',
      'Women Empowerment': 'bg-pink-100 text-pink-800 border-pink-200',
      'Technology in Farming': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer': return <FaLeaf className="text-green-500 text-sm" />;
      case 'customer': return <FaUser className="text-blue-500 text-sm" />;
      default: return <FaUser className="text-gray-500 text-sm" />;
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content) return '';
    return content.length <= maxLength ? content : content.slice(0, maxLength) + '...';
  };

  const displayContent = showFullStory
    ? (story.content || '')
    : truncateContent(story.content);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Story Header */}
      <div className="relative">
        {story.coverImage && (
          <div className="h-48 overflow-hidden">
            <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
          </div>
        )}
        {/* Category */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(story.category)}`}>
            {story.category}
          </span>
        </div>
        {/* Success Badge */}
        {story.category === 'Success Stories' && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full">
            <FaAward className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={story.author?.avatar || 'https://placehold.co/100x100'}
            alt={story.author?.name}
            className="w-12 h-12 rounded-full border-2 border-green-100"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold">{story.author?.name}</h4>
              {getRoleIcon(story.author?.role)}
              {story.author?.verified && (
                <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <FaClock className="w-3 h-3" /> {formatTimeAgo(story.createdAt)}
              </span>
              {story.location && (
                <span className="flex items-center space-x-1">
                  <FaMapMarkerAlt className="w-3 h-3" /> {story.location}
                </span>
              )}
              <span className="flex items-center space-x-1">
                <FaEye className="w-3 h-3" /> {story.readTime || '5'} min read
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{story.title}</h2>

        {/* Excerpt */}
        {story.excerpt && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
            <FaQuoteLeft className="text-green-500 mb-2" />
            <p className="italic">"{story.excerpt}"</p>
          </div>
        )}

        {/* Body */}
        <div className="mb-6">
          <p className="text-gray-700">{displayContent}</p>
          {story.content && story.content.length > 200 && (
            <button
              onClick={() => setShowFullStory(!showFullStory)}
              className="flex items-center space-x-1 text-green-600 font-medium mt-2"
            >
              <span>{showFullStory ? 'Show less' : 'Read more'}</span>
              {showFullStory ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Tags */}
        {story.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        )}

        {/* Achievements */}
        {story.achievements?.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
              <FaAward className="mr-2" /> Key Achievements
            </h5>
            <div className="grid grid-cols-2 gap-3">
              {story.achievements.map((a, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{a.value}</div>
                  <div className="text-sm text-blue-700">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-3 border-t bg-gray-50 flex justify-between text-sm text-gray-600">
        <div className="flex space-x-4">
          <span className="flex items-center space-x-1">
            <FaHeart className="text-red-500" /> {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </span>
          <span className="flex items-center space-x-1">
            <FaComment className="text-blue-500" /> {story.commentsCount || 0} comments
          </span>
          <span className="flex items-center space-x-1">
            <FaEye className="text-green-500" /> {story.views || 0} views
          </span>
        </div>
        <span className="flex items-center space-x-1">
          <FaShare /> {story.shares || 0} shares
        </span>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t flex justify-between">
        <div className="flex space-x-1">
          <button
            onClick={handleLike}
            disabled={!canInteract}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${isLiked ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'} ${!canInteract && 'opacity-50'}`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />} <span>Like</span>
          </button>
          <button disabled={!canInteract} className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50">
            <FaComment /> <span>Comment</span>
          </button>
          <button disabled={!canInteract} className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50">
            <FaShare /> <span>Share</span>
          </button>
        </div>
        <button className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">Read Full Story</button>
      </div>

      {/* Access Control */}
      {!canInteract && (
        <div className="bg-blue-50 border-t px-6 py-4 text-center text-sm text-blue-800">
          <p><strong>Login to interact:</strong> Like, comment, and share stories.</p>
          <button onClick={() => (window.location.href = '/login')} className="mt-2 underline">Login now</button>
        </div>
      )}

      {/* Farmer Author CTA */}
      {story.author?.role === 'farmer' && story.author?.farmProfile && (
        <div className="bg-green-50 border-t px-6 py-4 flex justify-between items-center">
          <div>
            <p className="font-medium">Interested in {story.author.name}'s farming?</p>
            <p className="text-sm">Connect or explore their profile</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border text-green-600 rounded-lg">View Profile</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Connect</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
