import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, clearError, fetchPosts } from '../redux/slices/farmConnectSlice';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const imageRef = useRef(null);
  const dispatch = useDispatch();
  const { createLoading, error } = useSelector((state) => state.farmConnect);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Post content is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      if (imageRef.current?.files.length) {
        Array.from(imageRef.current.files).forEach(file => {
          formData.append("images", file);
        });
      }
      await dispatch(createPost(formData)).unwrap();
      setContent('');
      if (imageRef.current) imageRef.current.value = '';
      dispatch(clearError());
      dispatch(fetchPosts());
      onClose();
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err?.message || "Failed to create post");
    }
  };

  const handleCancel = () => {
    dispatch(clearError());
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded p-3 mb-3"
            placeholder="What's on your mind?"
            required
          />
          <input type="file" accept="image/*" ref={imageRef} multiple className="mb-4" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
