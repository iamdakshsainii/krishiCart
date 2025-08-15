import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, addComment, deletePost } from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaPaperPlane,
  FaTrash,
  FaEllipsisV,
  FaUser
} from 'react-icons/fa';

const PostCard = ({ post, isOptimistic = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { likeLoading, commentLoading, deleteLoading } = useSelector(state => state.farmConnect);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [showOptions, setShowOptions] = useState(false);

  const formatTime = (date) => (date ? moment(date).fromNow() : 'Unknown time');

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }
    if (likeLoading[post._id]) return;

    try {
      await dispatch(likePost(post._id)).unwrap();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) return;

    try {
      await dispatch(addComment({ postId: post._id, content: commentText.trim() })).unwrap();
      setCommentText('');
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(post._id)).unwrap();
        toast.success('Post deleted successfully! 🗑️');
        setShowOptions(false);
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete post. Please try again.');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post?.user?.name || 'Farmer'}`,
        text: post?.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const likesArray = Array.isArray(post?.likes) ? post.likes : [];
  const isLiked = likesArray.some(like =>
    typeof like === 'string' ? like === user?._id : like?.user === user?._id
  );
  const likeCount = likesArray.length;
  const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;
  const isOwner = user?._id === post?.user?._id || user?.role === 'admin';

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isOptimistic ? 'opacity-70 ring-2 ring-green-200' : ''
    }`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {post?.user?.avatar ? (
                <img
                  src={post.user.avatar}
                  alt={post?.user?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-green-100"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className={`w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold ${
                  post?.user?.avatar ? 'hidden' : 'flex'
                }`}
              >
                {post?.user?.name ? post.user.name.charAt(0).toUpperCase() : <FaUser />}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {post?.user?.name || 'Unknown User'}
                </h4>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  🌱 Farmer
                </span>
              </div>
              <p className="text-gray-500 text-sm">{formatTime(post?.createdAt)}</p>
            </div>
          </div>

          {/* Options Menu for Owner */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <FaEllipsisV />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    disabled={deleteLoading[post._id]}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 text-sm transition-colors disabled:opacity-50"
                  >
                    <FaTrash />
                    <span>{deleteLoading[post._id] ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Optimistic Indicator */}
        {isOptimistic && (
          <div className="mt-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
              Publishing...
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post?.content}
        </p>
      </div>

      {/* Images */}
      {post?.images && Array.isArray(post.images) && post.images.length > 0 && (
        <div className="px-6 pb-4">
          <div className={`grid gap-2 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            post.images.length === 3 ? 'grid-cols-3' :
            'grid-cols-2'
          }`}>
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg bg-gray-100 ${
                  post.images.length === 3 && index === 0 ? 'col-span-3' :
                  post.images.length === 4 && index >= 2 ? 'col-span-1' :
                  ''
                }`}
              >
                {!imageErrors[index] ? (
                  <>
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => {
                        // Open image in new tab or modal
                        window.open(image, '_blank');
                      }}
                      onError={() => handleImageError(index)}
                    />
                    {/* Image overlay for extra images */}
                    {post.images.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-lg">
                        +{post.images.length - 4}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm">Failed to load image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={likeLoading[post._id] || isOptimistic}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all ${
                isLiked
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              } ${likeLoading[post._id] ? 'opacity-50' : ''}`}
            >
              {likeLoading[post._id] ? (
                <div className="animate-pulse">💭</div>
              ) : isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span className="text-sm font-medium">
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
            >
              <FaComment />
              <span className="text-sm font-medium">
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all"
            >
              <FaShare />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Comment Form */}
            {user && (
              <form onSubmit={handleComment} className="mb-4">
                <div className="flex space-x-3">
                  <div className="relative flex-shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || 'You'}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                        user?.avatar ? 'hidden' : 'flex'
                      }`}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={commentLoading[post._id]}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || commentLoading[post._id]}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {commentLoading[post._id] ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <FaPaperPlane className="text-sm" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {Array.isArray(post?.comments) && post.comments.map((comment) => (
                <div key={comment._id || `comment-${Math.random()}`} className="flex space-x-3">
                  <div className="relative flex-shrink-0">
                    {comment?.user?.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment?.user?.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                        comment?.user?.avatar ? 'hidden' : 'flex'
                      }`}
                    >
                      {comment?.user?.name ? comment.user.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {comment?.user?.name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(comment?.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{comment?.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
