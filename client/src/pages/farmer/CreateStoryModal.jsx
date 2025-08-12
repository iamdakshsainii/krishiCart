import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStory } from '../../redux/slices/farmConnectSlice';
import {
  FaTimes, FaImage, FaMapMarkerAlt, FaHashtag, FaQuoteLeft,
  FaPlus, FaTrash, FaAward, FaCalendarAlt, FaClock, FaBookOpen,
  FaGlobe, FaStar, FaLightbulb
} from 'react-icons/fa';

const CreateStoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth || {});
  const { createLoading } = useSelector(state => state.farmConnect || {});

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
    readTime: 1
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentAchievement, setCurrentAchievement] = useState({ label: '', value: '' });
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const coverImageRef = useRef(null);

  const storyCategories = [
    'Success Stories', 'Farming Tips', 'Organic Farming', 'Career Change',
    'Women Empowerment', 'Technology in Farming', 'Sustainable Practices',
    'Community Impact', 'Innovation', 'Challenges Overcome', 'Market Insights',
    'Weather & Climate', 'Crop Management', 'Livestock Care'
  ];

  const timelineOptions = [
    '1 month', '3 months', '6 months', '1 year', '2 years', '3-5 years', '5+ years'
  ];

  const estimateReadTime = (content) => {
    if (!content.trim()) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(Math.ceil(wordCount / wordsPerMinute), 1);
  };

  useEffect(() => {
    const readTime = estimateReadTime(storyData.content);
    setStoryData(prev => ({ ...prev, readTime }));
  }, [storyData.content]);

  // Cleanup image URL when modal closes
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  if (!isOpen) return null;

  // Only farmers can create stories
  if (isAuthenticated && user?.role !== 'farmer') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBookOpen className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Only farmers can create and publish stories. You can still view, like and comment on stories.
          </p>
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

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Image size should be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
      setStoryData(prev => ({ ...prev, coverImage: file }));
    }
  };

  const removeCoverImage = () => {
    if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImagePreview(null);
    setStoryData(prev => ({ ...prev, coverImage: null }));
    if (coverImageRef.current) {
      coverImageRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !storyData.tags.includes(tag) && storyData.tags.length < 8) {
      setStoryData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
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
    const { label, value } = currentAchievement;
    if (label.trim() && value.trim() && storyData.achievements.length < 6) {
      setStoryData(prev => ({
        ...prev,
        achievements: [...prev.achievements, { label: label.trim(), value: value.trim() }]
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

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAuthenticated || user?.role !== 'farmer') {
    alert('Only farmers are allowed to create stories.');
    return;
  }

  if (!storyData.title.trim() || !storyData.content.trim() || !storyData.category) {
    alert('Please fill required fields');
    return;
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('title', storyData.title.trim());
  formData.append('content', storyData.content.trim());
  formData.append('category', storyData.category);
  formData.append('tags', JSON.stringify(storyData.tags));
  formData.append('achievements', JSON.stringify(storyData.achievements));

  if (storyData.excerpt) formData.append('excerpt', storyData.excerpt);
  if (storyData.location) formData.append('location', storyData.location);
  if (storyData.timeline) formData.append('timeline', storyData.timeline);
  if (storyData.coverImage) formData.append('coverImage', storyData.coverImage);

  formData.append('readTime', storyData.readTime);

  try {
    await dispatch(createStory(formData)).unwrap();

    // Reset form
    setStoryData({
      title: '', content: '', excerpt: '', category: '', location: '',
      coverImage: null, tags: [], achievements: [], timeline: '', readTime: 1
    });
    setCurrentTag('');
    setCurrentAchievement({ label: '', value: '' });
    setCoverImagePreview(null);
    if (coverImageRef.current) coverImageRef.current.value = '';

    onClose();
  } catch (error) {
    console.error('Failed to create story:', error);
    alert(`Failed to create story: ${error}`);
  }
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <FaBookOpen className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Your Story</h2>
              <p className="text-sm text-gray-500">Share your farming journey with the community</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(95vh-140px)] overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaStar className="mr-2 text-yellow-500" /> Story Title
            </label>
            <input
              type="text"
              placeholder="Give your story a compelling title..."
              value={storyData.title}
              onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
              required
            />
            <div className="text-right text-xs text-gray-400">
              {storyData.title.length}/100
            </div>
          </div>

          {/* Category and Timeline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaBookOpen className="mr-2 text-blue-500" /> Category
              </label>
              <select
                value={storyData.category}
                onChange={(e) => setStoryData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select a Category</option>
                {storyCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaCalendarAlt className="mr-2 text-green-500" /> Timeline
              </label>
              <select
                value={storyData.timeline}
                onChange={(e) => setStoryData(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">How long did this take?</option>
                {timelineOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaImage className="mr-2 text-purple-500" /> Cover Image
            </label>

            {coverImagePreview ? (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverImageRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <FaImage className="text-4xl text-gray-400 mb-2" />
                <span className="text-gray-600">Click to upload cover image</span>
                <span className="text-sm text-gray-400">JPG, PNG up to 10MB</span>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={coverImageRef}
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaQuoteLeft className="mr-2 text-indigo-500" /> Excerpt (Optional)
            </label>
            <input
              type="text"
              placeholder="A short teaser for your story..."
              value={storyData.excerpt}
              onChange={(e) => setStoryData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-red-500" /> Location
            </label>
            <input
              type="text"
              placeholder="Where did this story happen?"
              value={storyData.location}
              onChange={(e) => setStoryData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Story Content */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span className="flex items-center">
                <FaLightbulb className="mr-2 text-orange-500" /> Your Story
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <FaClock className="mr-1" /> ~{storyData.readTime} min read
              </span>
            </label>
            <textarea
              placeholder="Tell your story... Share your challenges, successes, learnings, and inspire others in the farming community."
              value={storyData.content}
              onChange={(e) => setStoryData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Minimum 50 characters</span>
              <span>{storyData.content.length}/5000</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaHashtag className="mr-2 text-green-500" /> Tags (Max 8)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
                className="flex-1 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={storyData.tags.length >= 8}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus />
              </button>
            </div>
            {storyData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {storyData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaAward className="mr-2 text-yellow-500" /> Key Achievements (Max 6)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Achievement label"
                value={currentAchievement.label}
                onChange={(e) => setCurrentAchievement(prev => ({ ...prev, label: e.target.value }))}
                className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Value/Number"
                value={currentAchievement.value}
                onChange={(e) => setCurrentAchievement(prev => ({ ...prev, value: e.target.value }))}
                className="border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                disabled={storyData.achievements.length >= 6}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus />
              </button>
            </div>
            {storyData.achievements.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {storyData.achievements.map((ach, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center relative">
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                      <div className="text-lg font-bold text-blue-600">{ach.value}</div>
                      <div className="text-sm text-gray-700">{ach.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={createLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading || !storyData.title.trim() || !storyData.content.trim() || !storyData.category}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Publishing...</span>
                </div>
              ) : (
                'Publish Story'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
