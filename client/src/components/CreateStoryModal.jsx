import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStory, fetchStories } from '../redux/slices/farmConnectSlice';
import { FaTimes, FaTrash, FaBookOpen, FaPlus } from 'react-icons/fa';

const CreateStoryModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth || {});
  const { createLoading } = useSelector(state => state.farmConnect || {});
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
  const coverImageRef = useRef(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

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


  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    setFormData((f) => ({ ...f, readTime: Math.max(Math.ceil(words / 200), 1) }));
  }, [formData.content]);

  if (!isOpen) return null;
  if (isAuthenticated && user?.role !== 'farmer') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded">
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="mb-4">Only farmers can create stories.</p>
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">OK</button>
        </div>
      </div>
    );
  }

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return alert('Max 10MB');
      if (!file.type.startsWith('image/')) return alert('Invalid file type');
      setCoverImagePreview(URL.createObjectURL(file));
      setFormData(f => ({ ...f, coverImage: file }));
    }
  };

  const removeCoverImage = () => {
    if (coverImagePreview?.startsWith('blob:')) URL.revokeObjectURL(coverImagePreview);
    setCoverImagePreview(null);
    setFormData(f => ({ ...f, coverImage: null }));
    if (coverImageRef.current) coverImageRef.current.value = '';
  };

  const handleAddTag = () => {
    const tag = currentTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(f => ({ ...f, tags: [...f.tags, tag] }));
      setCurrentTag('');
    }
  };
  const removeTag = (tag) => {
    setFormData(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category || !formData.coverImage) {
      return alert('Fill all required fields');
    }
   const data = new FormData();
Object.entries(formData).forEach(([key, value]) => {
  if (key === 'tags' || key === 'achievements') {
    data.append(key, JSON.stringify(value));
  } else if (value) {
    data.append(key, value);
  }
});


    try {
      await dispatch(createStory(data)).unwrap();
      dispatch(fetchStories());
      // Reset form
      setFormData({
        title: '', content: '', excerpt: '', category: '',
        coverImage: null, tags: [], achievements: [],
        timeline: '', readTime: 1
      });
      setCurrentTag('');
      setCoverImagePreview(null);
      if (coverImageRef.current) coverImageRef.current.value = '';
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create story');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-6 rounded max-w-4xl w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center"><FaBookOpen className="mr-2" /> Create Story</h2>
          <button onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title" value={formData.title}
            onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required className="border p-2 w-full" />
          <select value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
            required className="border p-2 w-full">
            <option value="">Select category</option>
            {storyCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <textarea placeholder="Content" rows={6} value={formData.content}
            onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} required className="border p-2 w-full" />

          {coverImagePreview ? (
            <div className="relative">
              <img src={coverImagePreview} alt="cover" className="w-full h-48 object-cover" />
              <button type="button" onClick={removeCoverImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><FaTrash /></button>
            </div>
          ) : (
            <input type="file" accept="image/*" ref={coverImageRef} onChange={handleCoverImageUpload} required />
          )}

          {/* Tags */}
          <div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add tag" value={currentTag}
                onChange={e => setCurrentTag(e.target.value)} className="border p-2 flex-1" />
              <button type="button" onClick={handleAddTag} className="bg-green-500 text-white px-3 rounded"><FaPlus /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded">
                  #{tag} <button type="button" onClick={() => removeTag(tag)}><FaTimes /></button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={createLoading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50">
            {createLoading ? 'Publishing...' : 'Publish Story'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateStoryModal;
