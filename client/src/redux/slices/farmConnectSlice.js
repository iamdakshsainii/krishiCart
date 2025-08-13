import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// =========================
// Helper functions
// =========================
const getAuthConfig = (getState, isMultipart = false) => {
  const token = getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json'
    }
  };
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  toast.error(message);
  return message;
};

// =========================
// Async Thunks
// =========================
export const createPost = createAsyncThunk(
  'farmConnect/createPost',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/farm-connect/posts`,
        formData,
        getAuthConfig(getState, true)
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createStory = createAsyncThunk(
  'farmConnect/createStory',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/farm-connect/stories`,
        formData,
        getAuthConfig(getState, true)
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const likePost = createAsyncThunk(
  'farmConnect/likePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/farm-connect/posts/${postId}/like`,
        {},
        getAuthConfig(getState)
      );
      return { postId, updatedPost: data.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addComment = createAsyncThunk(
  'farmConnect/addComment',
  async ({ postId, content }, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/farm-connect/posts/${postId}/comments`,
        { content },
        getAuthConfig(getState)
      );
      return { postId, newComment: data.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getFarmerProfile = createAsyncThunk(
  'farmConnect/getFarmerProfile',
  async (farmerId, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/farm-connect/farmers/${farmerId}`,
        getAuthConfig(getState)
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'farmConnect/fetchPosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/farm-connect/posts`,
        getAuthConfig(getState)
      );
      return data.data || [];
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchStories = createAsyncThunk(
  'farmConnect/fetchStories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/farm-connect/stories`,
        getAuthConfig(getState)
      );
      return data.data || [];
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// =========================
// Initial state
// =========================
const initialState = {
  posts: [],
  stories: [],
  currentUser: null,
  farmerProfile: null,
  activeTab: 'posts',
  postsLoading: false,
  storiesLoading: false,
  createLoading: false,
  error: null,
  showCreatePostModal: false,
  showCreateStoryModal: false
};

// =========================
// Slice
// =========================
const farmConnectSlice = createSlice({
  name: 'farmConnect',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => { state.currentUser = action.payload; },
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
    clearError: (state) => { state.error = null; },
    clearFarmerProfile: (state) => { state.farmerProfile = null; },
    setShowCreatePostModal: (state, action) => { state.showCreatePostModal = action.payload; },
    setShowCreateStoryModal: (state, action) => { state.showCreateStoryModal = action.payload; }
  },
  extraReducers: (builder) => {

    // CREATE POST
    builder
      .addCase(createPost.pending, (state) => { state.createLoading = true; state.error = null; })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // CREATE STORY
    builder
      .addCase(createStory.pending, (state) => { state.createLoading = true; state.error = null; })
      .addCase(createStory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.stories.unshift(action.payload);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // LIKE POST
    builder
      .addCase(likePost.pending, (state) => { state.postsLoading = true; state.error = null; })
      .addCase(likePost.fulfilled, (state, action) => {
        state.postsLoading = false;
        const { postId, updatedPost } = action.payload;
        const index = state.posts.findIndex(post => post._id === postId);
        if (index !== -1) state.posts[index] = updatedPost;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      });

    // ADD COMMENT
    builder
      .addCase(addComment.pending, (state) => { state.postsLoading = true; state.error = null; })
      .addCase(addComment.fulfilled, (state, action) => {
        state.postsLoading = false;
        const { postId, newComment } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post) post.comments.push(newComment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      });

    // GET FARMER PROFILE
    builder
      .addCase(getFarmerProfile.pending, (state) => { state.postsLoading = true; state.error = null; })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.farmerProfile = action.payload;
      })
      .addCase(getFarmerProfile.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      });

    // FETCH POSTS
    builder
      .addCase(fetchPosts.pending, (state) => { state.postsLoading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.posts = action.payload || [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
        state.posts = [];
      });

    // FETCH STORIES
    builder
      .addCase(fetchStories.pending, (state) => { state.storiesLoading = true; state.error = null; })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.storiesLoading = false;
        state.stories = action.payload || [];
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.storiesLoading = false;
        state.error = action.payload;
        state.stories = [];
      });
  }
});

export const {
  setCurrentUser,
  setActiveTab,
  clearError,
  clearFarmerProfile,
  setShowCreatePostModal,
  setShowCreateStoryModal
} = farmConnectSlice.actions;

export default farmConnectSlice.reducer;
