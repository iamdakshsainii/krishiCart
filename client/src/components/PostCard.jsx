import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, addComment } from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';
import moment from 'moment';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }
    dispatch(likePost(post._id || post.id));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    dispatch(addComment({
      postId: post._id || post.id,
      content: comment
    })).unwrap()
    .then(() => {
      setComment('');
    })
    .catch(error => {
      toast.error(error || 'Failed to add comment');
    });
  };

  const isLiked = post.likes?.some(like =>
    (typeof like === 'object' ? like._id : like) === user?._id
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-100">
      <div className="flex items-center mb-3">
        <img
          src={post.user?.avatar || '/default-avatar.png'}
          alt={post.user?.name}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h3 className="font-semibold">{post.user?.name}</h3>
          <p className="text-gray-500 text-xs">
            {moment(post.createdAt).fromNow()} • {post.user?.role}
          </p>
        </div>
      </div>

      <p className="mb-3 whitespace-pre-line">{post.content}</p>

      {post.images?.length > 0 && (
        <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Post ${i}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-b py-2 my-2">
        <button
          onClick={handleLike}
          className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <span className="mr-1">🔥</span>
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-500"
        >
          <span className="mr-1">💬</span>
          <span>{post.comments?.length || 0}</span>
        </button>

        <button className="flex items-center text-gray-500">
          <span className="mr-1">🔄</span>
          <span>{post.shares || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-3">
          <form onSubmit={handleComment} className="flex mb-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-3 rounded-r-lg hover:bg-green-700"
              disabled={!comment.trim()}
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {post.comments?.map((comment, i) => (
              <div key={i} className="flex items-start">
                <img
                  src={comment.user?.avatar || '/default-avatar.png'}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full mr-2 mt-1"
                />
                <div className="bg-gray-50 p-2 rounded-lg flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm mr-2">{comment.user?.name}</span>
                    <span className="text-gray-500 text-xs">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
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
