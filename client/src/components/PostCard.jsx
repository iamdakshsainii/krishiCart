import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, addComment } from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';
import moment from 'moment';

const PostCard = ({
  post,
  isOptimistic = false,
  onLike,
  onComment
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { likeLoading, commentLoading } = useSelector((state) => state.farmConnect);

  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const formatTime = (date) => (date ? moment(date).fromNow() : 'Unknown time');

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    if (likeLoading[post._id]) return;

    try {
      if (onLike) {
        onLike();
      } else {
        await dispatch(likePost(post._id)).unwrap();
      }
    } catch (error) {
      // Error is handled by Redux slice
      console.error('Like error:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (commentLoading[post._id]) return;

    try {
      if (onComment) {
        onComment(comment.trim());
      } else {
        await dispatch(addComment({
          postId: post._id,
          content: comment.trim()
        })).unwrap();
      }
      setComment('');
    } catch (error) {
      // Error is handled by Redux slice
      console.error('Comment error:', error);
    }
  };

  // Handle Enter key for comment submission
  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // ✅ FIX: Check if user has liked the post - ensure likes is an array
  const isLiked = Array.isArray(post?.likes) && post.likes.some(like =>
    typeof like === 'string' ? like === user?._id : like?.user === user?._id
  );

  const likeCount = Array.isArray(post?.likes) ? post.likes.length : 0;
  const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 ${
      isOptimistic ? 'opacity-70 ring-2 ring-blue-200' : ''
    }`}>
      {/* Post Header */}
      <div className="flex items-center mb-3">
        <img
          src={post?.user?.avatar || '/default-avatar.png'}
          alt={post?.user?.name || 'User'}
          className="w-10 h-10 rounded-full mr-3 object-cover"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {post?.user?.name || 'Unknown User'}
            </h3>
            {post?.user?.role === 'farmer' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                🌱 Farmer
              </span>
            )}
            {isOptimistic && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                Posting...
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{formatTime(post?.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post?.content || ''}</p>
      </div>

      {/* Post Images */}
      {post?.images?.length > 0 && (
        <div className="mb-3">
          {post.images.length === 1 ? (
            <img
              src={post.images[0]}
              alt="Post"
              className="w-full max-h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {post.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Post ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {index === 3 && post.images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <span className="text-white font-semibold">
                        +{post.images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
        <button
          onClick={handleLike}
          disabled={likeLoading[post._id] || isOptimistic}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
            isLiked
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
          } ${likeLoading[post._id] ? 'opacity-50' : ''}`}
        >
          <span className="text-lg">
            {likeLoading[post._id] ? '💭' : isLiked ? '❤️' : '🤍'}
          </span>
          <span className="text-sm font-medium">
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium">
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </span>
        </button>

        <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 transition-colors">
          <span className="text-lg">📤</span>
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3">
          {/* Add Comment */}
          <div className="flex space-x-2">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="flex-1 flex space-x-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleCommentKeyPress}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={commentLoading[post._id] || isOptimistic}
                maxLength="500"
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading[post._id] || !comment.trim() || isOptimistic}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                  commentLoading[post._id] || !comment.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {commentLoading[post._id] ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>

          {/* Character Count */}
          {comment && (
            <div className="text-right text-xs text-gray-500 ml-10">
              {comment.length}/500
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(post?.comments || []).map((comment) => (
              <div
                key={comment?._id}
                className={`flex space-x-2 ${
                  comment?.isTemporary ? 'opacity-60' : ''
                }`}
              >
                <img
                  src={comment?.user?.avatar || '/default-avatar.png'}
                  alt={comment?.user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment?.user?.name || 'Unknown User'}
                    </p>
                    {comment?.isTemporary && (
                      <span className="text-xs text-blue-500">Sending...</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {comment?.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(comment?.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {commentCount === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
