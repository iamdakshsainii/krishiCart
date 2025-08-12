// src/components/PostCard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  likePost,
  addComment,
  sharePost
} from '../../redux/slices/farmConnectSlice';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaEllipsisV,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaPaperPlane,
  FaLeaf
} from 'react-icons/fa';

const PostCard = ({ post, userRole, canInteract = true }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth || {});
  const { realTimeUpdates } = useSelector(state => state.farmConnect || {});

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const initialLikes =
    Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
  const [localLiked, setLocalLiked] = useState(post.userLiked || false);
  const [localLikesCount, setLocalLikesCount] = useState(initialLikes);
  const [showFullContent, setShowFullContent] = useState(false);

  // Sync from real-time updates
  useEffect(() => {
    const realTimeLike = realTimeUpdates.likes?.[post.id];
    if (realTimeLike) {
      setLocalLiked(realTimeLike.userLiked);
      setLocalLikesCount(realTimeLike.likesCount);
    }
  }, [realTimeUpdates.likes, post.id]);

  const commentsCount = post.commentsCount ?? (post.comments?.length || 0);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return postTime.toLocaleDateString();
  };

  const handleLike = async () => {
    if (!canInteract || !user) return;
    const prevLiked = localLiked;
    const prevCount = localLikesCount;
    setLocalLiked(!prevLiked);
    setLocalLikesCount(prev => prevLiked ? prev - 1 : prev + 1);
    try {
      await dispatch(likePost(post.id)).unwrap();
    } catch (error) {
      setLocalLiked(prevLiked);
      setLocalLikesCount(prevCount);
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !canInteract || !user) return;
    setIsSubmittingComment(true);
    try {
      await dispatch(addComment({
        postId: post.id,
        content: newComment.trim()
      })).unwrap();
      setNewComment('');
      if (!showComments) setShowComments(true);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (!canInteract || !user) return;
    try {
      await dispatch(sharePost(post.id)).unwrap();
    } catch (error) {
      console.error('Failed to share post:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'farmer': return <FaLeaf className="text-green-500 text-sm" />;
      case 'customer': return <FaUser className="text-blue-500 text-sm" />;
      default: return <FaUser className="text-gray-500 text-sm" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      farmer: 'bg-green-100 text-green-800',
      customer: 'bg-blue-100 text-blue-800',
      admin: 'bg-purple-100 text-purple-800'
    };
    return badges[role] || 'bg-gray-100 text-gray-800';
  };

  const truncateContent = (content, maxLength = 300) => {
    if (!content) return '';
    return content.length <= maxLength ? content : content.slice(0, maxLength) + '...';
  };

  const displayContent = showFullContent
    ? post.content
    : truncateContent(post.content);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.author?.avatar || 'https://placehold.co/100x100'}
            alt={post.author?.name || 'Anonymous'}
            className="w-12 h-12 rounded-full border-2 border-green-100"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{post.author?.name || 'Anonymous User'}</h3>
              {getRoleIcon(post.author?.role)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(post.author?.role)}`}>
                {post.author?.role || 'Member'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <FaClock className="w-3 h-3" /> {formatTimeAgo(post.createdAt)}
              </span>
              {post.location && (
                <span className="flex items-center space-x-1">
                  <FaMapMarkerAlt className="w-3 h-3" /> {post.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {(user?.id === post.author?.id || user?.role === 'admin') && (
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaEllipsisV className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {post.category && (
          <span className="inline-block mb-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
            {post.category}
          </span>
        )}
        <p className="mb-4">{displayContent}
          {post.content && post.content.length > 300 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="ml-2 text-green-600 font-medium"
            >
              {showFullContent ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>

        {/* Images */}
        {post.images?.length > 0 && (
          <div className="mb-4">
            {post.images.length === 1 ? (
              <img src={post.images[0]} alt="Post" className="w-full h-64 object-cover rounded-xl" />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {post.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt="" className="w-full h-32 object-cover rounded-lg" />
                    {index === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white">
                        +{post.images.length - 4} more
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video */}
        {post.video && (
          <video src={post.video} controls className="w-full h-64 object-cover rounded-xl" />
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-3 border-t border-gray-50 flex justify-between text-sm text-gray-500">
        <div className="space-x-4 flex">
          {localLikesCount > 0 && <span>{localLikesCount} {localLikesCount === 1 ? 'like' : 'likes'}</span>}
          {commentsCount > 0 && <span>{commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}</span>}
        </div>
        {post.shares > 0 && <span>{post.shares} {post.shares === 1 ? 'share' : 'shares'}</span>}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-50 flex space-x-4">
        <button onClick={handleLike} disabled={!canInteract}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${localLiked ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'} ${!canInteract && 'opacity-50'}`}>
          {localLiked ? <FaHeart /> : <FaRegHeart />} <span>Like</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} disabled={!canInteract}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50">
          <FaComment /> <span>Comment</span>
        </button>
        <button onClick={handleShare} disabled={!canInteract}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50">
          <FaShare /> <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && canInteract && (
        <div className="bg-gray-50">
          <form onSubmit={handleComment} className="p-4 border-b flex space-x-3">
            <img src={user?.avatar || 'https://placehold.co/50'} alt="avatar" className="w-8 h-8 rounded-full" />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded-xl px-3 py-2"
              placeholder="Write a comment..."
            />
            <button type="submit" disabled={!newComment.trim() || isSubmittingComment}
              className="bg-green-500 text-white px-4 py-2 rounded-xl disabled:opacity-50">
              {isSubmittingComment ? '...' : <FaPaperPlane />}
            </button>
          </form>
          <div className="p-4 space-y-4">
            {post.comments?.map(c => (
              <div key={c.id} className="flex space-x-3">
                <img src={c.author?.avatar || 'https://placehold.co/50'} alt="" className="w-8 h-8 rounded-full" />
                <div className="bg-white p-3 rounded-xl flex-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <strong>{c.author?.name}</strong>
                    {getRoleIcon(c.author?.role)}
                    <span className="text-xs text-gray-500">{formatTimeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm">{c.content}</p>
                </div>
              </div>
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <p className="text-center text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      )}
      {showComments && !canInteract && (
        <div className="bg-gray-50 p-6 text-center text-gray-500">
          <FaComment className="mx-auto mb-2" />
          Login to view and add comments
        </div>
      )}
    </div>
  );
};

export default PostCard;
