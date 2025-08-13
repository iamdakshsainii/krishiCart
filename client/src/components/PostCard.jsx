import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, addComment } from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';
import moment from 'moment';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const formatTime = (date) => (date ? moment(date).fromNow() : 'Unknown time');

  const handleLike = async () => {
    if (likeLoading || !post?._id) return;
    setLikeLoading(true);
    try {
      await dispatch(likePost(post._id)).unwrap();
    } catch (error) {
      toast.error(error.message || error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || commentLoading || !post?._id) return;
    setCommentLoading(true);
    try {
      await dispatch(addComment({ postId: post._id, content: comment })).unwrap();
      setComment('');
    } catch (error) {
      toast.error(error.message || error);
    } finally {
      setCommentLoading(false);
    }
  };

  // ✅ Use optional chaining and default empty array
  const isLiked = (post?.likes || []).includes(user?._id);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-3">
        <img
          src={post?.user?.avatar || '/default-avatar.png'}
          alt={post?.user?.name || 'User'}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold">{post?.user?.name || 'Unknown User'}</h3>
          <p className="text-gray-500 text-sm">{formatTime(post?.createdAt)}</p>
        </div>
      </div>

      <p className="mb-3">{post?.content || ''}</p>

      {post?.images?.length > 0 && (
        <div className="mb-3">
          <img
            src={post.images[0]}
            alt="Post"
            className="w-full rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <span className="mr-1">{likeLoading ? '...' : '❤️'}</span>
          <span>{post?.likes?.length || 0} likes</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500"
        >
          {post?.comments?.length || 0} comments
        </button>
      </div>

      {showComments && (
        <div className="mt-3">
          <div className="flex mb-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded-l-lg px-3 py-2"
              disabled={commentLoading}
            />
            <button
              onClick={handleAddComment}
              disabled={commentLoading}
              className={`px-3 py-2 rounded-r-lg text-white ${
                commentLoading ? 'bg-gray-400' : 'bg-green-500'
              }`}
            >
              {commentLoading ? 'Posting...' : 'Post'}
            </button>
          </div>

          <div className="space-y-3">
            {(post?.comments || []).map((comment) => (
              <div key={comment?._id} className="flex items-start">
                <img
                  src={comment?.user?.avatar || '/default-avatar.png'}
                  alt={comment?.user?.name || 'User'}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="font-semibold text-sm">{comment?.user?.name || 'Unknown User'}</p>
                  <p className="text-sm">{comment?.content}</p>
                  <p className="text-gray-500 text-xs">{formatTime(comment?.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
