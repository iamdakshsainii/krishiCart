import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeStory, deleteStory } from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  FaHeart,
  FaRegHeart,
  FaClock,
  FaTag,
  FaEllipsisV,
  FaTrash,
  FaShareAlt,
  FaTrophy
} from 'react-icons/fa';

const StoryCard = ({
  story,
  isOptimistic = false,
  onClick,
  onLike,
  showFullContent = false
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { likeLoading, deleteLoading } = useSelector(
    state => state.farmConnect
  );
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(showFullContent);
  const [showOptions, setShowOptions] = useState(false);

  const formatDate = date =>
    date ? moment(date).fromNow() : 'Unknown time';

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like stories');
      return;
    }
    if (likeLoading[story._id]) return;
    try {
      if (onLike) {
        onLike();
      } else {
        await dispatch(likeStory(story._id)).unwrap();
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await dispatch(deleteStory(story._id)).unwrap();
        toast.success('Story deleted successfully! 🗑️');
        setShowOptions(false);
      } catch {
        toast.error('Failed to delete story. Please try again.');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt || story.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(story);
  };

  const getInitials = (name = '') => {
    const names = name.trim().split(' ');
    if (names.length === 0) return '';
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const likesArray = Array.isArray(story?.likes) ? story.likes : [];
  const isLiked = likesArray.some(like =>
    typeof like === 'string'
      ? like === user?._id || like === user?.id
      : like?.user === user?._id || like?.user === user?.id
  );
  const likeCount = likesArray.length;
  const readTime =
    story?.readTime ||
    Math.max(Math.ceil((story?.content?.length || 0) / 200), 1);
  const contentPreview =
    story?.content && story.content.length > 200 && !expanded
      ? story.content.substring(0, 200) + '...'
      : story.content;

  const getCategoryColor = category => {
    const colors = {
      'Success Stories': 'bg-green-100 text-green-800',
      'Farming Tips': 'bg-blue-100 text-blue-800',
      'Organic Farming': 'bg-emerald-100 text-emerald-800',
      'Career Change': 'bg-purple-100 text-purple-800',
      'Women Empowerment': 'bg-pink-100 text-pink-800',
      'Technology in Farming': 'bg-indigo-100 text-indigo-800',
      'Sustainable Practices': 'bg-teal-100 text-teal-800',
      'Community Impact': 'bg-orange-100 text-orange-800',
      Innovation: 'bg-violet-100 text-violet-800',
      'Challenges Overcome': 'bg-red-100 text-red-800',
      'Market Insights': 'bg-yellow-100 text-yellow-800',
      'Weather & Climate': 'bg-cyan-100 text-cyan-800',
      'Crop Management': 'bg-lime-100 text-lime-800',
      'Livestock Care': 'bg-amber-100 text-amber-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const isOwner =
    user?._id === story?.user?._id ||
    user?.id === story?.user?._id ||
    user?.role === 'admin';

  return (
    <article
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isOptimistic ? 'opacity-70 ring-2 ring-purple-200' : ''
      }`}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && story?.coverImage ? (
          <img
            src={story.coverImage}
            alt={story?.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={handleCardClick}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center cursor-pointer"
            onClick={handleCardClick}
          >
            <span className="text-white text-5xl font-bold select-none">
              {getInitials(story?.user?.name)}
            </span>
          </div>
        )}
        {/* Category Badge */}
        {story?.category && (
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                story.category
              )}`}
            >
              {story.category}
            </span>
          </div>
        )}
        {/* Options Menu */}
        {isOwner && (
          <div className="absolute top-4 right-4">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowOptions(prev => !prev);
              }}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-shadow shadow-sm"
              aria-label="Options"
            >
              <FaEllipsisV className="text-gray-600" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowOptions(false);
                    handleDelete();
                  }}
                  disabled={deleteLoading[story._id]}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FaTrash />{' '}
                  <span>
                    {deleteLoading[story._id]
                      ? 'Deleting...'
                      : 'Delete Story'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
        {/* Publishing badge */}
        {isOptimistic && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs animate-pulse select-none">
              Publishing...
            </span>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-4 space-x-4">
          {story?.user && (
            <div className="flex items-center space-x-3">
              {story.user.avatar ? (
                <img
                  src={story.user.avatar}
                  alt={story.user.name}
                  className="w-12 h-12 rounded-full ring-2 ring-gray-100 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full ring-2 ring-gray-100 bg-purple-700 text-white flex items-center justify-center font-bold text-lg select-none">
                  {getInitials(story.user.name)}
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-semibold text-sm">
                    {story.user.name}
                  </span>
                  <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs flex items-center select-none">
                    🌱 Farmer
                  </span>
                </div>
                <div className="flex space-x-3 text-xs text-gray-500">
                  <span>{formatDate(story.createdAt)}</span>
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {readTime} min read
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Title */}
        <h2
          className="text-xl font-bold mb-3 cursor-pointer hover:text-purple-600 transition"
          onClick={handleCardClick}
        >
          {story.title}
        </h2>
        {/* Excerpt */}
        {story.excerpt && (
          <p className="mb-3 italic text-gray-600 border-l-4 border-purple-300 pl-3">
            {story.excerpt}
          </p>
        )}
        {/* Content */}
        <p className="text-gray-800 mb-4 leading-relaxed">
          {contentPreview}
          {!showFullContent &&
            story.content &&
            story.content.length > 200 && (
              <button
                onClick={() => setExpanded(prev => !prev)}
                className="text-purple-600 hover:underline ml-2"
              >
                {expanded ? 'Show Less' : 'Read More'}
              </button>
            )}
        </p>
        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap space-x-2">
            {story.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center cursor-pointer hover:bg-gray-300 transition"
              >
                <FaTag className="mr-1" /> #{tag}
              </span>
            ))}
            {story.tags.length > 3 && (
              <span className="text-gray-500 text-xs ml-2">
                +{story.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        {/* Achievements */}
        {story.achievements && story.achievements.length > 0 && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800">
            <h5 className="flex items-center mb-2 font-semibold text-sm">
              <FaTrophy className="mr-2" /> Key Achievements
            </h5>
            <ul className="list-disc list-inside">
              {story.achievements.slice(0, 3).map((achv, idx) => (
                <li key={idx}>{achv}</li>
              ))}
              {story.achievements.length > 3 && (
                <li>and {story.achievements.length - 3} more...</li>
              )}
            </ul>
          </div>
        )}
        {/* Timeline */}
        {story.timeline && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800">
            <h5 className="flex items-center mb-2 font-semibold text-sm">
              <FaClock className="mr-2" /> Timeline
            </h5>
            <p>{story.timeline}</p>
          </div>
        )}
        {/* Actions */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <button
            onClick={handleLike}
            disabled={likeLoading[story._id]}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-100'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-100'
            } ${
              likeLoading[story._id] ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {likeLoading[story._id] ? (
              <span>⌛</span>
            ) : isLiked ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
            <span>
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-100 transition"
          >
            <FaShareAlt />
            <span>Share</span>
          </button>
          <button
            onClick={handleCardClick}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded shadow"
          >
            Read Full Story
          </button>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
