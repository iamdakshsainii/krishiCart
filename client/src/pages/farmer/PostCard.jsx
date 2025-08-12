// src/components/PostCard.jsx
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, addComment, sharePost } from '../../redux/slices/farmConnectSlice';
import {
  FaHeart, FaRegHeart, FaComment, FaShare, FaMapMarkerAlt,
  FaHashtag, FaUser, FaSeedling, FaClock, FaGlobe, FaUsers, FaLock
} from 'react-icons/fa';

const PostCard = ({ post, userRole, canInteract }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth || {});
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  const postId = post.id || post._id;
  const isLiked = post.isLiked || false;
  const likesCount = post.likes || 0;
  const commentsCount = post.comments?.length || 0;
  const sharesCount = post.shares || 0;

  // Check if current user can interact (like, comment, share)
  const canUserInteract = isAuthenticated &&
    (userRole === 'farmer' || userRole === 'consumer') &&
    canInteract;

  const privacyIcon = useMemo(() => {
    switch (post.privacy) {
      case 'public': return FaGlobe;
      case 'farmers': return FaUsers;
      case 'private': return FaLock;
      default: return FaGlobe;
    }
  }, [post.privacy]);

  const PrivacyIcon = privacyIcon;

  const handleLike = async () => {
    if (!canUserInteract) {
      alert('Please log in to like posts');
      return;
    }

    try {
      await dispatch(likePost(postId)).unwrap();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!canUserInteract) {
      alert('Please log in to comment on posts');
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      await dispatch(addComment({
        postId,
        content: newComment.trim()
      })).unwrap();
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async () => {
    if (!canUserInteract) {
      alert('Please log in to share posts');
      return;
    }

    try {
      await dispatch(sharePost(postId)).unwrap();

      // Also copy link to clipboard
      if (navigator.share) {
        await navigator.share({
          title: 'Farm Connect Post',
          text: post.content.slice(0, 100) + '...',
          url: `${window.location.origin}/posts/${postId}`
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
        alert('Post link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share post:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 7) {
      return date.toLocaleDateString();
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const displayedImages = showAllImages ? post.images : post.images?.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {post.author?.name?.charAt(0) || 'F'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {post.author?.name || 'Anonymous Farmer'}
                </h4>
                {post.author?.verified && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <FaSeedling className="text-white text-xs" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <FaUser className="mr-1" />
                  {post.author?.role === 'farmer' ? 'Farmer' : 'User'}
                </span>
                {post.location && (
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {post.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              {post.category && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              )}
              <span className="flex items-center text-gray-400 text-xs">
                <PrivacyIcon className="mr-1" />
                {post.privacy || 'public'}
              </span>
            </div>
            <p className="text-xs text-gray-400 flex items-center">
              <FaClock className="mr-1" />
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            <div className={`grid gap-2 rounded-lg overflow-hidden ${
              displayedImages.length === 1 ? 'grid-cols-1' :
              displayedImages.length === 2 ? 'grid-cols-2' :
              displayedImages.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {displayedImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative ${
                    displayedImages.length === 3 && index === 0 ? 'row-span-2' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => {
                      // Open image in full screen (you can implement a modal here)
                      window.open(image, '_blank');
                    }}
                  />

                  {/* Show remaining images count */}
                  {!showAllImages && index === 3 && post.images.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                      onClick={() => setShowAllImages(true)}
                    >
                      <span className="text-white font-bold text-xl">
                        +{post.images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Show All Images Button */}
            {!showAllImages && post.images.length > 4 && (
              <button
                onClick={() => setShowAllImages(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all {post.images.length} images
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  <FaHashtag className="mr-1 text-xs" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
          <div className="flex items-center space-x-4">
            <span>{likesCount} likes</span>
            <span>{commentsCount} comments</span>
            <span>{sharesCount} shares</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!canUserInteract}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${!canUserInteract ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            <span className="text-sm font-medium">Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            disabled={!canUserInteract}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 ${
              !canUserInteract ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <FaComment />
            <span className="text-sm font-medium">Comment</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={!canUserInteract}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 ${
              !canUserInteract ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <FaShare />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 border-t border-gray-100">
            {/* Add Comment */}
            {canUserInteract && (
              <form onSubmit={handleAddComment} className="mb-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={commentLoading || !newComment.trim()}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {commentLoading ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {post.comments && post.comments.length > 0 ? (
                post.comments.slice(0, 5).map((comment, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {comment.author?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {comment.author?.name || 'Anonymous'}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FaComment className="mx-auto text-2xl mb-2 opacity-50" />
                  <p className="text-sm">No comments yet. Be the first to comment!</p>
                </div>
              )}

              {post.comments && post.comments.length > 5 && (
                <button className="w-full text-center py-2 text-green-600 hover:text-green-700 text-sm font-medium">
                  View all {post.comments.length} comments
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
