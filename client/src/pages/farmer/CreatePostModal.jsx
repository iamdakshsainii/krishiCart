import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../redux/slices/farmConnectSlice';
import {
  FaTimes, FaImage, FaMapMarkerAlt, FaHashtag, FaTag,
  FaPlus, FaTrash, FaGlobe
} from 'react-icons/fa';

const CreatePostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { createLoading } = useSelector((state) => state.farmConnect);
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [postData, setPostData] = useState({
    content: '',
    category: '',
    location: '',
    tags: [],
    images: [],
    privacy: 'public'
  });

  const [currentTag, setCurrentTag] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    'General', 'Farming Tips', 'Harvest Update', 'Equipment',
    'Crop Care', 'Market News', 'Success Story', 'Question',
    'Weather Alert', 'Organic Farming', 'Technology'
  ];

  if (!isOpen) return null;

  // Restrict non-farmer users
  if (isAuthenticated && user?.role !== 'farmer') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimes className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600">
              Only farmers can create and publish posts in Farm Connect.
              You can still view, like, and comment on other posts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;

    if (postData.images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setPostData(prev => ({
          ...prev,
          images: [...prev.images, file]
        }));
        setImagePreviews(prev => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPostData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const tag = currentTag.trim();
    if (tag && !postData.tags.includes(tag) && postData.tags.length < 10) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || user?.role !== 'farmer') {
      alert('Only farmers are allowed to create posts.');
      return;
    }

    if (!postData.content.trim()) {
      alert('Post content is required.');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('content', postData.content.trim());
    formData.append('category', postData.category || 'General');
    formData.append('location', postData.location);
    formData.append('privacy', postData.privacy);
    formData.append('tags', JSON.stringify(postData.tags));

    postData.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      // ✅ Must dispatch the thunk to avoid getState error
      await dispatch(createPost(formData)).unwrap();

      // Reset
      setPostData({
        content: '',
        category: '',
        location: '',
        tags: [],
        images: [],
        privacy: 'public'
      });
      setImagePreviews([]);
      setCurrentTag('');
      onClose();
    } catch (err) {
      console.error('Create post failed:', err);
      alert(`Post creation failed: ${err}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{user?.name?.charAt(0) || 'F'}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <p className="text-sm text-gray-500">Share with your farming community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Content */}
          <div className="space-y-2">
            <textarea
              value={postData.content}
              onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="What's happening in your farm? Share updates or ask questions..."
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows="4"
            />
            <div className="text-right text-sm text-gray-400">
              {postData.content.length}/2000
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaTag className="mr-2" /> Category
              </label>
              <select
                value={postData.category}
                onChange={(e) => setPostData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-green-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaMapMarkerAlt className="mr-2" /> Location
              </label>
              <input
                type="text"
                value={postData.location}
                onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Delhi, India"
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaImage className="mr-2" /> Photos ({imagePreviews.length}/5)
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
              >
                <FaImage />
                <span>Add Photos</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index+1}`} className="w-full h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaHashtag className="mr-2" /> Tags
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
                className="flex-1 border rounded-lg p-2 focus:ring-green-500"
              />
              <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <FaPlus />
              </button>
            </div>
            {postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {postData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Privacy */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaGlobe className="mr-2" /> Privacy
            </label>
            <select
              value={postData.privacy}
              onChange={(e) => setPostData(prev => ({ ...prev, privacy: e.target.value }))}
              className="w-full border rounded-lg p-3 focus:ring-green-500"
            >
              <option value="public">🌍 Public - Everyone can see</option>
              <option value="farmers">👨‍🌾 Farmers Only</option>
              <option value="followers">👥 Followers Only</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button type="button" onClick={onClose} disabled={createLoading} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading || !postData.content.trim()}
              className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {createLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Posting...</span>
                </div>
              ) : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
