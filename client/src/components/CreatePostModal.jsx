/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPost,
  clearError,
  setShowCreatePostModal,
  invalidatePostsCache
} from '../redux/slices/farmConnectSlice';
import { toast } from 'react-toastify';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const imageRef = useRef(null);
  const dispatch = useDispatch();
  const {
    createLoading,
    error,
    showCreatePostModal,
    currentUser
  } = useSelector((state) => state.farmConnect);

  // Use Redux modal state if provided, otherwise use prop
  const modalIsOpen = showCreatePostModal !== undefined ? showCreatePostModal : isOpen;

  // Clear form and error when modal opens/closes
  useEffect(() => {
    if (modalIsOpen) {
      setContent('');
      setSelectedImages([]);
      setImagePreview([]);
      dispatch(clearError());
      if (imageRef.current) {
        imageRef.current.value = '';
      }
    }
  }, [modalIsOpen, dispatch]);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 4) {
      toast.error('Maximum 4 images allowed');
      validFiles.splice(4);
    }

    setSelectedImages(validFiles);

    // Generate preview URLs
    const previewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  // Remove image from selection
  const removeImage = (index) => {
    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreview.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreview[index]);

    setSelectedImages(newSelectedImages);
    setImagePreview(newPreviewUrls);

    // Update file input
    if (imageRef.current && newSelectedImages.length === 0) {
      imageRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Post content is required");
      return;
    }

    if (content.trim().length > 2000) {
      toast.error("Post content must be less than 2000 characters");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content.trim());

      // Append selected images
      selectedImages.forEach(file => {
        formData.append("images", file);
      });

      // The Redux slice handles optimistic updates and success messages
      await dispatch(createPost(formData)).unwrap();

      // Success handling - form is cleared by Redux state change
      handleClose();

      // Invalidate cache to ensure fresh data on next fetch
      dispatch(invalidatePostsCache());

    } catch (err) {
      // Error is already handled by the Redux slice with toast
      console.error('Failed to create post:', err);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    imagePreview.forEach(url => URL.revokeObjectURL(url));

    setContent('');
    setSelectedImages([]);
    setImagePreview([]);
    dispatch(clearError());

    if (imageRef.current) {
      imageRef.current.value = '';
    }

    // Handle both Redux modal state and prop-based modal
    if (showCreatePostModal !== undefined) {
      dispatch(setShowCreatePostModal(false));
    } else {
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            type="button"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What's happening on your farm today?"
              rows="4"
              maxLength="2000"
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {content.length}/2000
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Images (Max 4)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              ref={imageRef}
              multiple
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, JPG, PNG. Max size: 5MB per image.
            </p>
          </div>

          {/* Image Previews */}
          {imagePreview.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Images ({imagePreview.length})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={createLoading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading || !content.trim()}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
