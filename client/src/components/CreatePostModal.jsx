import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/slices/farmConnectSlice';
import { setShowCreatePostModal } from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';

const CreatePostModal = () => {
  const dispatch = useDispatch();
  const { showCreatePostModal, createLoading } = useSelector(state => state.farmConnect);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    images.forEach(image => {
      formData.append('images', image);
    });

    dispatch(createPost(formData))
      .unwrap()
      .then(() => {
        setContent('');
        setImages([]);
        dispatch(setShowCreatePostModal(false));
      })
      .catch(error => {
        toast.error(error || 'Failed to create post');
      });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length + images.length > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }
    setImages([...images, ...e.target.files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!showCreatePostModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button
            onClick={() => dispatch(setShowCreatePostModal(false))}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Share your farming journey..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            required
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Images (max 5)</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              accept="image/*"
              disabled={images.length >= 5}
            />

            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => dispatch(setShowCreatePostModal(false))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={createLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={createLoading || !content.trim()}
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
