/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createStory,
  clearError,
  setShowCreateStoryModal,
  invalidateStoriesCache
} from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';
import { FaTimes, FaTrash, FaBookOpen, FaPlus, FaImage } from 'react-icons/fa';

const CreateStoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth || {});
  const {
    createLoading,
    error,
    showCreateStoryModal
  } = useSelector(state => state.farmConnect || {});

  // Use Redux modal state if provided, otherwise use prop
  const modalIsOpen = showCreateStoryModal !== undefined ? showCreateStoryModal : isOpen;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    coverImage: null,
    tags: [],
    achievements: [],
    timeline: '',
    readTime: 1
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentAchievement, setCurrentAchievement] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const coverImageRef = useRef(null);

  const storyCategories = [
    'Success Stories',
    'Farming Tips',
    'Organic Farming',
    'Career Change',
    'Women Empowerment',
    'Technology in Farming',
    'Sustainable Practices',
    'Community Impact',
    'Innovation',
    'Challenges Overcome',
    'Market Insights',
    'Weather & Climate',
    'Crop Management',
    'Livestock Care'
  ];

  // Auto-calculate read time based on content
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(Math.ceil(words / 200), 1);
    setFormData(prev => ({ ...prev, readTime }));
  }, [formData.content]);

  // Clear form and error when modal opens/closes
  useEffect(() => {
    if (modalIsOpen) {
      resetForm();
      dispatch(clearError());
    }
  }, [modalIsOpen, dispatch]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      coverImage: null,
      tags: [],
      achievements: [],
      timeline: '',
      readTime: 1
    });
    setCurrentTag('');
    setCurrentAchievement('');
    setCoverImagePreview(null);
    if (coverImageRef.current) {
      coverImageRef.current.value = '';
    }
  };

  // Handle access control
  if (modalIsOpen && isAuthenticated && user?.role !== 'farmer') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <FaBookOpen className="text-red-500 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Access Restricted</h2>
          </div>
          <p className="text-gray-600 mb-6">Only farmers can create and share stories.</p>
          <button
            onClick={handleClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Clean up previous preview URL
      if (coverImagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }

      setCoverImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, coverImage: file }));
    }
  };

  const removeCoverImage = () => {
    if (coverImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImagePreview(null);
    setFormData(prev => ({ ...prev, coverImage: null }));
    if (coverImageRef.current) {
      coverImageRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (!tag) {
      toast.error('Tag cannot be empty');
      return;
    }
    if (formData.tags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }
    if (formData.tags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    setCurrentTag('');
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAchievement = () => {
    const achievement = currentAchievement.trim();
    if (!achievement) {
      toast.error('Achievement cannot be empty');
      return;
    }
    if (formData.achievements.includes(achievement)) {
      toast.error('Achievement already exists');
      return;
    }
    if (formData.achievements.length >= 5) {
      toast.error('Maximum 5 achievements allowed');
      return;
    }
    setFormData(prev => ({ ...prev, achievements: [...prev.achievements, achievement] }));
    setCurrentAchievement('');
  };

  const removeAchievement = (achievementToRemove) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement !== achievementToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAchievementKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAchievement();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Story title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Story content is required');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.coverImage) {
      toast.error('Cover image is required');
      return;
    }

    if (formData.title.length > 100) {
      toast.error('Title must be less than 100 characters');
      return;
    }
    if (formData.content.length > 10000) {
      toast.error('Content must be less than 10,000 characters');
      return;
    }

    try {
      const data = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags' || key === 'achievements') {
          data.append(key, JSON.stringify(value));
        } else if (value !== null && value !== '') {
          data.append(key, value);
        }
      });

      // The Redux slice handles optimistic updates and success messages
      await dispatch(createStory(data)).unwrap();

      // Success - form is cleared by handleClose
      handleClose();

      // Invalidate cache to ensure fresh data
      dispatch(invalidateStoriesCache());

    } catch (err) {
      // Error is handled by Redux slice with toast
      console.error('Failed to create story:', err);
    }
  };

  const handleClose = () => {
    // Clean up preview URL
    if (coverImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview);
    }

    resetForm();
    dispatch(clearError());

    // Handle both Redux modal state and prop-based modal
    if (showCreateStoryModal !== undefined) {
      dispatch(setShowCreateStoryModal(false));
    } else if (onClose) {
      onClose();
    }
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && modalIsOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [modalIsOpen]);

  if (!modalIsOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaBookOpen className="text-purple-600 mr-3 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Create Your Story</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter an engaging title for your story"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength="100"
                  required
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.title.length}/100
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {storyCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Image */}
           <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Cover Image *
  </label>
  {coverImagePreview ? (
    <div className="relative">
      <img
        src={coverImagePreview}
        alt="Cover preview"
        className="w-full h-48 object-cover rounded-lg border"
      />
      <button
        type="button"
        onClick={removeCoverImage}
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
      >
        <FaTrash />
      </button>
    </div>
  ) : (
    <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors flex flex-col items-center">
      <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
      <p className="text-gray-600 mb-2">Click to upload cover image</p>
      <p className="text-sm text-gray-500">Max size: 10MB. Supported: JPG, PNG</p>
      <input
        type="file"
        accept="image/*"
        ref={coverImageRef}
        onChange={handleCoverImageUpload}
        className="hidden"
        required
      />
    </label>
  )}
</div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Content *
              </label>
              <textarea
                placeholder="Tell your story... Share your experiences, challenges, and insights."
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength="10000"
                required
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Estimated read time: {formData.readTime} min</span>
                <span>{formData.content.length}/10,000</span>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Excerpt (Optional)
              </label>
              <textarea
                placeholder="A brief summary of your story (will be shown in previews)"
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength="200"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.excerpt.length}/200
              </div>
            </div>

            {/* Tags and Achievements Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Max 10)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength="20"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    disabled={formData.tags.length >= 10}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements (Max 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add an achievement"
                    value={currentAchievement}
                    onChange={(e) => setCurrentAchievement(e.target.value)}
                    onKeyPress={handleAchievementKeyPress}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength="50"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    disabled={formData.achievements.length >= 5}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm flex items-center justify-between"
                    >
                      <span>🏆 {achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(achievement)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Started farming in 2015, went organic in 2018"
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength="200"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={createLoading}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading || !formData.title.trim() || !formData.content.trim() || !formData.category || !formData.coverImage}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {createLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing Story...
                  </span>
                ) : (
                  'Publish Story'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
