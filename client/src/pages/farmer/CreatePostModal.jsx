import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../redux/slices/farmConnectSlice';

const CreatePostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createLoading } = useSelector((state) => state.farmConnect);

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    // prepare post data
    const postData = {
      content: content.trim(),
      category,
      image
    };

    try {
      const resultAction = await dispatch(createPost(postData)).unwrap();
      // If fulfilled – clear form & close modal
      console.log('Post created:', resultAction);
      setContent('');
      setCategory('');
      setImage('');
      onClose();
    } catch (err) {
      console.error('Create post failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
            rows="4"
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
          />

          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={createLoading}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {createLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
