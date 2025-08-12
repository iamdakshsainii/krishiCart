import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Send, Heart } from 'lucide-react';
import { addComment, setSelectedPost } from '../../redux/slices/farmConnectSlice';

const CommentModal = () => {
  const dispatch = useDispatch();
  const { selectedPost, user } = useSelector(state => state.farmConnect);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Suresh Kumar',
      avatar: '/api/placeholder/32/32',
      content: 'Great quality produce! I\'m interested in bulk purchase.',
      timestamp: '1h ago',
      likes: 3
    },
    {
      id: 2,
      author: 'Ravi Singh',
      avatar: '/api/placeholder/32/32',
      content: 'Your tomatoes look fresh and healthy. What\'s your farming method?',
      timestamp: '45m ago',
      likes: 1
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      author: user?.name || 'Anonymous',
      avatar: user?.avatar || '/api/placeholder/32/32',
      content: comment,
      timestamp: 'Just now',
      likes: 0
    };

    setComments(prev => [...prev, newComment]);
    dispatch(addComment({ postId: selectedPost?.id, comment: newComment }));
    setComment('');
  };

  if (!selectedPost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Comments</h3>
          <button
            onClick={() => dispatch(setSelectedPost(null))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">{comment.author}</p>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{comment.likes}</span>
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-3">
            <img
              src={user?.avatar || '/api/placeholder/32/32'}
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
