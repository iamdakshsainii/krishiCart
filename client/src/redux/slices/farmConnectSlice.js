// src/redux/slices/farmConnectSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// -------------------- HELPER FUNCTIONS --------------------
const validateUserRole = (getState, requiredRole) => {
  const { auth } = getState();
  if (!auth.isAuthenticated || !auth.user) {
    throw new Error('User not authenticated');
  }
  if (requiredRole && auth.user.role !== requiredRole) {
    throw new Error(`Only ${requiredRole}s can perform this action`);
  }
  return auth.user;
};

// -------------------- THUNKS --------------------

// Fetch Posts
export const fetchPosts = createAsyncThunk(
  'farmConnect/fetchPosts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/farm-connect/posts`, config);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch Stories
export const fetchStories = createAsyncThunk(
  'farmConnect/fetchStories',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/farm-connect/stories`, config);
      return data.data || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch a single Farmer profile
export const getFarmerProfile = createAsyncThunk(
  'farmConnect/getFarmerProfile',
  async (farmerId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_URL}/farm-connect/farmers/${farmerId}`, config);
      return data.data || data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Create Post (Farmers Only)
export const createPost = createAsyncThunk(
  'farmConnect/createPost',
  async (formData, { rejectWithValue, getState }) => {
    try {
      // ✅ Role validation - only farmers can create posts
      validateUserRole(getState(), 'farmer');

      const token = getState().auth.token;
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post(`${API_URL}/farm-connect/posts`, formData, config);
      toast.success('Post created successfully!');
      return data.data || data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Create Story (Farmers Only)
export const createStory = createAsyncThunk(
  'farmConnect/createStory',
  async (formData, { rejectWithValue, getState }) => {
    try {
      // ✅ Role validation - only farmers can create stories
      validateUserRole(getState(), 'farmer');

      const token = getState().auth.token;
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post(`${API_URL}/farm-connect/stories`, formData, config);
      toast.success('Story created successfully!');
      return data.data || data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Like Post (Farmers & Consumers)
export const likePost = createAsyncThunk(
  'farmConnect/likePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      // ✅ Role validation - farmers and consumers can like
      const user = validateUserRole(getState());
      if (!['farmer', 'consumer'].includes(user.role)) {
        throw new Error('Only farmers and consumers can like posts');
      }

      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${API_URL}/farm-connect/posts/${postId}/like`, {}, config);
      return { postId, data: data.data || data };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Like Story (Farmers & Consumers)
export const likeStory = createAsyncThunk(
  'farmConnect/likeStory',
  async (storyId, { rejectWithValue, getState }) => {
    try {
      // ✅ Role validation - farmers and consumers can like
      const user = validateUserRole(getState());
      if (!['farmer', 'consumer'].includes(user.role)) {
        throw new Error('Only farmers and consumers can like stories');
      }

      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${API_URL}/farm-connect/stories/${storyId}/like`, {}, config);
      return { storyId, data: data.data || data };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Add Comment (Farmers & Consumers)
export const addComment = createAsyncThunk(
  'farmConnect/addComment',
  async ({ postId, content }, { rejectWithValue, getState }) => {
    try {
      // ✅ Role validation - farmers and consumers can comment
      const user = validateUserRole(getState());
      if (!['farmer', 'consumer'].includes(user.role)) {
        throw new Error('Only farmers and consumers can comment');
      }

      const token = getState().auth.token;
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post(
        `${API_URL}/farm-connect/posts/${postId}/comments`,
        { content },
        config
      );
      toast.success('Comment added successfully!');
      return { postId, comment: data.data || data };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Share Post (Farmers & Consumers)
export const sharePost = createAsyncThunk(
  'farmConnect/sharePost',
  async (postId, { rejectWithValue, getState }) => {
    try {
      // ✅ Role validation - farmers and consumers can share
      const user = validateUserRole(getState());
      if (!['farmer', 'consumer'].includes(user.role)) {
        throw new Error('Only farmers and consumers can share posts');
      }

      const token = getState().auth.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${API_URL}/farm-connect/posts/${postId}/share`, {}, config);
      toast.success('Post shared successfully!');
      return { postId, data: data.data || data };
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// -------------------- SLICE --------------------

const initialState = {
  posts: [],
  stories: [],
  loading: false,
  postsLoading: false,
  storiesLoading: false,
  createLoading: false,
  error: null,
  activeTab: 'posts',
  currentUser: null,
  farmerProfile: null,
  farmerProfileLoading: false,
  showCreatePostModal: false,
  showCreateStoryModal: false,
  selectedPost: null,
  selectedStory: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'newest',
  // ✅ User interaction stats
  userStats: {
    totalPosts: 0,
    totalStories: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
  },
};

const farmConnectSlice = createSlice({
  name: 'farmConnect',
  initialState,
  reducers: {
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
    setCurrentUser: (state, action) => { state.currentUser = action.payload; },
    setFarmerProfile: (state, action) => { state.farmerProfile = action.payload; },
    clearFarmerProfile: (state) => { state.farmerProfile = null; },
    setShowCreatePostModal: (state, action) => { state.showCreatePostModal = action.payload; },
    setShowCreateStoryModal: (state, action) => { state.showCreateStoryModal = action.payload; },
    setSelectedPost: (state, action) => { state.selectedPost = action.payload; },
    setSelectedStory: (state, action) => { state.selectedStory = action.payload; },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setSelectedCategory: (state, action) => { state.selectedCategory = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    clearError: (state) => { state.error = null; },
    // ✅ Update user stats
    updateUserStats: (state, action) => {
      state.userStats = { ...state.userStats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.postsLoading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
        toast.error('Failed to load posts');
      })

      .addCase(fetchStories.pending, (state) => { state.storiesLoading = true; })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.storiesLoading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.storiesLoading = false;
        state.error = action.payload;
        toast.error('Failed to load stories');
      })

      .addCase(getFarmerProfile.pending, (state) => {
        state.farmerProfileLoading = true;
      })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.farmerProfileLoading = false;
        state.farmerProfile = action.payload;
      })
      .addCase(getFarmerProfile.rejected, (state, action) => {
        state.farmerProfileLoading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => { state.createLoading = true; })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;
        state.posts.unshift(action.payload);
        state.showCreatePostModal = false;
        // ✅ Update user stats
        state.userStats.totalPosts += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      .addCase(createStory.pending, (state) => { state.createLoading = true; })
      .addCase(createStory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.stories.unshift(action.payload);
        state.showCreateStoryModal = false;
        // ✅ Update user stats
        state.userStats.totalStories += 1;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // ✅ Handle like/comment/share with stats updates
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => (p.id || p._id) === action.payload.postId);
        if (post) {
          post.isLiked = action.payload.data.isLiked;
          post.likes = action.payload.data.likes || post.likes;
        }
        state.userStats.totalLikes += action.payload.data.isLiked ? 1 : -1;
      })

      .addCase(likeStory.fulfilled, (state, action) => {
        const story = state.stories.find(s => (s.id || s._id) === action.payload.storyId);
        if (story) {
          story.isLiked = action.payload.data.isLiked;
          story.likes = action.payload.data.likes || story.likes;
        }
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => (p.id || p._id) === action.payload.postId);
        if (post?.comments) {
          post.comments.unshift(action.payload.comment);
          state.userStats.totalComments += 1;
        }
      })

      .addCase(sharePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => (p.id || p._id) === action.payload.postId);
        if (post) {
          post.shares = (post.shares || 0) + 1;
          state.userStats.totalShares += 1;
        }
      });
  }
});

export const {
  setActiveTab,
  setCurrentUser,
  setFarmerProfile,
  clearFarmerProfile,           // ← This was missing!
  setShowCreatePostModal,
  setShowCreateStoryModal,
  setSelectedPost,
  setSelectedStory,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  clearError,
  updateUserStats
} = farmConnectSlice.actions;

// Default reducer export
export default farmConnectSlice.reducer;
