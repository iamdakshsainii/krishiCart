import React from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';

const StoryCard = ({ story, onLike }) => {
  const { user } = useSelector(state => state.auth);

  // Always handle likes as an array to avoid runtime errors
  const likesArray = Array.isArray(story.likes) ? story.likes : [];
  const isLiked = user?._id ? likesArray.includes(user._id) : false;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {/* User info */}
      <div className="flex items-center mb-3">
        <img
          src={story.user?.avatar || '/default-avatar.png'}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-medium">{story.user?.name || 'Unknown'}</h3>
          <p className="text-gray-500 text-xs">
            {story.createdAt
              ? new Date(story.createdAt).toLocaleDateString()
              : ''}
          </p>
        </div>
      </div>

      {/* Title & content */}
      <h2 className="text-xl font-bold mb-2">{story.title}</h2>
      <p className="mb-3">{story.content}</p>

      {/* Cover image */}
      {story.coverImage && (
        <img
          src={story.coverImage}
          alt="cover"
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}

      {/* Action buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onLike && onLike(story._id)}
          className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span className="ml-1">{likesArray.length}</span>
        </button>

        <button className="flex items-center text-gray-500">
          <FaComment />
          <span className="ml-1">
            {Array.isArray(story.comments) ? story.comments.length : 0}
          </span>
        </button>

        <button className="flex items-center text-gray-500">
          <FaShare />
          <span className="ml-1">{story.shares || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
