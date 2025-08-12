// src/components/CreateStoryModal.jsx
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStory } from '../../redux/slices/farmConnectSlice';
import {
  FaTimes,
  FaImage,
  FaMapMarkerAlt,
  FaHashtag,
  FaQuoteLeft,
  FaPlus,
  FaTrash,
  FaAward,
  FaCalendarAlt,
  FaClock,
  FaLeaf
} from 'react-icons/fa';

const CreateStoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth || {});
  const { loading } = useSelector(state => state.farmConnect || {});

  const [storyData, setStoryData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    location: '',
    coverImage: null,
    tags: [],
    achievements: [],
    timeline: '',
    readTime: 5
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentAchievement, setCurrentAchievement] = useState({ label: '', value: '' });
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
    'Challenges Overcome'
  ];

  const timelineOptions = [
    '1 month',
    '3 months',
    '6 months',
    '1 year',
    '2 years',
    '3-5 years',
    '5+ years'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storyData.title.trim() || !storyData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    if (!storyData.category) {
      alert('Please select a category');
      return;
    }

    try {
      await dispatch(createStory({
        ...storyData,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          verified: user.verified || false
        },
        readTime: Math.max(Math.ceil(storyData.content.length / 200), 1)
      })).unwrap();

      // Reset form and close modal
      setStoryData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        location: '',
        coverImage: null,
        tags: [],
        achievements: [],
        timeline: '',
        readTime: 5
      });
      onClose();
    } catch (error) {
      console.error('Failed to create story:', error);
      alert('Failed to create story. Please try again.');
    }
  };

  const handleCoverImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setStoryData(prev => ({
        ...prev,
        coverImage: URL.createObjectURL(file)
      }));
    }
  };

  const removeCoverImage = () => {
    setStoryData(prev => ({
      ...prev,
      coverImage: null
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !storyData.tags.includes(currentTag.trim()) && storyData.tags.length < 8) {
      setStoryData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAchievement = () => {
    if (currentAchievement.label.trim() && currentAchievement.value.trim() && storyData.achievements.length < 6) {
      setStoryData(prev => ({
        ...prev,
        achievements: [...prev.achievements, { ...currentAchievement }]
      }));
      setCurrentAchievement({ label: '', value: '' });
    }
  };

  const removeAchievement = (index) => {
    setStoryData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(Math.ceil(wordCount / wordsPerMinute), 1);
  };

  const handleContentChange = (content) => {
    setStoryData(prev => ({
      ...prev,
      content,
      readTime: estimateReadTime(content)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 text-white rounded-lg">
              <FaLeaf className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Share Your Farming Story</h2>
              <p className="text-sm text-gray-600">Inspire others with your journey and experiences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Story Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Title *</label>
                  <input
                    type="text"
                    value={storyData.title}
                    onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your story a compelling title..."
                    className="w-full p-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-semibold"
                    maxLength="100"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {storyData.title.length}/100
                  </div>
                </div>

                {/* Story Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Excerpt (Optional)
                  </label>
                  <div className="relative">
                    <FaQuoteLeft className="absolute top-3 left-3 text-green-500" />
                    <textarea
                      value={storyData.excerpt}
                      onChange={(e) => setStoryData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="A brief, inspiring quote or summary that captures the essence of your story..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none italic text-green-700"
                      rows="3"
                      maxLength="200"
                    />
                  </div>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {storyData.excerpt.length}/200
                  </div>
                </div>

                {/* Story Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Story *</label>
                  <textarea
                    value={storyData.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Share your farming journey... What challenges did you face? What successes have you achieved? What advice would you give to others?"
                    className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
                  />
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                    <span>Estimated read time: {storyData.readTime} min</span>
                    <span>{storyData.content.length} characters</span>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>

                  {!storyData.coverImage ? (
                    <div
                      onClick={() => coverImageRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                    >
                      <FaImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload a cover image</p>
                      <p className="text-sm text-gray-500">Recommended size: 1200x600px</p>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={storyData.coverImage}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleCoverImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Sidebar - Right Side */}
              <div className="space-y-6">
                {/* Category and Location */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={storyData.category}
                      onChange={(e) => setStoryData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                    >
                      <option value="">Select Category</option>
                      {storyCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={storyData.location}
                        onChange={(e) => setStoryData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Farm location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={storyData.timeline}
                        onChange={(e) => setStoryData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                      >
                        <option value="">How long ago?</option>
                        {timelineOptions.map(timeline => (
                          <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative flex-1">
                      <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Add tag"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                        maxLength="20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!currentTag.trim() || storyData.tags.length >= 8}
                      className="px-3 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus className="w-4 h-4" />
                    </button>
                  </div>

                  {storyData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {storyData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Achievements (Optional)
                  </label>
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={currentAchievement.value}
                      onChange={(e) => setCurrentAchievement(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Value (e.g., 50%, $10K, 2x)"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                    />
                    <input
                      type="text"
                      value={currentAchievement.label}
                      onChange={(e) => setCurrentAchievement(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Label (e.g., Increase in Yield)"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddAchievement}
                      disabled={!currentAchievement.label.trim() || !currentAchievement.value.trim() || storyData.achievements.length >= 6}
                      className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <FaAward className="w-4 h-4" />
                      <span>Add Achievement</span>
                    </button>
                  </div>

                  {storyData.achievements.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                      {storyData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded p-2">
                          <div className="text-sm">
                            <div className="font-semibold text-blue-600">{achievement.value}</div>
                            <div className="text-gray-600">{achievement.label}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview Info */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FaClock className="mr-2 text-green-500" />
                    Story Preview
                  </h4>
                  <ul className="space-y-1">
                    <li>• Read time: ~{storyData.readTime} minutes</li>
                    <li>• Characters: {storyData.content.length}</li>
                    <li>• Tags: {storyData.tags.length}/8</li>
                    <li>• Achievements: {storyData.achievements.length}/6</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Your story will inspire other farmers and help build our community.
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!storyData.title.trim() || !storyData.content.trim() || !storyData.category || loading}
                  className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{loading ? 'Publishing...' : 'Publish Story'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
